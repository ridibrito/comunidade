# 🔧 Correção: Emails Não Chegando em Gmail, Hotmail e Yahoo

## 🚨 Problema Identificado

Os emails não estão sendo entregues para provedores como Gmail, Hotmail e Yahoo devido a:

1. **Domínio não verificado**: Uso de `onboarding@resend.dev` que pode ter limitações
2. **Falta de headers apropriados**: Headers que melhoram a reputação do email
3. **Falta de retry logic**: Erros temporários não são tratados adequadamente
4. **Falta de tratamento de erros específicos**: Não identifica problemas específicos do Resend

## ✅ Correções Implementadas

### 1. **Edge Function Atualizada** (`supabase/functions/send-welcome-email/index.ts`)

- ✅ Suporte para domínio verificado via variável `MAIL_FROM`
- ✅ Headers apropriados para melhorar entrega (`X-Entity-Ref-ID`, `X-Priority`, `Importance`)
- ✅ Sistema de retry (até 3 tentativas) para erros temporários
- ✅ Tratamento detalhado de erros específicos do Resend
- ✅ Tags para tracking e organização

### 2. **API Route de Convite Atualizada** (`src/app/api/admin/invite-user/route.ts`)

- ✅ Mesmas melhorias da Edge Function
- ✅ Retry logic implementado
- ✅ Headers apropriados adicionados

### 3. **Webhook Hotmart Atualizado** (`src/app/api/hotmart/webhook/route.ts`)

- ✅ Headers apropriados adicionados
- ✅ Tags para tracking

## 🎯 Próximos Passos (IMPORTANTE)

### **1. Configurar Domínio Verificado no Resend**

Para melhorar drasticamente a entrega em Gmail, Hotmail e Yahoo, você **DEVE** configurar um domínio verificado:

#### **Passo 1: Acessar Resend Dashboard**
1. Vá para: https://resend.com/domains
2. Faça login na sua conta

#### **Passo 2: Adicionar Domínio**
1. Clique em **"Add Domain"**
2. Digite seu domínio: `aldeiasingular.com.br` (ou outro domínio que você tenha)
3. Clique em **"Add"**

#### **Passo 3: Configurar Registros DNS**
O Resend fornecerá os seguintes registros DNS para adicionar no seu provedor de domínio:

**Registros necessários:**
- **TXT Record** para verificação do domínio
- **SPF Record** (TXT) para autenticação de email
- **DKIM Records** (CNAME) para assinatura de email
- **DMARC Record** (TXT) para política de email (opcional mas recomendado)

**Exemplo de registros:**
```
Tipo: TXT
Nome: @
Valor: [valor fornecido pelo Resend]

Tipo: CNAME
Nome: [nome fornecido pelo Resend]
Valor: [valor fornecido pelo Resend]
```

#### **Passo 4: Verificar Domínio**
1. Adicione os registros DNS no seu provedor de domínio
2. Aguarde a propagação DNS (pode levar até 24-48 horas)
3. Volte ao Resend e clique em **"Verify"**
4. Aguarde a verificação completa

#### **Passo 5: Configurar Variável de Ambiente**

Após verificar o domínio, configure a variável `MAIL_FROM`:

**No Supabase (Edge Function):**
1. Vá para: https://supabase.com/dashboard/project/[seu-projeto]/settings/functions
2. Adicione variável de ambiente:
   ```
   MAIL_FROM=Aldeia Singular <noreply@aldeiasingular.com.br>
   ```

**No Vercel (API Routes):**
1. Vá para: https://vercel.com/[seu-projeto]/settings/environment-variables
2. Adicione variável:
   ```
   MAIL_FROM=Aldeia Singular <noreply@aldeiasingular.com.br>
   ```
3. Faça redeploy

### **2. Verificar Configuração Atual**

Verifique se você já tem um domínio configurado:

```bash
# Verificar no Resend Dashboard
https://resend.com/domains
```

Se já tiver um domínio verificado, apenas configure a variável `MAIL_FROM` com o email desse domínio.

### **3. Testar Envio**

Após configurar o domínio:

1. **Criar usuário de teste** com email Gmail/Hotmail/Yahoo
2. **Verificar logs** no Supabase Dashboard → Logs → Edge Functions
3. **Verificar se email chegou** (pode levar alguns minutos)
4. **Verificar pasta de spam** se não chegar na caixa de entrada

## 📊 Melhorias Implementadas no Código

### **Headers Adicionados:**
```typescript
headers: {
  'X-Entity-Ref-ID': generateUUID(), // ID único para tracking
  'X-Priority': '1',                  // Prioridade alta
  'Importance': 'high',                // Importância alta
}
```

### **Tags Adicionadas:**
```typescript
tags: [
  { name: 'category', value: 'welcome' },
  { name: 'source', value: 'user-signup' }
]
```

### **Retry Logic:**
- Tenta até 3 vezes em caso de erro temporário
- Aguarda progressivamente (1s, 2s) entre tentativas
- Trata erros específicos (429, 500, 502, 503)

### **Tratamento de Erros:**
- Identifica erros específicos do Resend
- Retorna mensagens de erro mais descritivas
- Loga detalhes completos para debug

## 🔍 Troubleshooting

### **Email ainda não chega após configurar domínio:**

1. **Verificar se domínio está verificado:**
   - Acesse: https://resend.com/domains
   - Confirme que o status é "Verified" ✅

2. **Verificar registros DNS:**
   - Use ferramenta como: https://mxtoolbox.com/
   - Verifique se SPF, DKIM estão configurados corretamente

3. **Verificar logs do Resend:**
   - Acesse: https://resend.com/emails
   - Veja o status de cada envio
   - Verifique se há erros específicos

4. **Verificar logs do Supabase:**
   - Acesse: Supabase Dashboard → Logs → Edge Functions
   - Procure por erros relacionados ao envio

5. **Verificar limites do Resend:**
   - Plano gratuito: 100 emails/dia
   - Verifique se não excedeu o limite

### **Erro: "Domain not verified"**

- Certifique-se de que o domínio está verificado no Resend
- Aguarde até 48 horas após adicionar registros DNS
- Verifique se os registros DNS estão corretos

### **Erro: "API key not found" ou "403 Forbidden"**

- Verifique se `RESEND_API_KEY` está configurada corretamente
- Confirme que a API key tem permissão de envio
- Gere uma nova API key se necessário

## 📝 Checklist de Configuração

- [ ] Domínio adicionado no Resend
- [ ] Registros DNS configurados no provedor de domínio
- [ ] Domínio verificado no Resend (status "Verified")
- [ ] Variável `MAIL_FROM` configurada no Supabase
- [ ] Variável `MAIL_FROM` configurada no Vercel
- [ ] Redeploy realizado após configurar variáveis
- [ ] Teste de envio realizado com email Gmail/Hotmail/Yahoo
- [ ] Email recebido na caixa de entrada (não spam)

## 🎉 Resultado Esperado

Após configurar o domínio verificado:

- ✅ **Emails chegando** em Gmail, Hotmail e Yahoo
- ✅ **Taxa de entrega melhorada** significativamente
- ✅ **Menos emails indo para spam**
- ✅ **Reputação do domínio melhorada**
- ✅ **Headers apropriados** melhorando autenticação

## 📞 Suporte

**Resend:**
- Documentação: https://resend.com/docs
- Suporte: support@resend.com
- Status: https://status.resend.com

**Problemas com DNS:**
- Consulte seu provedor de domínio
- Use ferramentas como MXToolbox para verificar DNS

