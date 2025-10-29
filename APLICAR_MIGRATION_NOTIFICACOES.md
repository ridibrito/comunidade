# 🔔 Aplicar Migration do Sistema de Notificações

## Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Cole o conteúdo do arquivo de migration:**
   - Abra o arquivo: `supabase/migrations/014_create_notifications_table.sql`
   - Copie todo o conteúdo
   - Cole no editor SQL

4. **Execute o SQL:**
   - Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

5. **Habilitar Realtime (Importante!):**
   - Vá em **Database** > **Replication**
   - Procure pela tabela `notifications`
   - Ative o toggle para habilitar replicação
   - Ou execute este SQL:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
   ```

## Opção 2: Via Supabase CLI

Se você tem o Supabase CLI instalado:

```bash
# Navegar para o diretório do projeto
cd "C:\Users\ricar\OneDrive\Área de Trabalho\comunidade"

# Aplicar migration
supabase migration up

# Ou aplicar migration específica
supabase db push --file supabase/migrations/014_create_notifications_table.sql
```

## Opção 3: Via Script Node.js

Execute o script que criamos:

```bash
# No diretório do projeto
node apply-notifications-migration.js
```

**Nota:** Certifique-se de que as variáveis de ambiente estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Opção 4: Via API REST do Supabase

Se você tem acesso ao service role key, pode executar via API:

```bash
curl -X POST "https://[seu-projeto].supabase.co/rest/v1/rpc/exec_sql" \
  -H "Content-Type: application/json" \
  -H "apikey: [SUPABASE_SERVICE_ROLE_KEY]" \
  -H "Authorization: Bearer [SUPABASE_SERVICE_ROLE_KEY]" \
  -d '{
    "sql": "[conteúdo do arquivo SQL aqui]"
  }'
```

## Verificação

Após aplicar a migration, verifique se tudo foi criado corretamente:

```sql
-- Verificar se a tabela existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'notifications';

-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'notifications';

-- Verificar funções criadas
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'create_notification',
  'mark_all_notifications_as_read',
  'get_unread_notifications_count'
);

-- Testar criação de notificação
SELECT public.create_notification(
  '00000000-0000-0000-0000-000000000000'::uuid, -- Use um UUID válido
  'Teste',
  'Notificação de teste',
  'info'
);
```

## Troubleshooting

### Erro: "relation already exists"
- A tabela já foi criada anteriormente
- Ignore este erro ou execute `DROP TABLE IF EXISTS public.notifications CASCADE;` antes

### Erro: "function already exists"
- As funções já existem
- Isso é normal se você executar a migration múltiplas vezes

### Erro: "permission denied"
- Certifique-se de usar a **Service Role Key** (não a Anon Key)
- Verifique as políticas RLS

### Realtime não funciona
- Certifique-se de habilitar a replicação no Dashboard
- Ou execute: `ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;`

## Próximos Passos

Após aplicar a migration:

1. ✅ Tabela `notifications` criada
2. ✅ Políticas RLS configuradas
3. ✅ Funções stored procedures criadas
4. ⚠️  Habilite Realtime (veja acima)
5. ✅ Teste o sistema criando uma notificação via API

## Exemplo de Teste

```typescript
// Via API
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Teste',
    message: 'Sistema funcionando!',
    type: 'success'
  })
});
```

---

**Migration pronta para ser aplicada!** 🚀
