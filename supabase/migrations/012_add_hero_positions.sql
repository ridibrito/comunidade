-- Adicionar colunas de posicionamento para título e subtítulo
ALTER TABLE page_heroes 
ADD COLUMN IF NOT EXISTS title_position TEXT DEFAULT 'center',
ADD COLUMN IF NOT EXISTS subtitle_position TEXT DEFAULT 'center';
