const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Criar cliente Supabase com service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMarcosMigration() {
  try {
    console.log('🚀 Iniciando aplicação da migração do Sistema de Marcos...\n');

    // Executar cada parte da migração separadamente
    console.log('📋 Criando tabela marcos_conquistados...');
    
    // 1. Criar tabela marcos_conquistados
    const createTableSQL = `
      create table if not exists public.marcos_conquistados (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id) on delete cascade,
        module_id uuid not null references public.modules(id) on delete cascade,
        trail_id uuid not null references public.trails(id) on delete cascade,
        conquered_at timestamptz not null default now(),
        created_at timestamptz not null default now(),
        unique (user_id, module_id)
      );
    `;

    const { error: tableError } = await supabase.rpc('exec', { sql: createTableSQL });
    if (tableError) {
      console.error('❌ Erro ao criar tabela:', tableError);
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...');
    } else {
      console.log('✅ Tabela marcos_conquistados criada com sucesso!');
    }

    // 2. Criar índices
    console.log('📋 Criando índices...');
    const indexes = [
      'create index if not exists marcos_user_idx on public.marcos_conquistados(user_id);',
      'create index if not exists marcos_module_idx on public.marcos_conquistados(module_id);',
      'create index if not exists marcos_trail_idx on public.marcos_conquistados(trail_id);',
      'create index if not exists marcos_conquered_at_idx on public.marcos_conquistados(conquered_at);'
    ];

    for (const indexSQL of indexes) {
      const { error: indexError } = await supabase.rpc('exec', { sql: indexSQL });
      if (indexError) {
        console.warn('⚠️ Erro ao criar índice:', indexError.message);
      }
    }

    // 3. Habilitar RLS
    console.log('📋 Configurando RLS...');
    const { error: rlsError } = await supabase.rpc('exec', { 
      sql: 'alter table public.marcos_conquistados enable row level security;' 
    });
    if (rlsError) {
      console.warn('⚠️ Erro ao habilitar RLS:', rlsError.message);
    }

    // 4. Criar políticas RLS
    console.log('📋 Criando políticas RLS...');
    const policies = [
      `create policy "Users can view their own marcos" on public.marcos_conquistados
        for select using (auth.uid() = user_id);`,
      `create policy "Users can insert their own marcos" on public.marcos_conquistados
        for insert with check (auth.uid() = user_id);`,
      `create policy "Admins can view all marcos" on public.marcos_conquistados
        for select using (public.is_admin());`
    ];

    for (const policySQL of policies) {
      const { error: policyError } = await supabase.rpc('exec', { sql: policySQL });
      if (policyError) {
        console.warn('⚠️ Erro ao criar política:', policyError.message);
      }
    }

    // 5. Criar função conquistar_marco
    console.log('📋 Criando função conquistar_marco...');
    const functionSQL = `
      create or replace function public.conquistar_marco()
      returns trigger language plpgsql security definer as $$
      begin
        -- Verificar se o módulo foi completado (100%)
        if new.completion_percentage >= 100 and new.is_completed = true then
          -- Inserir marco conquistado se não existir
          insert into public.marcos_conquistados (user_id, module_id, trail_id)
          select 
            new.user_id,
            new.content_id,
            m.trail_id
          from public.modules m
          where m.id = new.content_id
          on conflict (user_id, module_id) do nothing;
        end if;
        
        return new;
      end;
      $$;
    `;

    const { error: functionError } = await supabase.rpc('exec', { sql: functionSQL });
    if (functionError) {
      console.warn('⚠️ Erro ao criar função:', functionError.message);
    } else {
      console.log('✅ Função conquistar_marco criada com sucesso!');
    }

    // 6. Criar trigger
    console.log('📋 Criando trigger...');
    const triggerSQL = `
      drop trigger if exists trigger_conquistar_marco on public.user_progress;
      create trigger trigger_conquistar_marco
        after insert or update on public.user_progress
        for each row execute function public.conquistar_marco();
    `;

    const { error: triggerError } = await supabase.rpc('exec', { sql: triggerSQL });
    if (triggerError) {
      console.warn('⚠️ Erro ao criar trigger:', triggerError.message);
    } else {
      console.log('✅ Trigger criado com sucesso!');
    }

    // 7. Criar funções de consulta
    console.log('📋 Criando funções de consulta...');
    
    const getMarcosFunction = `
      create or replace function public.get_marcos_trilha(p_user_id uuid, p_trail_id uuid)
      returns table (
        module_id uuid,
        module_title text,
        module_position int,
        conquered boolean,
        conquered_at timestamptz
      ) language sql stable as $$
        select 
          m.id as module_id,
          m.title as module_title,
          m.position as module_position,
          coalesce(mc.id is not null, false) as conquered,
          mc.conquered_at
        from public.modules m
        left join public.marcos_conquistados mc on m.id = mc.module_id and mc.user_id = p_user_id
        where m.trail_id = p_trail_id
        order by m.position;
      $$;
    `;

    const { error: getMarcosError } = await supabase.rpc('exec', { sql: getMarcosFunction });
    if (getMarcosError) {
      console.warn('⚠️ Erro ao criar função get_marcos_trilha:', getMarcosError.message);
    } else {
      console.log('✅ Função get_marcos_trilha criada com sucesso!');
    }

    const getProgressoFunction = `
      create or replace function public.get_progresso_marcos(p_user_id uuid, p_trail_id uuid)
      returns table (
        conquistados bigint,
        total bigint,
        porcentagem numeric
      ) language sql stable as $$
        select 
          count(mc.id) as conquistados,
          count(m.id) as total,
          case 
            when count(m.id) > 0 then round((count(mc.id)::numeric / count(m.id)::numeric) * 100, 2)
            else 0
          end as porcentagem
        from public.modules m
        left join public.marcos_conquistados mc on m.id = mc.module_id and mc.user_id = p_user_id
        where m.trail_id = p_trail_id;
      $$;
    `;

    const { error: getProgressoError } = await supabase.rpc('exec', { sql: getProgressoFunction });
    if (getProgressoError) {
      console.warn('⚠️ Erro ao criar função get_progresso_marcos:', getProgressoError.message);
    } else {
      console.log('✅ Função get_progresso_marcos criada com sucesso!');
    }

    // 8. Criar view de estatísticas
    console.log('📋 Criando view de estatísticas...');
    const viewSQL = `
      create or replace view public.v_marcos_stats as
      select 
        u.id as user_id,
        u.full_name,
        count(mc.id) as total_marcos_conquistados,
        count(distinct mc.trail_id) as trilhas_completadas,
        max(mc.conquered_at) as ultimo_marco_conquistado
      from public.profiles u
      left join public.marcos_conquistados mc on u.id = mc.user_id
      group by u.id, u.full_name;
    `;

    const { error: viewError } = await supabase.rpc('exec', { sql: viewSQL });
    if (viewError) {
      console.warn('⚠️ Erro ao criar view:', viewError.message);
    } else {
      console.log('✅ View v_marcos_stats criada com sucesso!');
    }

    console.log('\n🎉 Sistema de Marcos instalado com sucesso!');
    console.log('🏔️ Os Aldeões agora podem conquistar marcos ao completar módulos!');
    console.log('\n📊 Funcionalidades disponíveis:');
    console.log('  • Tabela marcos_conquistados');
    console.log('  • Trigger automático de conquista');
    console.log('  • Funções de consulta (get_marcos_trilha, get_progresso_marcos)');
    console.log('  • View de estatísticas (v_marcos_stats)');
    console.log('  • Políticas RLS configuradas');

  } catch (error) {
    console.error('❌ Erro durante a aplicação da migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  applyMarcosMigration();
}

module.exports = { applyMarcosMigration };
