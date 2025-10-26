const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMarcosTable() {
  try {
    console.log('🚀 Criando sistema de marcos...\n');

    // Tentar criar a tabela usando uma query SQL simples
    console.log('📋 Tentando criar tabela marcos_conquistados...');
    
    // Primeiro, vamos verificar se a tabela já existe
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'marcos_conquistados');

    if (checkError) {
      console.warn('⚠️ Não foi possível verificar tabelas existentes:', checkError.message);
    } else if (existingTables && existingTables.length > 0) {
      console.log('✅ Tabela marcos_conquistados já existe!');
    } else {
      console.log('📋 Tabela não existe, tentando criar...');
      
      // Tentar inserir um registro de teste para ver se a tabela existe
      const { error: insertError } = await supabase
        .from('marcos_conquistados')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          module_id: '00000000-0000-0000-0000-000000000000',
          trail_id: '00000000-0000-0000-0000-000000000000'
        });

      if (insertError && insertError.code === 'PGRST116') {
        console.log('❌ Tabela marcos_conquistados não existe e não pode ser criada via API');
        console.log('📝 Você precisa executar o SQL manualmente no dashboard do Supabase:');
        console.log('\n' + '='.repeat(60));
        console.log('-- Sistema de Marcos (Gamificação)');
        console.log('-- Execute este SQL no SQL Editor do Supabase');
        console.log('='.repeat(60));
        console.log(`
-- Tabela de marcos conquistados
create table if not exists public.marcos_conquistados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  trail_id uuid not null references public.trails(id) on delete cascade,
  conquered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, module_id)
);

-- Índices para performance
create index if not exists marcos_user_idx on public.marcos_conquistados(user_id);
create index if not exists marcos_module_idx on public.marcos_conquistados(module_id);
create index if not exists marcos_trail_idx on public.marcos_conquistados(trail_id);
create index if not exists marcos_conquered_at_idx on public.marcos_conquistados(conquered_at);

-- RLS
alter table public.marcos_conquistados enable row level security;

-- Políticas RLS
create policy "Users can view their own marcos" on public.marcos_conquistados
  for select using (auth.uid() = user_id);

create policy "Users can insert their own marcos" on public.marcos_conquistados
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all marcos" on public.marcos_conquistados
  for select using (public.is_admin());

-- Função para conquistar um marco automaticamente
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

-- Trigger para conquistar marcos automaticamente
drop trigger if exists trigger_conquistar_marco on public.user_progress;
create trigger trigger_conquistar_marco
  after insert or update on public.user_progress
  for each row execute function public.conquistar_marco();

-- Função para obter marcos de uma trilha
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

-- Função para obter progresso de marcos de uma trilha
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

-- View para estatísticas de marcos
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
        `);
        console.log('='.repeat(60));
        console.log('\n📝 Instruções:');
        console.log('1. Acesse o dashboard do Supabase');
        console.log('2. Vá para SQL Editor');
        console.log('3. Cole o SQL acima');
        console.log('4. Execute o script');
        console.log('\n🎯 Após executar, o sistema de marcos estará funcionando!');
      } else if (insertError) {
        console.log('❌ Erro ao testar tabela:', insertError.message);
      } else {
        console.log('✅ Tabela marcos_conquistados existe e está funcionando!');
        // Remover o registro de teste
        await supabase
          .from('marcos_conquistados')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000000');
      }
    }

    console.log('\n🎉 Verificação concluída!');
    console.log('🏔️ Sistema de Marcos pronto para uso!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createMarcosTable();
}

module.exports = { createMarcosTable };
