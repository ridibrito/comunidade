-- Tabelas para Anamnese, Rotina e Diário, com RLS por usuário

create table if not exists public.anamneses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid,
  title text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid,
  title text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid,
  content text,
  mood int,
  created_at timestamptz not null default now()
);

alter table public.anamneses enable row level security;
alter table public.routines enable row level security;
alter table public.diary_entries enable row level security;

-- Políticas: somente o próprio usuário acessa/seus registros
drop policy if exists "anamneses_select_own" on public.anamneses;
create policy "anamneses_select_own" on public.anamneses for select using (auth.uid() = user_id);
drop policy if exists "anamneses_insert_own" on public.anamneses;
create policy "anamneses_insert_own" on public.anamneses for insert with check (auth.uid() = user_id);
drop policy if exists "anamneses_update_own" on public.anamneses;
create policy "anamneses_update_own" on public.anamneses for update using (auth.uid() = user_id);
drop policy if exists "anamneses_delete_own" on public.anamneses;
create policy "anamneses_delete_own" on public.anamneses for delete using (auth.uid() = user_id);

drop policy if exists "routines_select_own" on public.routines;
create policy "routines_select_own" on public.routines for select using (auth.uid() = user_id);
drop policy if exists "routines_insert_own" on public.routines;
create policy "routines_insert_own" on public.routines for insert with check (auth.uid() = user_id);
drop policy if exists "routines_update_own" on public.routines;
create policy "routines_update_own" on public.routines for update using (auth.uid() = user_id);
drop policy if exists "routines_delete_own" on public.routines;
create policy "routines_delete_own" on public.routines for delete using (auth.uid() = user_id);

drop policy if exists "diary_select_own" on public.diary_entries;
create policy "diary_select_own" on public.diary_entries for select using (auth.uid() = user_id);
drop policy if exists "diary_insert_own" on public.diary_entries;
create policy "diary_insert_own" on public.diary_entries for insert with check (auth.uid() = user_id);
drop policy if exists "diary_update_own" on public.diary_entries;
create policy "diary_update_own" on public.diary_entries for update using (auth.uid() = user_id);
drop policy if exists "diary_delete_own" on public.diary_entries;
create policy "diary_delete_own" on public.diary_entries for delete using (auth.uid() = user_id);


