# Configuração de URLs de Redirecionamento no Supabase

## 🎯 Problema Resolvido
O link de convite estava redirecionando para `/auth/login` em vez de `/auth/change-password`. Agora foi implementado um callback personalizado que detecta o tipo de convite e redireciona corretamente.

## 🔧 Configuração Necessária

### 1. Acessar o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **Authentication**
4. Clique em **URL Configuration**

### 2. Configurar as URLs

#### **Site URL:**
```
http://localhost:3000
```

#### **Additional Redirect URLs:**
Adicione as seguintes URLs (uma por linha):

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/change-password
http://localhost:3000/auth/callback?type=invite
http://localhost:3000/auth/callback?next=/auth/change-password
```

### 3. Salvar as Configurações
Clique em **Save** para aplicar as alterações.

## 🚀 Como Funciona Agora

### **Fluxo de Convite:**
1. **Admin cria usuário** → `inviteUserByEmail()` é chamado
2. **Supabase envia email** → Com link de convite
3. **Usuário clica no link** → Vai para `/auth/callback?type=invite`
4. **Callback detecta tipo** → `type=invite` ou `temp_password=true`
5. **Redireciona automaticamente** → Para `/auth/change-password`
6. **Usuário define senha** → Conta ativada

### **Fluxo de Reset de Senha:**
1. **Admin clica "Resetar Senha"** → Envia link de reset
2. **Usuário clica no link** → Vai para `/auth/callback`
3. **Callback detecta tipo** → Não é convite
4. **Redireciona normalmente** → Para `/dashboard` ou página solicitada

## 🔍 Código do Callback

O callback personalizado (`/auth/callback/route.ts`) agora:

```typescript
// Verificar se é um convite (type=invite) e se tem temp_password
if (type === 'invite' || data.session.user.user_metadata?.temp_password) {
  console.log('Auth callback - Redirecting to change password')
  return NextResponse.redirect(`${origin}/auth/change-password`)
}

// Redirecionamento normal para outros casos
return NextResponse.redirect(`${origin}${next}`)
```

## 📧 Template de Email

O template "Confirm signup" do Supabase agora deve incluir:

```html
<div class="button-container">
    <a href="{{ .ConfirmationURL }}" class="button">Confirmar Acesso e Definir Senha</a>
</div>
```

O `{{ .ConfirmationURL }}` automaticamente incluirá o parâmetro `type=invite` quando for um convite.

## 🧪 Teste

Para testar se está funcionando:

1. **Crie um usuário** via interface admin
2. **Verifique o email** recebido
3. **Clique no link** do email
4. **Deve redirecionar** para `/auth/change-password`
5. **Defina uma senha** e confirme

## 🔧 Troubleshooting

### **Link ainda vai para login:**
- Verifique se as URLs estão configuradas corretamente
- Confirme se o callback está sendo chamado
- Verifique os logs do console para debug

### **Erro de redirecionamento:**
- Certifique-se de que todas as URLs estão na lista
- Verifique se não há espaços extras nas URLs
- Teste com URLs absolutas

### **Callback não funciona:**
- Verifique se o arquivo `/auth/callback/route.ts` existe
- Confirme se o servidor foi reiniciado
- Verifique os logs do servidor

## ✅ Resultado Final

Após a configuração:
- ✅ **Links de convite** redirecionam para `/auth/change-password`
- ✅ **Links de reset** funcionam normalmente
- ✅ **Callback personalizado** detecta o tipo correto
- ✅ **Fluxo completo** de convite e definição de senha
- ✅ **Sistema robusto** e confiável

## 📋 URLs para Produção

Para produção, substitua `http://localhost:3000` pela URL real do seu site:

```
Site URL: https://seusite.com
Additional Redirect URLs:
- https://seusite.com/auth/callback
- https://seusite.com/auth/change-password
- https://seusite.com/auth/callback?type=invite
- https://seusite.com/auth/callback?next=/auth/change-password
```
