# ✅ SOLUÇÃO: Verificar Domínio no Resend

## 🎯 Problema Identificado

O Resend está em **modo de teste** e só permite enviar para `aldeiasingular@gmail.com`.

**Erro específico:**
```
"You can only send testing emails to your own email address (aldeiasingular@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains"
```

## ✅ Solução: Verificar Domínio no Resend

### **Passo 1: Acessar Resend Dashboard**

1. Acesse: https://resend.com/domains
2. Faça login na sua conta

### **Passo 2: Adicionar Domínio**

1. Clique em **"Add Domain"**
2. Digite seu domínio: `aldeiasingular.com.br` (ou outro que você tenha)
3. Clique em **"Add"**

### **Passo 3: Configurar Registros DNS**

O Resend fornecerá os seguintes registros DNS para adicionar no seu provedor de domínio:

**Registros necessários:**
- **TXT Record** para verificação do domínio
- **SPF Record** (TXT) para autenticação de email
- **DKIM Records** (CNAME) para assinatura de email
- **DMARC Record** (TXT) para política de email (opcional mas recomendado)

**Exemplo de registros que o Resend fornecerá:**
```
Tipo: TXT
Nome: @
Valor: [valor fornecido pelo Resend]

Tipo: CNAME
Nome: [nome fornecido pelo Resend]
Valor: [valor fornecido pelo Resend]
```

### **Passo 4: Adicionar Registros DNS**

1. Acesse o painel do seu provedor de domínio (onde você comprou o domínio)
2. Vá em **DNS** ou **Zona DNS**
3. Adicione os registros fornecidos pelo Resend
4. Salve as alterações

### **Passo 5: Verificar Domínio**

1. Volte ao Resend Dashboard
2. Aguarde alguns minutos para propagação DNS (pode levar até 24-48 horas)
3. Clique em **"Verify"** no Resend
4. Aguarde a verificação completa (status "Verified" ✅)

### **Passo 6: Configurar Variável MAIL_FROM**

Após verificar o domínio, configure a variável `MAIL_FROM`:

**No Supabase:**
1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/functions
2. Role até **"Environment Variables"**
3. Adicione ou edite:
   ```
   Name: MAIL_FROM
   Value: Aldeia Singular <noreply@aldeiasingular.com.br>
   ```
   (Use o domínio que você verificou)

4. Salve

### **Passo 7: Testar Novamente**

1. Crie um novo usuário em `/admin/users`
2. O email deve ser enviado com sucesso!

## 🚀 Alternativa Rápida (Temporária)

Se você não tem um domínio próprio ou precisa testar rapidamente:

### **Opção A: Usar Email Cadastrado**
Envie emails apenas para `aldeiasingular@gmail.com` temporariamente.

### **Opção B: Usar Domínio do Resend**
O Resend pode ter domínios pré-configurados. Verifique em:
https://resend.com/domains

## 📋 Checklist

- [ ] Domínio adicionado no Resend
- [ ] Registros DNS configurados no provedor de domínio
- [ ] Domínio verificado no Resend (status "Verified")
- [ ] Variável `MAIL_FROM` configurada no Supabase com domínio verificado
- [ ] Teste de envio realizado
- [ ] Email recebido com sucesso

## 🎉 Resultado Esperado

Após verificar o domínio:
- ✅ **Enviar para qualquer email** (Gmail, Hotmail, Yahoo, etc.)
- ✅ **Domínio verificado** no Resend
- ✅ **Emails chegando** nos destinatários corretos
- ✅ **Sem limitações** de teste

## 📞 Suporte

**Resend:**
- Documentação: https://resend.com/docs
- Suporte: support@resend.com
- Status: https://status.resend.com

**Problemas com DNS:**
- Consulte seu provedor de domínio
- Use ferramentas como MXToolbox para verificar DNS

