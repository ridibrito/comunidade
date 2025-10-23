# 🌐 Atualizar URLs de Redirecionamento para Produção

## ✅ Sim, Pode e Deve Atualizar!

Como sua aplicação já está no ar em `app.aldeiasingular.com.br`, você **deve** atualizar as URLs de redirecionamento no Supabase para o domínio de produção.

## 📋 URLs Atuais (Desenvolvimento)

```
❌ http://localhost:3000/auth/callback
❌ http://localhost:3000/auth/callback?next=/auth/reset
❌ http://localhost:3000/auth/reset
❌ http://localhost:3000/auth/callback?next=/auth/change-password
❌ http://localhost:3000/auth/change-password
❌ http://localhost:3000/auth/callback?type=invite
```

## ✅ URLs de Produção (Adicionar)

```
✅ https://app.aldeiasingular.com.br/auth/callback
✅ https://app.aldeiasingular.com.br/auth/callback?next=/auth/reset
✅ https://app.aldeiasingular.com.br/auth/reset
✅ https://app.aldeiasingular.com.br/auth/callback?next=/auth/change-password
✅ https://app.aldeiasingular.com.br/auth/change-password
✅ https://app.aldeiasingular.com.br/auth/callback?type=invite
```

## 🔧 Como Atualizar no Supabase

### Passo 1: Acesse o Dashboard do Supabase
```
https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/url-configuration
```

### Passo 2: Adicione as URLs de Produção

Na seção **Redirect URLs**, clique em **Add URL** e adicione **uma por uma**:

1. `https://app.aldeiasingular.com.br/auth/callback`
2. `https://app.aldeiasingular.com.br/auth/callback?next=/auth/reset`
3. `https://app.aldeiasingular.com.br/auth/reset`
4. `https://app.aldeiasingular.com.br/auth/callback?next=/auth/change-password`
5. `https://app.aldeiasingular.com.br/auth/change-password`
6. `https://app.aldeiasingular.com.br/auth/callback?type=invite`

### Passo 3: MANTENHA as URLs de Localhost

**IMPORTANTE:** Não remova as URLs de `localhost:3000`! 

Você vai querer as **duas** versões:
- ✅ `localhost:3000` - Para desenvolvimento local
- ✅ `app.aldeiasingular.com.br` - Para produção

## 📝 Configuração Final Recomendada

Após adicionar tudo, você terá **12 URLs** no total:

### Desenvolvimento (Localhost)
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset
http://localhost:3000/auth/reset
http://localhost:3000/auth/callback?next=/auth/change-password
http://localhost:3000/auth/change-password
http://localhost:3000/auth/callback?type=invite
```

### Produção (Domínio Real)
```
https://app.aldeiasingular.com.br/auth/callback
https://app.aldeiasingular.com.br/auth/callback?next=/auth/reset
https://app.aldeiasingular.com.br/auth/reset
https://app.aldeiasingular.com.br/auth/callback?next=/auth/change-password
https://app.aldeiasingular.com.br/auth/change-password
https://app.aldeiasingular.com.br/auth/callback?type=invite
```

## ⚠️ Importante: Site URL

Além das Redirect URLs, você também precisa configurar o **Site URL**:

### Seção "Site URL"
```
https://app.aldeiasingular.com.br
```

Isso garante que emails de autenticação usem o domínio correto.

## 🧪 Testar Após Configurar

Teste as seguintes funcionalidades em **PRODUÇÃO**:

### 1. Login
```
https://app.aldeiasingular.com.br/auth/login
```
- ✅ Deve redirecionar corretamente após login

### 2. Recuperação de Senha
```
https://app.aldeiasingular.com.br/auth/recover
```
- ✅ Email deve conter link para `app.aldeiasingular.com.br`
- ✅ Ao clicar, deve abrir a página de reset em produção

### 3. Mudança de Senha
```
https://app.aldeiasingular.com.br/auth/change-password
```
- ✅ Deve funcionar sem erros de redirecionamento

### 4. Sistema de Convites
- ✅ Email de convite deve ter link para `app.aldeiasingular.com.br`
- ✅ Ao aceitar convite, deve redirecionar corretamente

## 📧 Verificar Templates de Email

Depois de atualizar as URLs, verifique se os templates de email estão usando o domínio correto:

1. Vá para: `https://supabase.com/dashboard/project/hwynfrkgcyfbukdzgcbh/auth/templates`
2. Verifique cada template:
   - Magic Link
   - Confirm signup
   - Invite user
   - Reset password
   - Change email address
3. Certifique-se que usam: `{{ .SiteURL }}` (que será `app.aldeiasingular.com.br`)

## ✅ Checklist Completo

- [ ] Adicionar 6 URLs de produção no Supabase
- [ ] Manter 6 URLs de localhost (desenvolvimento)
- [ ] Configurar Site URL: `https://app.aldeiasingular.com.br`
- [ ] Testar login em produção
- [ ] Testar recuperação de senha em produção
- [ ] Testar sistema de convites em produção
- [ ] Verificar que emails contêm URLs de produção
- [ ] Confirmar que localhost ainda funciona localmente

## 🎯 Resultado Final

Após essa configuração:
- ✅ Produção funcionará com domínio real
- ✅ Desenvolvimento local continuará funcionando
- ✅ Emails terão links corretos
- ✅ Sem mais erros de redirecionamento

---

**Pode fazer essas mudanças com segurança!** A aplicação já está no ar, então faz sentido usar o domínio de produção. 🚀

