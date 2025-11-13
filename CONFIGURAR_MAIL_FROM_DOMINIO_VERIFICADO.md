# ✅ Configurar MAIL_FROM com Domínio Verificado

## 🎯 Status Atual
- ✅ Domínio `aldeiasingular.com.br` verificado no Resend
- ⏳ Falta configurar `MAIL_FROM` no Supabase

## 🔧 Configurar MAIL_FROM no Supabase

### **Passo 1: Acessar Configurações do Supabase**

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/functions
2. Role até a seção **"Environment Variables"** ou **"Secrets"**

### **Passo 2: Adicionar/Editar Variável MAIL_FROM**

1. Procure por `MAIL_FROM` na lista
2. Se não existir, clique em **"Add new variable"** ou **"New Secret"**
3. Se existir, clique para editar

4. Configure:
   ```
   Name: MAIL_FROM
   Value: Aldeia Singular <noreply@aldeiasingular.com.br>
   ```
   
   **Ou use outro email do domínio:**
   - `contato@aldeiasingular.com.br`
   - `noreply@aldeiasingular.com.br`
   - `no-reply@aldeiasingular.com.br`
   - Qualquer email usando `@aldeiasingular.com.br`

5. Clique em **"Save"** ou **"Add"**

### **Passo 3: Aguardar Propagação**

A variável pode levar alguns segundos para estar disponível. Aguarde 10-30 segundos.

### **Passo 4: Testar Novamente**

1. Crie um novo usuário em `/admin/users`
2. Use um email diferente de `aldeiasingular@gmail.com` (ex: Gmail, Hotmail, Yahoo)
3. O email deve ser enviado com sucesso!

## 🎉 Resultado Esperado

Após configurar `MAIL_FROM`:
- ✅ Edge Function vai usar `noreply@aldeiasingular.com.br` como remetente
- ✅ Resend vai aceitar o envio para qualquer email
- ✅ Emails vão chegar em Gmail, Hotmail, Yahoo, etc.

## 📋 Verificação

Após configurar, verifique nos logs:
- `from: "Aldeia Singular <noreply@aldeiasingular.com.br>"`
- Status 200 (sucesso) ao invés de 403 (forbidden)

