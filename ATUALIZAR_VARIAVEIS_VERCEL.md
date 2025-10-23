# 🔧 Atualizar Variáveis de Ambiente na Vercel

## ⚠️ PROBLEMA IDENTIFICADO

A aplicação em produção está usando o projeto Supabase **antigo**:
```
❌ ijmiuhfcsxrlgbrohufr.supabase.co (INCORRETO)
```

Precisa usar o projeto **correto**:
```
✅ hwynfrkgcyfbukdzgcbh.supabase.co (CORRETO)
```

## 📋 Passo a Passo para Corrigir

### 1. Acesse o Dashboard da Vercel
```
https://vercel.com/ridibrito/comunidade/settings/environment-variables
```

### 2. Localize as Variáveis de Ambiente

Encontre e **ATUALIZE** estas variáveis:

#### **NEXT_PUBLIC_SUPABASE_URL**
```
❌ Valor Antigo: https://ijmiuhfcsxrlgbrohufr.supabase.co
✅ Valor Novo:   https://hwynfrkgcyfbukdzgcbh.supabase.co
```

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Obtenha a chave correta do projeto hwynfrkgcyfbukdzgcbh
```

#### **SUPABASE_SERVICE_ROLE_KEY** (se existir)
```
Obtenha a service role key do projeto hwynfrkgcyfbukdzgcbh
```

### 3. Como Obter as Chaves Corretas

1. Acesse o Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/settings/api
   ```

2. Copie as seguintes informações:

   **Project URL:**
   ```
   https://hwynfrkgcyfbukdzgcbh.supabase.co
   ```

   **anon / public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **service_role key:** (em "Service Role Secret")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Atualizar na Vercel

Para cada variável:

1. Clique em **⋯** (três pontos) ao lado da variável
2. Selecione **Edit**
3. Cole o **novo valor**
4. Marque todos os ambientes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique em **Save**

### 5. Fazer Redeploy

Após atualizar todas as variáveis:

1. Vá para: https://vercel.com/ridibrito/comunidade/deployments
2. Clique no deployment mais recente
3. Clique em **⋯** (três pontos)
4. Selecione **Redeploy**
5. Aguarde o redeploy completar

## ✅ Verificar se Funcionou

Após o redeploy, teste:

1. Acesse: https://app.aldeiasingular.com.br/auth/recover
2. Tente recuperar senha
3. Verifique se não há mais erro `ERR_NAME_NOT_RESOLVED`
4. O email de recuperação deve chegar corretamente

## 📝 Lista de Verificação

- [ ] Atualizar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Atualizar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Atualizar `SUPABASE_SERVICE_ROLE_KEY` (se existir)
- [ ] Marcar todos os ambientes (Production, Preview, Development)
- [ ] Fazer redeploy
- [ ] Testar autenticação
- [ ] Testar recuperação de senha
- [ ] Verificar console do navegador (sem erros)

## 🚨 Importante

**NUNCA** compartilhe suas chaves do Supabase publicamente!
- ✅ Mantenha no .env.local (local)
- ✅ Configure na Vercel (produção)
- ❌ Nunca commite no Git
- ❌ Nunca compartilhe em screenshots/mensagens

## 🔍 Como Confirmar o Projeto Correto

Você pode verificar qual projeto está sendo usado:

1. Abra o Console do navegador (F12)
2. Vá para a aba **Network**
3. Faça login ou qualquer ação de autenticação
4. Procure por requisições para `supabase.co`
5. Verifique se está usando `hwynfrkgcyfbukdzgcbh`

---

**Após seguir todos os passos, sua aplicação em produção estará usando o projeto Supabase correto!** 🎉

