-- Adicionar coluna banner_url para armazenar o banner grande do módulo
ALTER TABLE public.modules 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Comentário explicativo
COMMENT ON COLUMN public.modules.banner_url IS 'URL da imagem banner grande para o módulo (2700x900px)';
