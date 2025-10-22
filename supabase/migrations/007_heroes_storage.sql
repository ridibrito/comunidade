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
