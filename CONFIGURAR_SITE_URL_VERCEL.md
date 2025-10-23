# Como Configurar SITE_URL no Vercel

## 🚨 Problema
Emails de convite ainda chegam com `localhost:3000` mesmo após deploy.

## 🔍 Causa
API routes do Next.js **NÃO** têm acesso a variáveis `NEXT_PUBLIC_*`. Essas variáveis são apenas para client-side.

## ✅ Solução

### 1. Adicionar Variável de Ambiente no Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Clique em "Add New"
3. Configure:
   ```
   Name: SITE_URL
   Value: https://app.aldeiasingular.com.br
   Environment: Production, Preview, Development
   ```
4. Clique em "Save"

### 2. Fazer Redeploy

Após adicionar a variável, você **DEVE** fazer redeploy:

```bash
# Via Vercel CLI
vercel --prod

# OU via Dashboard
Deployments → Redeploy (latest deployment)
```

### 3. Verificar Logs

Ao enviar um convite, verifique os logs da função:

```
🔗 URL de redirecionamento configurada: https://app.aldeiasingular.com.br
🔧 Variáveis disponíveis:
  SITE_URL: https://app.aldeiasingular.com.br
  VERCEL_URL: app-aldeiasingular-com-br.vercel.app
  NEXT_PUBLIC_SITE_URL: undefined
```

## 📝 Notas Importantes

### Variáveis NEXT_PUBLIC_*
- ✅ Acessíveis no **client-side** (navegador)
- ❌ NÃO acessíveis em **API routes** (server-side)

### Variáveis sem NEXT_PUBLIC_
- ✅ Acessíveis em **API routes** (server-side)
- ❌ NÃO acessíveis no **client-side** (navegador)

### Por que SITE_URL e não NEXT_PUBLIC_SITE_URL?
Porque a geração do link de convite acontece em uma **API route** (`/api/admin/invite-user`), que roda no servidor, não no navegador.

## 🧪 Como Testar

### 1. Teste Local (desenvolvimento)
```bash
# Adicione no .env.local
SITE_URL=http://localhost:3000

# Restart o servidor
npm run dev

# Envie um convite e verifique o console
```

### 2. Teste em Produção
```bash
# Após configurar no Vercel e fazer redeploy
1. Vá em Admin → Usuários
2. Envie um novo convite
3. Verifique o email recebido
4. O link deve ser: https://app.aldeiasingular.com.br/auth/reset?email=...
```

## 🔄 Fallback Automático

O código agora tem 3 níveis de fallback:

```typescript
const siteUrl = process.env.SITE_URL ||              // 1º: Variável configurada
  (process.env.VERCEL_URL                            // 2º: URL automática do Vercel
    ? `https://${process.env.VERCEL_URL}` 
    : null) ||
  'https://app.aldeiasingular.com.br';               // 3º: URL de produção hardcoded
```

Isso garante que **NUNCA** vai usar `localhost` em produção, mesmo que a variável `SITE_URL` não esteja configurada.

## ✅ Checklist

- [ ] Variável `SITE_URL` adicionada no Vercel
- [ ] Redeploy realizado
- [ ] Teste enviando novo convite
- [ ] Email recebido com URL de produção
- [ ] Link funciona corretamente

