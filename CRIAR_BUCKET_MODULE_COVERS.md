# 🪣 Criar Bucket "module-covers" no Supabase

## ⚡ Passo a Passo Rápido

### 1. Acesse o Supabase Storage
```
https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/storage/buckets
```

### 2. Criar o Bucket
1. Clique no botão **"New bucket"**
2. Preencha:
   - **Name**: `module-covers`
   - **Public bucket**: ✅ **MARCAR** (importante!)
3. Clique em **"Create bucket"**

### 3. Configurar Políticas (SQL Editor)

Acesse: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/sql/new

Cole e execute este SQL:

```sql
-- Política para INSERT (Upload)
create policy "Authenticated users can upload module covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'module-covers');

-- Política para UPDATE
create policy "Authenticated users can update module covers"
on storage.objects for update
to authenticated
using (bucket_id = 'module-covers');

-- Política para DELETE
create policy "Authenticated users can delete module covers"
on storage.objects for delete
to authenticated
using (bucket_id = 'module-covers');

-- Política para SELECT (Público pode ver)
create policy "Anyone can view module covers"
on storage.objects for select
to public
using (bucket_id = 'module-covers');
```

## ✅ Pronto!

Agora você pode:
1. Ir para `/admin/mountains`
2. Criar/editar módulo
3. Usar o botão **"Upload"** para enviar imagens do seu computador
4. Ou usar o botão **"URL"** para colar links de imagens externas

### 📝 Formatos Aceitos
- JPG / JPEG
- PNG
- WebP
- GIF

### 📏 Tamanho Máximo
- 5 MB por imagem

