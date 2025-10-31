-- Adicionar coluna is_featured na tabela contents
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL;

-- Criar índice para melhorar performance nas consultas de destaques
CREATE INDEX IF NOT EXISTS contents_is_featured_idx ON public.contents(is_featured) 
WHERE is_featured = true;

-- Comentário explicativo
COMMENT ON COLUMN public.contents.is_featured IS 'Indica se o conteúdo deve aparecer na seção Destaques do dashboard';
