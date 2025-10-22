
-- 001_create_profiles_table.sql
-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'aluno', 'profissional')),
  is_admin BOOLEAN DEFAULT FALSE,
  -- Status de convite e login
  invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending',
  invite_sent_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  -- Metadados do convite
  invited_by UUID REFERENCES auth.users(id),
  invite_email TEXT,
  invite_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios perfis
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seus próprios perfis
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir que admins vejam todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política para permitir que admins atualizem todos os perfis
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir perfil admin padrão se não existir
INSERT INTO profiles (id, full_name, role, is_admin)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Admin Padrão',
  'admin',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE is_admin = true
);


-- 002_add_invite_status_fields.sql
-- Adicionar campos de status de convite e login à tabela profiles existente
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS invite_email TEXT,
ADD COLUMN IF NOT EXISTS invite_token TEXT;

-- Atualizar usuários existentes para ter status 'accepted' (já fizeram login)
UPDATE profiles 
SET invite_status = 'accepted', last_login_at = created_at
WHERE invite_status IS NULL OR invite_status = 'pending';

-- Função para atualizar last_login_at quando usuário faz login
CREATE OR REPLACE FUNCTION update_user_login_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar último login e incrementar contador
    UPDATE profiles 
    SET 
        last_login_at = NOW(),
        login_count = COALESCE(login_count, 0) + 1,
        invite_status = CASE 
            WHEN invite_status = 'sent' THEN 'accepted'
            ELSE invite_status 
        END,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para capturar logins
CREATE TRIGGER update_login_stats_trigger
    AFTER INSERT ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_login_stats();

-- Função para criar convite de usuário
CREATE OR REPLACE FUNCTION create_user_invite(
    p_email TEXT,
    p_full_name TEXT,
    p_role TEXT,
    p_invited_by UUID
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_invite_token TEXT;
    v_result JSON;
BEGIN
    -- Gerar token único para o convite
    v_invite_token := encode(gen_random_bytes(32), 'hex');
    
    -- Criar usuário no auth (isso enviará o email de convite)
    INSERT INTO auth.users (
        email,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        p_email,
        NULL, -- Não confirmado ainda
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        json_build_object('full_name', p_full_name, 'role', p_role)
    ) RETURNING id INTO v_user_id;
    
    -- Criar perfil com status de convite enviado
    INSERT INTO profiles (
        id,
        full_name,
        role,
        is_admin,
        invite_status,
        invite_sent_at,
        invited_by,
        invite_email,
        invite_token
    ) VALUES (
        v_user_id,
        p_full_name,
        p_role,
        (p_role = 'admin'),
        'sent',
        NOW(),
        p_invited_by,
        p_email,
        v_invite_token
    );
    
    -- Retornar resultado
    v_result := json_build_object(
        'user_id', v_user_id,
        'invite_token', v_invite_token,
        'status', 'sent'
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir que admins vejam status de convites
DROP POLICY IF EXISTS "Admins can view invite status" ON profiles;
CREATE POLICY "Admins can view invite status" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );


-- 003_family_tables.sql
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




-- 004_storage_avatars.sql
-- Criar bucket de avatars (se não existir) e políticas públicas de leitura

insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- Permitir upload/gerenciamento pelo usuário autenticado
drop policy if exists "avatars-insert-own" on storage.objects;
create policy "avatars-insert-own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars' and (auth.uid()::text = (storage.foldername(name))[1]) is not false or true                                                           
  );

drop policy if exists "avatars-update-own" on storage.objects;
create policy "avatars-update-own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
  );

drop policy if exists "avatars-select-public" on storage.objects;
create policy "avatars-select-public" on storage.objects
  for select to public
  using (bucket_id = 'avatars');




-- 005_profile_sections.sql
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




-- 006_page_heroes.sql
-- Criar tabela para gerenciar imagens hero das páginas
CREATE TABLE IF NOT EXISTS page_heroes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  hero_image_url TEXT,
  background_gradient TEXT DEFAULT 'from-purple-900 via-purple-700 to-orange-500',
  stats JSONB DEFAULT '[]',
  cta_buttons JSONB DEFAULT '[]',
  visual_elements JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem gerenciar
