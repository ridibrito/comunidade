# 🚨 CORREÇÃO URGENTE - Produção Usando Supabase Errado

## ❌ Problema

Sua aplicação em produção está tentando acessar:
```
ijmiuhfcsxrlgbrohufr.supabase.co  ← PROJETO ANTIGO/ERRADO
```

Mas deveria acessar:
```
hwynfrkgcyfbukdzgcbh.supabase.co  ← PROJETO CORRETO
```

## ⚡ Solução Rápida (3 minutos)

### 1️⃣ Abra a Vercel
```
https://vercel.com/ridibrito/comunidade/settings/environment-variables
```

### 2️⃣ Encontre Esta Variável
```
NEXT_PUBLIC_SUPABASE_URL
```

### 3️⃣ Clique em "Edit" (três pontinhos ⋯)

### 4️⃣ Mude o Valor

**DE:**
```
https://ijmiuhfcsxrlgbrohufr.supabase.co
```

**PARA:**
```
https://hwynfrkgcyfbukdzgcbh.supabase.co
```

### 5️⃣ Marque TODOS os Ambientes
- ✅ Production
- ✅ Preview  
- ✅ Development

### 6️⃣ Clique em "Save"

### 7️⃣ Faça Redeploy

1. Vá para: https://vercel.com/ridibrito/comunidade/deployments
2. Clique no último deployment
3. Clique em ⋯ → **Redeploy**
4. Aguarde ~2 minutos

## ✅ Pronto!

Teste novamente: https://app.aldeiasingular.com.br

O erro `ERR_NAME_NOT_RESOLVED` deve sumir.

---

## 🔑 Se Precisar das Chaves

Pegue aqui:
```
https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/settings/api
```

Copie:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

