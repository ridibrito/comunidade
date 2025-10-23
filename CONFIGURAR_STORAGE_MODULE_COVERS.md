# Configurar Storage para Capas de Módulos

## Passos para criar o bucket no Supabase Dashboard

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/storage/buckets

2. **Criar novo bucket**
   - Clique em "New bucket"
   - Nome: `module-covers`
   - **IMPORTANTE**: Marque como **Public** (para as imagens serem acessíveis publicamente)
   - Clique em "Create bucket"

3. **Configurar políticas de acesso**
   - O bucket público já permite leitura para todos
   - Para permitir upload por usuários autenticados, vá em "Policies"
   - Adicione as seguintes políticas:

### Política de INSERT (Upload)
```sql
create policy "Authenticated users can upload module covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'module-covers');
```

### Política de UPDATE
```sql
create policy "Authenticated users can update module covers"
on storage.objects for update
to authenticated
using (bucket_id = 'module-covers');
```

### Política de DELETE
```sql
create policy "Authenticated users can delete module covers"
on storage.objects for delete
to authenticated
using (bucket_id = 'module-covers');
```

### Política de SELECT (Público)
```sql
create policy "Anyone can view module covers"
on storage.objects for select
to public
using (bucket_id = 'module-covers');
```

## Alternativa: Usar bucket existente

Se preferir usar um bucket já existente (como `avatars` ou `heroes`), edite o arquivo:
`src/app/(app)/admin/mountains/page.tsx`

Procure por:
```typescript
.from('module-covers')
```

E substitua por:
```typescript
.from('heroes') // ou 'avatars'
```

E ajuste o caminho:
```typescript
const filePath = `modules/${fileName}`; // ou `module-covers/${fileName}`
```

## Verificar buckets existentes

Execute no SQL Editor do Supabase:
```sql
SELECT * FROM storage.buckets;
```

## Testar upload

Após configurar o bucket:
1. Vá para `/admin/mountains`
2. Crie ou edite um módulo
3. Clique em "Upload" na seção de Imagem de Capa
4. Selecione uma imagem (JPG, PNG, WebP ou GIF, max 5MB)
5. A imagem será enviada e o preview aparecerá automaticamente

