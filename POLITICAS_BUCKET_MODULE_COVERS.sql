-- ========================================
-- POLÍTICAS DE ACESSO PARA BUCKET module-covers
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/sql/new
-- ========================================

-- 1. Política para INSERT (Upload de imagens)
-- Permite que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload module covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'module-covers');

-- 2. Política para UPDATE (Atualizar imagens)
-- Permite que usuários autenticados atualizem imagens
CREATE POLICY "Authenticated users can update module covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'module-covers');

-- 3. Política para DELETE (Excluir imagens)
-- Permite que usuários autenticados excluam imagens
CREATE POLICY "Authenticated users can delete module covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'module-covers');

-- 4. Política para SELECT (Visualizar imagens)
-- Permite que qualquer pessoa (público) visualize as imagens
CREATE POLICY "Anyone can view module covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'module-covers');

-- ========================================
-- PRONTO! 🎉
-- ========================================
-- Agora você pode:
-- 1. Fazer upload de imagens no admin
-- 2. As imagens serão públicas e acessíveis
-- 3. Apenas usuários autenticados podem gerenciar
-- ========================================

