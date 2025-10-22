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
CREATE POLICY "Everyone can read trails" ON trails
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage trails" ON trails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Políticas para Módulos
CREATE POLICY "Everyone can read modules" ON modules
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage modules" ON modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Políticas para Aulas
CREATE POLICY "Everyone can read lessons" ON lessons
  FOR SELECT USING (true);

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
