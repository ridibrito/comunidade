# 📧 Configurar Resend no Supabase

## 🎯 **Problema:**
A Edge Function está funcionando, mas o email não está sendo enviado porque a `RESEND_API_KEY` não está configurada no Supabase.

## 🔧 **Solução:**

### **1. Configurar RESEND_API_KEY no Supabase:**

**Passo 1: Acessar o Supabase Dashboard**
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto (appAldeia)

**Passo 2: Configurar Variáveis de Ambiente**
1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"Edge Functions"**
3. Na seção **"Environment Variables"**, clique em **"Add new variable"**
4. Configure:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Sua chave da API do Resend
   - **Description:** `Chave da API do Resend para envio de emails`

**Passo 3: Salvar e Deploy**
1. Clique em **"Save"**
2. A Edge Function será automaticamente redeployada

### **2. Verificar se a Chave está Configurada:**

Após configurar, teste novamente criando um usuário. A Edge Function deve:
- ✅ **Enviar email** via Resend
- ✅ **Retornar sucesso** com ID do Resend
- ✅ **Email chegar** na caixa de entrada

### **3. Teste:**

**Credenciais do teste atual:**
- **Email:** ricardo.brasiliadf@hotmail.com
- **Senha:** 0uj0qa0mBW5B3VZJ

### **4. Logs da Edge Function:**

Se ainda não funcionar, verifique os logs:
1. Vá para **"Edge Functions"** no Supabase Dashboard
2. Clique em **"send-welcome-email"**
3. Vá para a aba **"Logs"**
4. Verifique se há erros relacionados ao Resend

## 🚀 **Resultado Esperado:**

Após configurar a `RESEND_API_KEY`:
- ✅ **Email enviado** via Resend
- ✅ **Email chega** na caixa de entrada
- ✅ **Senha incluída** no email
- ✅ **Design personalizado** da marca

## 📋 **Próximos Passos:**

1. **Configure a RESEND_API_KEY** no Supabase Dashboard
2. **Teste criando um novo usuário**
3. **Verifique se o email chega**
4. **Me informe o resultado**

**Configure a variável de ambiente e teste novamente!** 🚀
