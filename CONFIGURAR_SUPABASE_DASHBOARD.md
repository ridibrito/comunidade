# 🚨 URGENTE: Configurar Supabase Dashboard

## ❌ Problema Identificado

O email de convite está redirecionando para:
- **URL Errada**: `https://comunidade-q4y5.vercel.app/auth/login`
- **Erro**: `Database error granting user`

## ✅ Solução: Configurar Supabase Dashboard

### 🔧 Passo 1: Acessar o Dashboard
1. Vá para [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto: `ijmiuhfcsxrlgbrohufr`
3. Vá para **Authentication** > **URL Configuration**

### 🔧 Passo 2: Configurar Site URL
**Site URL** (campo obrigatório):
```
https://app.aldeiasingular.com.br
```

### 🔧 Passo 3: Configurar Redirect URLs
**Redirect URLs** (adicione todas essas URLs):
```
https://app.aldeiasingular.com.br/auth/reset
https://app.aldeiasingular.com.br/auth/login
https://app.aldeiasingular.com.br/dashboard
https://app.aldeiasingular.com.br/onboarding/sucesso
```

### 🔧 Passo 4: Para Desenvolvimento (Opcional)
Se quiser manter desenvolvimento local, adicione também:
```
http://localhost:3000/auth/reset
http://localhost:3000/auth/login
http://localhost:3000/dashboard
http://localhost:3000/onboarding/sucesso
```

### 🔧 Passo 5: Salvar Configurações
1. **Clique em "Save"** para salvar as configurações
2. **Aguarde alguns segundos** para a configuração ser aplicada

## 📧 Configurar Template de Email

### 🔧 Passo 6: Acessar Templates
1. Vá para **Authentication** > **Email Templates**
2. Selecione **"Invite user"**

### 🔧 Passo 7: Atualizar Template
Substitua o HTML pelo template do arquivo `EMAIL_TEMPLATE.md`

### 🔧 Passo 8: Verificar Variáveis
Certifique-se de que o template usa:
- `{{ .Data.name }}` para o nome do usuário
- `{{ .ConfirmationURL }}` para o link de confirmação

## 🧪 Testar Configuração

### 🔧 Passo 9: Testar Convite
1. **Crie um novo usuário** na interface admin
2. **Verifique se o email** é enviado corretamente
3. **Clique no link** do email
4. **Confirme se vai** para `https://app.aldeiasingular.com.br/auth/reset`

## 🚨 Problemas Comuns

### ❌ Erro: "Database error granting user"
**Causa**: URLs de redirecionamento não configuradas
**Solução**: Adicionar todas as URLs na seção "Redirect URLs"

### ❌ Erro: "Invalid redirect URL"
**Causa**: URL não está na lista de URLs permitidas
**Solução**: Verificar se todas as URLs estão configuradas

### ❌ Email vai para login em vez de reset
**Causa**: Template de email não configurado
**Solução**: Atualizar template com o HTML correto

## 📋 Checklist de Configuração

- [ ] **Site URL**: `https://app.aldeiasingular.com.br`
- [ ] **Redirect URLs**: Todas as URLs adicionadas
- [ ] **Template de Email**: HTML atualizado
- [ ] **Configurações salvas**: Botão "Save" clicado
- [ ] **Teste realizado**: Convite funcionando

## 🎯 Resultado Esperado

Após a configuração:
1. **Email enviado** com link correto
2. **Link redireciona** para `https://app.aldeiasingular.com.br/auth/reset`
3. **Página de reset** carrega corretamente
4. **Usuário pode definir** senha
5. **Redirecionamento** para dashboard

## 📞 Suporte

Se ainda houver problemas:
1. **Verificar logs** do Supabase
2. **Testar URLs** individualmente
3. **Verificar se domínio** está funcionando
4. **Confirmar se Vercel** está deployado

## ⚡ Ação Imediata Necessária

**URGENTE**: Configure o Supabase Dashboard agora para resolver o erro de redirecionamento!
