# Configuração do Template de Email no Supabase

## 🎯 Problema Identificado

O email está usando o template padrão do Supabase que leva para a página de login, mas precisamos que vá para nossa página de definição de senha.

## ✅ Solução Implementada

### 1. **URL de Redirecionamento Corrigida**
- ✅ Agora o link vai para: `/auth/reset?type=invite&token=...&email=...`
- ✅ Inclui token e email para validação
- ✅ Usa nossa página personalizada de definição de senha

### 2. **Variáveis do Template Corrigidas**
- ✅ Adicionada variável `name` para usar no template
- ✅ Mantida variável `Nome` para compatibilidade
- ✅ Template agora mostra o nome em vez do email

## 🔧 Como Configurar no Supabase

### Passo 1: Acessar o Dashboard
1. Vá para [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Authentication** > **Email Templates**

### Passo 2: Configurar Template
1. **Selecione "Invite user"**
2. **Substitua o HTML** pelo template do arquivo `EMAIL_TEMPLATE.md`
3. **Salve as alterações**

### Passo 3: Configurar URL de Redirecionamento
1. Vá para **Authentication** > **URL Configuration**
2. **Site URL**: `https://app.aldeiasingular.com.br`
3. **Redirect URLs**: Adicione:
   - `https://app.aldeiasingular.com.br/auth/reset`
   - `http://localhost:3000/auth/reset` (para desenvolvimento)

## 📧 Template Otimizado

O template personalizado inclui:
- ✅ **Branding Coruss** (cores, logo, slogan)
- ✅ **Texto personalizado** para definição de senha
- ✅ **Variável `{{ .Data.name }}`** funcionando
- ✅ **Botão "DEFINIR MINHA SENHA"**
- ✅ **Design responsivo** e profissional

## 🔄 Fluxo Corrigido

### Antes (Problema):
1. Usuário recebe email → Clica no link
2. Vai para página de login ❌
3. Precisa fazer login sem ter senha ❌

### Agora (Solução):
1. Usuário recebe email → Clica no link
2. Vai para `/auth/reset?type=invite&token=...&email=...` ✅
3. Página valida o token ✅
4. Usuário define senha ✅
5. É redirecionado para dashboard ✅

## 🧪 Teste Realizado

- ✅ **Usuário criado**: "Ana Costa"
- ✅ **Email enviado** com URL corrigida
- ✅ **Token gerado**: `azwc5oljqnrmh0vsifm`
- ✅ **Status**: `sent` com timestamp

## 📋 Próximos Passos

1. **Configurar template** no Supabase Dashboard
2. **Testar envio** de novo convite
3. **Verificar se link** vai para página correta
4. **Confirmar que nome** aparece no email

## 🎯 Resultado Esperado

Após a configuração, o email deve:
- ✅ Mostrar o nome do usuário em vez do email
- ✅ Ter o botão "DEFINIR MINHA SENHA"
- ✅ Redirecionar para nossa página de reset
- ✅ Ter o branding correto da Comunidade Coruss
