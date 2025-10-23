# 🚨 Email de Convite Ainda Vai Como Localhost

## 🎯 Problema

Mesmo após atualizar `.env.local`, o email de convite ainda contém `localhost:3000`.

## 🔍 Possíveis Causas

### 1️⃣ **Templates de Email no Supabase (MAIS PROVÁVEL)**

O Supabase tem templates de email que podem ter a URL hardcoded.

#### Solução:

1. **Acesse o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/templates
   ```

2. **Vá para "Email Templates"**

3. **Edite o template "Invite user"**

4. **Procure por `localhost:3000` no template**

5. **Substitua por:**
   ```
   {{ .SiteURL }}
   ```
   
   Ou diretamente:
   ```
   https://app.aldeiasingular.com.br
   ```

6. **Salve o template**

### 2️⃣ **Site URL no Supabase**

Verifique a configuração "Site URL" no Supabase:

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/url-configuration
   ```

2. **Procure "Site URL"**

3. **Deve estar:**
   ```
   ✅ https://app.aldeiasingular.com.br
   ❌ NÃO http://localhost:3000
   ```

4. **Se estiver errado, corrija e salve**

### 3️⃣ **Código de Envio de Convite**

Verifique se o código não está passando URL hardcoded:

```typescript
// ERRADO
const inviteUrl = `http://localhost:3000/auth/callback?type=invite&token=${token}`;

// CORRETO
const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=invite&token=${token}`;
```

### 4️⃣ **Cache do Servidor**

Após alterar `.env.local`, é necessário **restart completo**:

```bash
# Parar o servidor (Ctrl+C)
# Limpar cache
npm run build
# Reiniciar
npm run dev
```

### 5️⃣ **Variáveis na Vercel (PRODUÇÃO)**

Se o problema é em **produção**, verifique a Vercel:

1. **Acesse:**
   ```
   https://vercel.com/ridibrito/comunidade/settings/environment-variables
   ```

2. **Procure por:**
   ```
   NEXT_PUBLIC_SITE_URL
   ```

3. **Deve estar:**
   ```
   ✅ https://app.aldeiasingular.com.br
   ❌ NÃO http://localhost:3000
   ```

4. **Se estiver errado:**
   - Edite a variável
   - Marque todos os ambientes (Production, Preview, Development)
   - Salve
   - Faça **Redeploy**

## ✅ Checklist de Verificação

Verifique **NESTA ORDEM**:

- [ ] 1. **Site URL no Supabase**
  - URL: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/url-configuration
  - Deve ser: `https://app.aldeiasingular.com.br`

- [ ] 2. **Template de Email no Supabase**
  - URL: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/templates
  - Template: "Invite user"
  - Verificar se usa `{{ .SiteURL }}` e não localhost hardcoded

- [ ] 3. **Redirect URLs no Supabase**
  - URL: https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/url-configuration
  - Deve ter: `https://app.aldeiasingular.com.br/auth/callback?type=invite`
  - Pode ter localhost TAMBÉM (para desenvolvimento)

- [ ] 4. **Variável Local (.env.local)**
  - Arquivo: `.env.local`
  - Verificar: `NEXT_PUBLIC_SITE_URL=https://app.aldeiasingular.com.br`

- [ ] 5. **Restart do Servidor**
  - Parar servidor (Ctrl+C)
  - Rodar: `npm run dev`

- [ ] 6. **Variáveis Vercel (se em produção)**
  - URL: https://vercel.com/settings/environment-variables
  - Verificar: `NEXT_PUBLIC_SITE_URL=https://app.aldeiasingular.com.br`
  - Fazer redeploy após alterar

## 🧪 Como Testar

1. **Envie um novo convite** (após fazer as correções)
2. **Abra o email recebido**
3. **Inspecione o link:**
   - Clique com botão direito no botão/link
   - Selecione "Copiar endereço do link"
   - Cole em um editor de texto
4. **Verifique se começa com:**
   ```
   ✅ https://app.aldeiasingular.com.br
   ❌ NÃO http://localhost:3000
   ```

## 🎯 Solução Rápida (Passo a Passo)

### PASSO 1: Site URL no Supabase
```
1. https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/url-configuration
2. Procure "Site URL"
3. Mude para: https://app.aldeiasingular.com.br
4. Salve
```

### PASSO 2: Template de Email
```
1. https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/templates
2. Clique em "Invite user"
3. Procure por "localhost" no texto
4. Substitua por {{ .SiteURL }}
5. Salve
```

### PASSO 3: Restart e Teste
```bash
# Parar servidor (Ctrl+C)
npm run dev
# Testar novo convite
```

## 📧 Template Correto de Convite

O template deve usar variáveis do Supabase:

```html
<h2>Você foi convidado!</h2>

<p>Clique no link abaixo para aceitar o convite:</p>

<a href="{{ .ConfirmationURL }}">Aceitar Convite</a>

<!-- OU -->

<a href="{{ .SiteURL }}/auth/callback?type=invite&token={{ .Token }}">
  Aceitar Convite
</a>
```

**NÃO deve ter:**
```html
<!-- ❌ ERRADO -->
<a href="http://localhost:3000/auth/callback?type=invite">
```

---

**Siga o checklist acima e teste novamente!** 🔍✅

