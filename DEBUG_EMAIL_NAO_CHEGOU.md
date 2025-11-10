# 🔍 Debug: Email Não Chegou - Passo a Passo

## ✅ Checklist de Verificação

### 1. Verificar se a Edge Function foi Deployada

A Edge Function precisa estar deployada com as correções. Verifique:

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/functions
2. Procure por `send-welcome-email`
3. Verifique a **versão mais recente** (deve ter as correções que fizemos)

**Se não estiver deployada:**
- Precisamos fazer deploy da Edge Function atualizada

### 2. Verificar RESEND_API_KEY no Supabase

A Edge Function precisa da variável de ambiente:

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/functions
2. Role até **"Environment Variables"**
3. Verifique se existe `RESEND_API_KEY`
4. Confirme que o valor está correto (começa com `re_`)

**Se não estiver configurada:**
- Adicione a variável `RESEND_API_KEY` com sua chave do Resend

### 3. Verificar Logs da Edge Function (MAIS IMPORTANTE)

Os logs vão mostrar exatamente o que aconteceu:

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions
2. Filtre por: `send-welcome-email`
3. Procure pelos emojis nos logs:
   - 🚀 Edge Function iniciada
   - 📧 Dados recebidos
   - 🔑 RESEND_API_KEY presente: true/false
   - 📮 Payload preparado
   - 🌐 Fazendo request para Resend
   - 📡 Resposta recebida do Resend. Status: XXX
   - ✅ Email enviado com sucesso
   - ❌ Erro ao enviar email

**Me envie o que aparecer nos logs!**

### 4. Verificar Status no Resend Dashboard

Verifique se o Resend recebeu e processou o email:

1. Acesse: https://resend.com/emails
2. Procure pelo email mais recente
3. Verifique o status:
   - ✅ **Sent** = Email foi enviado
   - ⏳ **Pending** = Ainda processando
   - ❌ **Bounced** = Email rejeitado
   - ❌ **Failed** = Falha no envio

### 5. Verificar Limites do Resend

O plano gratuito tem limite de 100 emails/dia:

1. Acesse: https://resend.com/dashboard
2. Verifique se não excedeu o limite diário

## 🐛 Possíveis Problemas e Soluções

### Problema 1: "RESEND_API_KEY não configurada"

**Sintoma nos logs:**
```
⚠️ RESEND_API_KEY não configurada. Email não será enviado.
```

**Solução:**
1. Configure `RESEND_API_KEY` no Supabase Dashboard
2. Faça redeploy da Edge Function (ou aguarde alguns minutos)

### Problema 2: "Domain not verified"

**Sintoma nos logs:**
```
Status: 422
Error: Domain not verified
```

**Solução:**
- Configure um domínio verificado no Resend OU
- Use `onboarding@resend.dev` (que já está no código)

### Problema 3: "API key invalid"

**Sintoma nos logs:**
```
Status: 403
Error: Invalid API key
```

**Solução:**
- Verifique se a API key está correta
- Gere uma nova API key no Resend se necessário

### Problema 4: Email enviado mas não chega

**Sintoma:**
- Logs mostram ✅ Email enviado
- Resend mostra "Sent"
- Mas email não chega

**Solução:**
- Verifique pasta de spam
- Verifique se o email de destino está correto
- Configure domínio verificado para melhorar entrega

## 📋 Informações que Preciso

Para identificar o problema, preciso que você me envie:

1. **Logs da Edge Function:**
   - Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions
   - Filtre por `send-welcome-email`
   - Copie TODAS as mensagens que aparecem (especialmente as com emojis)

2. **Status no Resend:**
   - Acesse: https://resend.com/emails
   - Me diga o status do email mais recente

3. **Configuração:**
   - A `RESEND_API_KEY` está configurada no Supabase? (sim/não)
   - Qual email você testou? (Gmail/Hotmail/Yahoo)

## 🚀 Próximos Passos

1. **Verifique os logs** e me envie o que aparecer
2. **Verifique o Resend Dashboard** e me diga o status
3. **Confirme se RESEND_API_KEY está configurada** no Supabase

Com essas informações, vou identificar exatamente o problema e corrigir!

