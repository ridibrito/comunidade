-- Singulari - Schema base (Montanha do amanhã)
-- Execute no SQL Editor do Supabase

-- Extensões
create extension if not exists pgcrypto;

-- Perfis
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  phone text,
  zip text,
  street text,
  number text,
  complement text,
  district text,
  city text,
  state text,
  role text,
  cpf text,
  birth_date date,
  occupation text,
  education text,
  marital_status text,
  created_at timestamptz not null default now()
);

-- Garante colunas quando a tabela já existia antes
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists zip text;
alter table public.profiles add column if not exists street text;
alter table public.profiles add column if not exists number text;
alter table public.profiles add column if not exists complement text;
alter table public.profiles add column if not exists district text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists cpf text;
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists occupation text;
alter table public.profiles add column if not exists education text;
alter table public.profiles add column if not exists marital_status text;

-- Trigger: cria perfil ao registrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper: checa se usuário é admin
create or replace function public.is_admin() returns boolean language sql stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Montanha do amanhã (programa)
create table if not exists public.mountains (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_url text,
  position int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mountains_position_idx on public.mountains(position);

-- Trilhas
create table if not exists public.trails (
  id uuid primary key default gen_random_uuid(),
  mountain_id uuid not null references public.mountains(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  cover_url text,
  position int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mountain_id, slug)
);
create index if not exists trails_mountain_idx on public.trails(mountain_id);

-- Módulos
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.trails(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  cover_url text,
  position int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trail_id, slug)
);
create index if not exists modules_trail_idx on public.modules(trail_id);

-- Aulas
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  video_url text,           -- YouTube/Vimeo/etc
  duration_seconds int,
  position int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);
create index if not exists lessons_module_idx on public.lessons(module_id);

-- Progresso por usuário/aula
create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  watched_seconds int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
-- Garante colunas quando progress já existia sem lesson_id
alter table public.progress add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.progress add column if not exists lesson_id uuid references public.lessons(id) on delete cascade;
alter table public.progress add column if not exists completed boolean not null default false;
alter table public.progress add column if not exists watched_seconds int not null default 0;
alter table public.progress add column if not exists updated_at timestamptz not null default now();
create index if not exists progress_lesson_idx on public.progress(lesson_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.mountains enable row level security;
alter table public.trails enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.progress enable row level security;

-- Família: membros, filhos e anamnese
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relationship text not null,
  age int,
  occupation text,
  education text,
  lives_with_child boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now()
);
create index if not exists family_members_user_idx on public.family_members(user_id);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  nickname text,
  birth_date date,
  gender text,
  school text,
  grade text,
  diagnosis text,
  giftedness_type text,
  avatar_url text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists children_user_idx on public.children(user_id);

create table if not exists public.anamneses (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  pregnancy_notes text,
  motor_development text,
  family_history text,
  health_notes text,
  sleep_routine text,
  feeding_notes text,
  relationship_family text,
  school_likes text,
  favorite_subjects text[],
  school_difficulties text,
  peer_relationship text,
  school_feedback text,
  cognitive_notes text,
  emotional_notes text,
  creativity_notes text,
  social_notes text,
  parents_perspective text,
  expectations text,
  created_at timestamptz not null default now()
);
create index if not exists anamneses_child_idx on public.anamneses(child_id);

-- adds for existing tables
alter table public.family_members add column if not exists avatar_url text;
alter table public.children add column if not exists avatar_url text;
alter table public.trails add column if not exists cover_url text;
alter table public.modules add column if not exists cover_url text;

-- Perfis: somente o próprio usuário pode ler/atualizar seu perfil; admins podem tudo
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_self_upsert on public.profiles;
create policy profiles_self_upsert on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles
  for delete
  to authenticated
  using (public.is_admin());

-- Conteúdos: leitura para autenticados quando publicados; admins podem tudo
drop policy if exists mountains_read_published on public.mountains;
create policy mountains_read_published on public.mountains
  for select using (((auth.role() = 'authenticated') and (published_at is not null)) or public.is_admin());

drop policy if exists mountains_admin_all on public.mountains;
create policy mountains_admin_all on public.mountains
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists trails_read on public.trails;
create policy trails_read on public.trails
  for select using ((auth.role() = 'authenticated') or public.is_admin());

drop policy if exists trails_admin_all on public.trails;
create policy trails_admin_all on public.trails
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists modules_read on public.modules;
create policy modules_read on public.modules
  for select using ((auth.role() = 'authenticated') or public.is_admin());

drop policy if exists modules_admin_all on public.modules;
create policy modules_admin_all on public.modules
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_read_published on public.lessons;
create policy lessons_read_published on public.lessons
  for select using (((auth.role() = 'authenticated') and (published_at is not null)) or public.is_admin());

drop policy if exists lessons_admin_all on public.lessons;
create policy lessons_admin_all on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- Progresso: usuário só acessa o próprio
drop policy if exists progress_read_own on public.progress;
create policy progress_read_own on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists progress_upsert_own on public.progress;
create policy progress_upsert_own on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists progress_update_own on public.progress;
create policy progress_update_own on public.progress
  for update using (auth.uid() = user_id);

-- RLS família
alter table public.family_members enable row level security;
alter table public.children enable row level security;
alter table public.anamneses enable row level security;

drop policy if exists family_members_own_select on public.family_members;
create policy family_members_own_select on public.family_members for select using (auth.uid() = user_id);
drop policy if exists family_members_own_modify on public.family_members;
create policy family_members_own_modify on public.family_members for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists children_own_select on public.children;
create policy children_own_select on public.children for select using (auth.uid() = user_id);
drop policy if exists children_own_modify on public.children;
create policy children_own_modify on public.children for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists anamneses_own_select on public.anamneses;
create policy anamneses_own_select on public.anamneses for select using (exists (
  select 1 from public.children c where c.id = child_id and c.user_id = auth.uid()
));
drop policy if exists anamneses_own_modify on public.anamneses;
create policy anamneses_own_modify on public.anamneses for all using (exists (
  select 1 from public.children c where c.id = child_id and c.user_id = auth.uid()
)) with check (exists (
  select 1 from public.children c where c.id = child_id and c.user_id = auth.uid()
));

-- Views/índices auxiliares podem ser adicionados depois


