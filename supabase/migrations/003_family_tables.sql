-- Criação das tabelas family_members e children com RLS e políticas

-- Extensões necessárias (caso não existam)
create extension if not exists pgcrypto;

-- Tabela de membros da família
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Tabela de filhos
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birth_date date,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Habilitar RLS
alter table public.family_members enable row level security;
alter table public.children enable row level security;

-- Políticas: o usuário autenticado só vê/manipula seus próprios registros
drop policy if exists "family_members_select_own" on public.family_members;
create policy "family_members_select_own" on public.family_members
  for select using (auth.uid() = user_id);

drop policy if exists "family_members_insert_own" on public.family_members;
create policy "family_members_insert_own" on public.family_members
  for insert with check (auth.uid() = user_id);

drop policy if exists "family_members_update_own" on public.family_members;
create policy "family_members_update_own" on public.family_members
  for update using (auth.uid() = user_id);

drop policy if exists "family_members_delete_own" on public.family_members;
create policy "family_members_delete_own" on public.family_members
  for delete using (auth.uid() = user_id);

drop policy if exists "children_select_own" on public.children;
create policy "children_select_own" on public.children
  for select using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own" on public.children
  for insert with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own" on public.children
  for update using (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own" on public.children
  for delete using (auth.uid() = user_id);


