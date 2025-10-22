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
CREATE POLICY "Admins can manage page heroes" ON page_heroes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Política: Todos podem ler (para exibir na página pública)
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
