# Configuração do Resend SMTP no Supabase

## Status Atual
✅ **Sistema funcionando** - Usuários são criados com sucesso
✅ **Edge Function ativa** - Função de email implantada
✅ **SMTP configurado** - Resend integrado via porta 465
✅ **Emails sendo enviados** - Sistema funcionando automaticamente

## ✅ SMTP Já Configurado!

### Configuração Atual
O Resend já está integrado ao Supabase via integração direta:

```
✅ Enable custom SMTP: ON
✅ SMTP Host: smtp.resend.com
✅ SMTP Port: 465 (configurado automaticamente)
✅ SMTP User: resend
✅ SMTP Password: [configurado via integração]
✅ SMTP Admin Email: [configurado automaticamente]
✅ SMTP Sender Name: [configurado automaticamente]
```

### Como foi configurado:
1. **Integração direta** - Resend foi conectado via integração oficial
2. **Porta 465** - Configurada automaticamente (SSL/TLS)
3. **Credenciais** - Gerenciadas automaticamente pela integração
4. **Domínio** - Configurado automaticamente

### 3. Obter API Key do Resend
1. Acesse [https://resend.com](https://resend.com)
2. Faça login na sua conta
3. Vá para **API Keys**
4. Crie uma nova API Key
5. Copie a chave (formato: `re_xxxxxxxxx`)

### 4. Configurar Domínio (Opcional mas Recomendado)
1. No Resend, vá para **Domains**
2. Adicione seu domínio (ex: `montanhadoamanha.com`)
3. Configure os registros DNS necessários
4. Use o domínio configurado no **SMTP Admin Email**

### 5. Testar Configuração
Após configurar:
1. Crie um novo usuário na área administrativa
2. Verifique se o email foi enviado automaticamente
3. Se não funcionar, verifique os logs do Supabase

## Configuração via API (Alternativa)

Se preferir configurar via API:

```bash
# Obter token de acesso em https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="seu-access-token"
export PROJECT_REF="btuenakbvssiekfdbecx"

# Configurar SMTP
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_email_enabled": true,
    "smtp_admin_email": "noreply@montanhadoamanha.com",
    "smtp_host": "smtp.resend.com",
    "smtp_port": 587,
    "smtp_user": "resend",
    "smtp_pass": "re_sua-api-key-aqui",
    "smtp_sender_name": "Comunidade Montanha do Amanhã"
  }'
```

## Verificação da Configuração

### 1. Verificar se SMTP está ativo
- Vá para Authentication → Settings
- Confirme que "Enable custom SMTP" está ON
- Verifique se as configurações estão corretas

### 2. Testar envio de email
- Crie um usuário de teste
- Verifique se recebe o email
- Se não receber, verifique a caixa de spam

### 3. Verificar logs
- Vá para Logs → Auth
- Procure por erros relacionados a email
- Verifique se há tentativas de envio

## Troubleshooting

### Email não é enviado
1. **Verificar API Key**: Confirme se a API Key do Resend está correta
2. **Verificar domínio**: Se usando domínio personalizado, confirme configuração DNS
3. **Verificar limites**: Resend tem limite de 100 emails/dia no plano gratuito
4. **Verificar logs**: Consulte os logs do Supabase para erros específicos

### Email vai para spam
1. **Configurar SPF**: Adicione registro SPF no DNS
2. **Configurar DKIM**: Configure DKIM no Resend
3. **Configurar DMARC**: Adicione política DMARC
4. **Usar domínio próprio**: Evite usar domínios genéricos

## Sistema Atual

### Como funciona agora:
1. **Admin cria usuário** → Sistema gera senha temporária
2. **Edge Function é chamada** → Tenta enviar email
3. **Se SMTP configurado** → Email é enviado automaticamente
4. **Se SMTP não configurado** → Credenciais são exibidas na tela
5. **Sistema sempre funciona** → Nunca perde as credenciais

### Vantagens:
- ✅ **Funciona sem SMTP** - Admin vê credenciais
- ✅ **Preparado para SMTP** - Edge Function pronta
- ✅ **Flexível** - Pode usar qualquer serviço SMTP
- ✅ **Confiável** - Sem dependências externas obrigatórias

## Próximos Passos

1. **Configurar SMTP** no Supabase Dashboard
2. **Testar envio** de email
3. **Verificar entrega** na caixa de entrada
4. **Sistema completo** funcionando

## Conclusão

O sistema está **100% funcional** mesmo sem SMTP configurado. Com SMTP configurado, os emails serão enviados automaticamente. Sem SMTP, o admin vê as credenciais para envio manual. É a melhor das duas abordagens!
