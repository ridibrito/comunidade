# 🚨 CONFIGURAR RESEND_API_KEY NO SUPABASE - URGENTE

## ❌ Problema Atual
O email NÃO está sendo enviado porque a Edge Function do Supabase **não tem** acesso à `RESEND_API_KEY`.

## ✅ Solução (5 minutos)

### 1️⃣ Obter a API Key do Resend

Você já tem a chave no `.env.local`. Vamos usá-la também no Supabase.

**Opção A: Copiar do .env.local**
```bash
# Abra o arquivo .env.local
# Procure por: RESEND_API_KEY=re_...
# Copie o valor (começa com re_)
```

**Opção B: Gerar nova no Resend**
```bash
1. Acesse: https://resend.com/api-keys
2. Clique em "Create API Key"
3. Nome: "Supabase Edge Function"
4. Copie a chave gerada
```

### 2️⃣ Configurar no Supabase

#### **Via Dashboard (Recomendado):**

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/functions

2. Vá em **Edge Functions** → **Configuration** → **Environment Variables** (ou **Secrets**)

3. Clique em **Add Variable** ou **New Secret**

4. Preencha:
   ```
   Name: RESEND_API_KEY
   Value: re_SuaChaveAqui (cole a chave)
   ```

5. Clique em **Save** ou **Add**

6. **IMPORTANTE:** A Edge Function já está deployada (versão 22), então vai funcionar imediatamente!

### 3️⃣ Testar

```bash
# Envie um novo convite
1. Acesse: http://localhost:3000/admin/users
2. Clique em "Adicionar Usuário"
3. Preencha com seu email
4. Envie

# Logs esperados:
✅ Email enviado com sucesso via Resend: { id: '...' }

# Verifique seu email (chega em segundos!)
```

## 📍 Onde Configurar Exatamente

### Caminho no Dashboard:
```
1. Dashboard do Supabase
   ↓
2. Seu projeto: appAldeia
   ↓
3. Settings (⚙️ ícone de engrenagem no menu lateral)
   ↓
4. Edge Functions (no submenu)
   ↓
5. Environment Variables ou Secrets
   ↓
6. Add Variable
```

### URL Direta:
```
https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/functions
```

## 🔍 Como Verificar se Foi Configurado

### No Dashboard:
- Vá em Settings → Edge Functions → Environment Variables
- Deve aparecer: `RESEND_API_KEY` na lista

### Testando:
```bash
# Envie um convite
# Se aparecer nos logs:
❌ "RESEND_API_KEY não configurada" → Ainda não configurou
✅ "Email enviado com sucesso via Resend" → Configurado!
```

## 📊 Status Atual

| Item | Status |
|------|--------|
| Edge Function atualizada | ✅ Versão 22 deployada |
| Código de envio | ✅ Integrado com Resend |
| RESEND_API_KEY no Supabase | ❌ FALTA CONFIGURAR |
| `.env.local` | ✅ Já tem a chave |

## 🎯 Próximos Passos

1. **Agora:** Configurar `RESEND_API_KEY` no Supabase
2. **Depois:** Testar enviando um convite
3. **Verificar:** Email deve chegar em segundos
4. **Restart servidor:** `Ctrl+C` e `npm run dev` (para limpar cache do favicon)

## ⚠️ Importante

- **A mesma chave** pode ser usada no Vercel, no Supabase e no `.env.local`
- **NÃO precisa** criar chaves diferentes
- **Uma chave** funciona para todos os ambientes

## 🐛 Troubleshooting

### "RESEND_API_KEY não configurada"
**Solução:**
- Certifique-se de salvar a variável no Supabase
- Aguarde alguns segundos para propagar
- Teste novamente

### "Invalid API key"
**Solução:**
- Verifique se copiou a chave completa (começa com `re_`)
- Não coloque aspas ao adicionar no Supabase
- Gere uma nova chave se necessário

### Email ainda não chega
**Solução:**
- Verifique os logs da Edge Function no Supabase
- Dashboard → Edge Functions → Logs
- Procure por erros

## 🎉 Depois de Configurar

**Sistema estará 100% funcional!**

- ✅ Usuário criado automaticamente
- ✅ Email enviado via Resend
- ✅ Senha temporária gerada
- ✅ Link para fazer login
- ✅ Tudo automatizado!

**Configure a variável e teste agora! 🚀**

