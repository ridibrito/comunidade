-- ========================================
-- SISTEMA DE MARCOS (GAMIFICAÇÃO)
-- ========================================
-- Execute este SQL no SQL Editor do Supabase
-- Projeto: btuenakbvssiekfdbecx

-- 1. Tabela de marcos conquistados
create table if not exists public.marcos_conquistados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  trail_id uuid not null references public.trails(id) on delete cascade,
  conquered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, module_id)
);

-- 2. Índices para performance
create index if not exists marcos_user_idx on public.marcos_conquistados(user_id);
create index if not exists marcos_module_idx on public.marcos_conquistados(module_id);
create index if not exists marcos_trail_idx on public.marcos_conquistados(trail_id);
create index if not exists marcos_conquered_at_idx on public.marcos_conquistados(conquered_at);

-- 3. Habilitar RLS (Row Level Security)
alter table public.marcos_conquistados enable row level security;

-- 4. Políticas RLS
create policy "Users can view their own marcos" on public.marcos_conquistados
  for select using (auth.uid() = user_id);

create policy "Users can insert their own marcos" on public.marcos_conquistados
  for insert with check (auth.uid() = user_id);

-- 5. Função para conquistar marco automaticamente
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

-- 6. Trigger para conquistar marcos automaticamente
drop trigger if exists trigger_conquistar_marco on public.user_progress;
create trigger trigger_conquistar_marco
  after insert or update on public.user_progress
  for each row execute function public.conquistar_marco();

-- 7. Função para obter marcos de uma trilha
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

-- 8. Função para obter progresso de marcos
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

-- 9. View para estatísticas de marcos
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