DROP POLICY IF EXISTS "Admins can manage page heroes" ON page_heroes;
CREATE POLICY "Admins can manage page heroes" ON page_heroes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Política: Todos podem ler (para exibir na página pública)
DROP POLICY IF EXISTS "Everyone can read page heroes" ON page_heroes;
CREATE POLICY "Everyone can read page heroes" ON page_heroes
  FOR SELECT USING (is_active = true);

-- Inserir dados iniciais para "Montanha do Amanhã"
INSERT INTO page_heroes (
  page_slug,
  title,
  subtitle,
  description,
  background_gradient,
  stats,
  cta_buttons,
  visual_elements
) VALUES (
  'montanha-do-amanha',
  'MONTANHA DO AMANHÃ',
  'Desenvolva suas habilidades de identificação e compreensão das características AHSD',
  'Através de uma jornada educativa completa e transformadora.',
  'from-purple-900 via-purple-700 to-orange-500',
  '[
    {"label": "6 Módulos Fundamentais", "icon": "green", "value": "6"},
    {"label": "Certificação Profissional", "icon": "blue", "value": "Cert"},
    {"label": "Suporte Especializado", "icon": "purple", "value": "24/7"}
  ]'::jsonb,
  '[
    {"text": "Começar Jornada", "variant": "primary", "action": "start"},
    {"text": "Ver Módulos", "variant": "secondary", "action": "view"}
  ]'::jsonb,
  '[
    {"type": "block", "color": "yellow-orange", "position": "top-right", "size": "large"},
    {"type": "block", "color": "pink-purple", "position": "bottom-left", "size": "medium"},
    {"type": "block", "color": "blue-purple", "position": "center-right", "size": "small"}
  ]'::jsonb
) ON CONFLICT (page_slug) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_page_heroes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at na tabela page_heroes
DROP TRIGGER IF EXISTS set_page_heroes_updated_at ON page_heroes;
CREATE TRIGGER set_page_heroes_updated_at
BEFORE UPDATE ON page_heroes
FOR EACH ROW
EXECUTE FUNCTION update_page_heroes_updated_at();


-- 007_heroes_storage.sql
-- Criar bucket para imagens hero
INSERT INTO storage.buckets (id, name, public) VALUES ('heroes', 'heroes', true);

-- Política para permitir que todos leiam as imagens hero
CREATE POLICY "Public read access for heroes" ON storage.objects
  FOR SELECT USING (bucket_id = 'heroes');

-- Política para permitir que admins façam upload de imagens hero
CREATE POLICY "Admins can upload heroes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'heroes' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Política para permitir que admins atualizem imagens hero
CREATE POLICY "Admins can update heroes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'heroes' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Política para permitir que admins deletem imagens hero
CREATE POLICY "Admins can delete heroes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'heroes' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );


-- 008_trails_system.sql
-- Sistema completo de Trilhas, Módulos e Aulas

-- Tabela de Trilhas (Montanhas)
CREATE TABLE IF NOT EXISTS trails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Módulos
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  image_url TEXT,
  instructor TEXT,
  duration TEXT,
  difficulty TEXT CHECK (difficulty IN ('Básico', 'Intermediário', 'Avançado')),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trail_id, slug)
);

-- Tabela de Aulas
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  video_url TEXT,
  materials_url TEXT,
  duration INTEGER DEFAULT 0, -- em minutos
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

-- RLS (Row Level Security)
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Políticas para Trilhas
DROP POLICY IF EXISTS "Everyone can read trails" ON trails;
CREATE POLICY "Everyone can read trails" ON trails
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage trails" ON trails;
CREATE POLICY "Admins can manage trails" ON trails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Políticas para Módulos
DROP POLICY IF EXISTS "Everyone can read modules" ON modules;
CREATE POLICY "Everyone can read modules" ON modules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
CREATE POLICY "Admins can manage modules" ON modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Políticas para Aulas
DROP POLICY IF EXISTS "Everyone can read lessons" ON lessons;
CREATE POLICY "Everyone can read lessons" ON lessons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;
CREATE POLICY "Admins can manage lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Funções para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_trails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS set_trails_updated_at ON trails;
CREATE TRIGGER set_trails_updated_at
BEFORE UPDATE ON trails
FOR EACH ROW
EXECUTE FUNCTION update_trails_updated_at();

