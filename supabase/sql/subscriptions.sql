create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'hotmart',
  product_id text not null,
  purchase_id text unique,
  status text not null check (status in ('active','pending','trial','past_due','canceled','refunded','chargeback')),
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  meta jsonb default '{}'::jsonb
);
create index if not exists idx_sub_user on public.subscriptions(user_id);
create index if not exists idx_sub_status on public.subscriptions(status);

create or replace view public.v_user_active as
select user_id
from public.subscriptions
where status in ('active','trial')
  and (ends_at is null or ends_at > now())
group by user_id;

-- policy exemplo para liberar acesso a conteúdo
-- using ( public.is_admin() or exists(select 1 from public.v_user_active ua where ua.user_id = auth.uid()) )


