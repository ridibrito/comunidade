# 🚨 CORRIGIR EMAIL COM LOCALHOST - AÇÃO IMEDIATA

## ✅ Código já foi corrigido e enviado para GitHub

### Commit: 273b5d3
- ✅ API route agora usa `SITE_URL` em vez de `NEXT_PUBLIC_SITE_URL`
- ✅ Fallback triplo garante URL de produção
- ✅ Logs adicionados para debug

## 🎯 O QUE VOCÊ PRECISA FAZER AGORA

### 1️⃣ Configurar Variável no Vercel (2 minutos)

1. Acesse: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Preencha:
   ```
   Name: SITE_URL
   Value: https://app.aldeiasingular.com.br
   ```
6. Selecione: **Production**, **Preview**, **Development** (todos)
7. Clique em **Save**

### 2️⃣ Fazer Redeploy (1 minuto)

**Opção A: Via Dashboard (mais fácil)**
1. Vá em **Deployments**
2. Clique nos 3 pontos do último deploy
3. Clique em **Redeploy**
4. Aguarde o build terminar (~2-3min)

**Opção B: Via Git (automático)**
O push que acabamos de fazer já vai triggerar um novo deploy automaticamente!

### 3️⃣ Testar (1 minuto)

Após o deploy terminar:

1. Vá em: https://app.aldeiasingular.com.br/admin/users
2. Envie um novo convite
3. Verifique o email
4. O link agora deve ser: `https://app.aldeiasingular.com.br/auth/reset?email=...`

## 🔍 Como Verificar se Funcionou

### No Console do Vercel (Logs da Função):
```
🔗 URL de redirecionamento configurada: https://app.aldeiasingular.com.br
🔧 Variáveis disponíveis:
  SITE_URL: https://app.aldeiasingular.com.br
  VERCEL_URL: app-aldeiasingular-com-br.vercel.app
```

### No Email:
O link deve começar com:
```
https://app.aldeiasingular.com.br/auth/reset?email=...
```

**NÃO** deve ter `localhost` em lugar nenhum!

## ⚠️ IMPORTANTE

### Se NÃO configurar `SITE_URL`:
O código usa fallback automático:
```
SITE_URL (não existe) 
  → VERCEL_URL (usa URL do Vercel)
    → 'https://app.aldeiasingular.com.br' (hardcoded)
```

Então **MESMO SEM** configurar `SITE_URL`, o email já não vai mais usar `localhost`!

Mas é **RECOMENDADO** configurar `SITE_URL` para ter controle total.

## 🎉 Status Atual

- ✅ Código corrigido
- ✅ Commit enviado (273b5d3)
- ✅ Push realizado
- ⏳ Deploy automático em andamento (Vercel detecta push)
- ⏳ Aguardar ~2-3min para build terminar
- ⏳ Configurar `SITE_URL` no Vercel (opcional mas recomendado)
- ⏳ Testar novo convite

## 📞 Próximo Passo

**Aguarde o deploy automático terminar** (Vercel já detectou o push)

Depois, **mesmo sem configurar SITE_URL**, teste enviar um convite.

Se ainda vier com `localhost`, **AI** você configura `SITE_URL` e faz redeploy manual.

Mas muito provavelmente já vai funcionar com o fallback! 🚀