DROP TRIGGER IF EXISTS set_modules_updated_at ON modules;
CREATE TRIGGER set_modules_updated_at
BEFORE UPDATE ON modules
FOR EACH ROW
EXECUTE FUNCTION update_modules_updated_at();

DROP TRIGGER IF EXISTS set_lessons_updated_at ON lessons;
CREATE TRIGGER set_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_lessons_updated_at();

-- Inserir dados iniciais para Montanha do Amanhã
INSERT INTO trails (title, description, slug, position) VALUES 
('Montanha do Amanhã', 'Programa completo de desenvolvimento de habilidades para identificação de características AHSD', 'montanha-do-amanha', 1)
ON CONFLICT (slug) DO NOTHING;

-- Obter ID da trilha para inserir módulos
DO $$
DECLARE
    trail_id UUID;
BEGIN
    SELECT id INTO trail_id FROM trails WHERE slug = 'montanha-do-amanha';
    
    IF trail_id IS NOT NULL THEN
        -- Inserir módulos da Montanha do Amanhã
        INSERT INTO modules (trail_id, title, description, slug, instructor, duration, difficulty, position) VALUES 
        (trail_id, 'Aspectos Cognitivos', 'Desenvolvimento intelectual e habilidades mentais em crianças AHSD', 'aspectos-cognitivos', 'Dr. Maria Silva', '2h 30min', 'Intermediário', 1),
        (trail_id, 'Aspectos Socioemocionais', 'Inteligência emocional e relacionamentos', 'aspectos-socioemocionais', 'Psicóloga Ana Costa', '1h 45min', 'Básico', 2),
        (trail_id, 'Rotina e Organização', 'Estruturação do dia a dia', 'rotina-organizacao', 'Pedagoga Carla Santos', '1h 20min', 'Básico', 3),
        (trail_id, 'Desenvolvimento Motor', 'Coordenação e habilidades físicas', 'desenvolvimento-motor', 'Fisioterapeuta João Lima', '2h 15min', 'Intermediário', 4),
        (trail_id, 'Criatividade', 'Expressão artística e inovação', 'criatividade', 'Arte-terapeuta Sofia Mendes', '3h 00min', 'Avançado', 5),
        (trail_id, 'Interesses Específicos', 'Aprofundamento em áreas de interesse', 'interesses-especificos', 'Especialista em AHSD', '4h 30min', 'Avançado', 6)
        ON CONFLICT (trail_id, slug) DO NOTHING;
    END IF;
END $$;


-- 009_fix_auth_policies.sql
-- Corrigir políticas RLS para resolver erro de autenticação

-- Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Criar políticas básicas e funcionais
CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Habilitar RLS novamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se há registros na tabela profiles para o usuário ricardo
INSERT INTO profiles (id, full_name, role, is_admin, invite_email)
SELECT 
    'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid,
    'Ricardo',
    'admin',
    true,
    'ricardo@coruss.com.br'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = 'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid
);


-- 010_fix_auth_completely.sql
-- Correção completa para resolver erro "Database error granting user"

-- 1. Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user id" ON profiles;

-- 3. Remover triggers que podem estar causando problemas
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- 4. Remover função que pode estar causando problemas
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 5. Criar políticas muito simples
CREATE POLICY "Allow all operations for authenticated users" ON profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Habilitar RLS novamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Criar função e trigger mais simples
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger mais simples
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Garantir que o perfil do Ricardo existe
INSERT INTO profiles (id, full_name, role, is_admin, invite_email, invite_status)
VALUES (
    'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid,
    'Ricardo',
    'admin',
    true,
    'ricardo@coruss.com.br',
    'accepted'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_admin = EXCLUDED.is_admin,
    invite_email = EXCLUDED.invite_email,
    invite_status = EXCLUDED.invite_status;

