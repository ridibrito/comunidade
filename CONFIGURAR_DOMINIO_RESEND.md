# 📧 Configurar Domínio no Resend para Enviar para Qualquer Email

## 🎯 **Problema:**
O Resend está em modo de teste e só permite enviar para o email configurado (aldeiasingular@gmail.com).

## 🚀 **Solução:**

### **1. Verificar Domínio no Resend:**

**Passo 1: Acessar o Resend Dashboard**
1. Vá para [https://resend.com/domains](https://resend.com/domains)
2. Faça login na sua conta

**Passo 2: Adicionar Domínio**
1. Clique em **"Add Domain"**
2. Digite seu domínio (ex: `aldeiasingular.com`)
3. Clique em **"Add"**

**Passo 3: Configurar DNS**
O Resend fornecerá registros DNS para adicionar:
- **TXT Record** para verificação
- **MX Record** para recebimento
- **CNAME Record** para tracking

**Passo 4: Verificar Domínio**
1. Adicione os registros DNS no seu provedor de domínio
2. Aguarde a propagação (pode levar até 24h)
3. Clique em **"Verify"** no Resend

### **2. Alternativa Rápida - Usar Domínio do Resend:**

Se você não tem um domínio próprio, pode usar o domínio do Resend:

**Domínios disponíveis:**
- `resend.dev` (já configurado)
- `resend.com` (já configurado)

### **3. Atualizar Edge Function:**

Após verificar o domínio, vou atualizar a Edge Function para usar o domínio verificado.

### **4. Teste:**

Após configurar o domínio, teste criando um usuário para verificar se o email chega no destinatário correto.

## 🔧 **Configuração Atual:**

**Domínio atual:** `resend.dev`
**Email de teste:** `aldeiasingular@gmail.com`

## 📋 **Próximos Passos:**

1. **Configure um domínio** no Resend (ou use resend.dev)
2. **Me informe qual domínio** você quer usar
3. **Atualizarei a Edge Function** para usar o domínio correto
4. **Testaremos** o envio para qualquer email

## 🚀 **Resultado Esperado:**

Após configurar o domínio:
- ✅ **Enviar para qualquer email**
- ✅ **Domínio verificado** no Resend
- ✅ **Emails chegando** nos destinatários corretos
- ✅ **Sistema funcionando** perfeitamente

**Configure o domínio no Resend e me informe qual usar!** 🚀
