# Integração com Hotmart

Esta documentação explica como configurar a integração com a Hotmart para cadastro automático de usuários via webhook.

## Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Hotmart Webhook
HOTMART_WEBHOOK_SECRET=sua_chave_secreta_do_webhook
HOTMART_PRODUCT_IDS=123456,789012,345678

# Email (opcional)
RESEND_API_KEY=sua_chave_do_resend
MAIL_FROM=no-reply@comunidade.com

# App
NEXT_PUBLIC_APP_URL=https://comunidade.com
```

### 2. Configuração na Hotmart

1. Acesse o painel da Hotmart
2. Vá em "Configurações" → "Webhooks"
3. Adicione uma nova URL de webhook: `https://comunidade.com/api/hotmart/webhook`
4. Selecione os eventos:
   - `PURCHASE_APPROVED`
   - `PURCHASE_COMPLETED`
   - `SUBSCRIPTION_RENEWED`
5. Configure o secret e cole no campo `HOTMART_WEBHOOK_SECRET`
6. Salve as configurações

### 3. Configuração no Admin

1. Acesse `/admin/integrations`
2. Cole o secret do webhook no campo "Webhook Secret"
3. Adicione os IDs dos produtos (opcional)
4. Clique em "Salvar Configuração"

## Como Funciona

### Fluxo de Cadastro Automático

1. **Compra Aprovada**: Quando uma compra é aprovada na Hotmart
2. **Webhook Enviado**: Hotmart envia webhook para `/api/hotmart/webhook`
3. **Validação**: Sistema valida a assinatura do webhook
4. **Criação de Usuário**: Se não existir, cria usuário no Supabase
5. **Perfil Criado**: Cria perfil na tabela `profiles`
6. **Assinatura Ativada**: Cria registro na tabela `subscriptions`
7. **Email Enviado**: Envia email de boas-vindas (se configurado)

### Estrutura de Dados

#### Tabela `subscriptions`
```sql
- id: UUID (chave primária)
- user_id: UUID (referência ao usuário)
- provider: 'hotmart'
- product_id: ID do produto na Hotmart
- purchase_id: ID da compra (único)
- status: 'active', 'pending', 'trial', 'past_due', 'canceled', 'refunded', 'chargeback'
- started_at: Data de início
- ends_at: Data de fim (opcional)
- meta: JSON com dados completos do webhook
```

### Eventos Suportados

- `PURCHASE_APPROVED`: Compra aprovada
- `PURCHASE_COMPLETED`: Compra concluída
- `SUBSCRIPTION_RENEWED`: Assinatura renovada

### Status de Assinatura

- `active`: Assinatura ativa
- `pending`: Aguardando pagamento
- `trial`: Período de teste
- `past_due`: Pagamento em atraso
- `canceled`: Cancelada
- `refunded`: Reembolsada
- `chargeback`: Estorno

## Segurança

- Validação de assinatura HMAC-SHA256
- Verificação de whitelist de produtos (opcional)
- Logs de todas as operações
- Tratamento de erros robusto

## Testes

Para testar a integração:

1. Use ferramentas como ngrok para expor localmente
2. Configure webhook temporário na Hotmart
3. Faça uma compra de teste
4. Verifique os logs no console
5. Confirme criação do usuário no Supabase

## Troubleshooting

### Webhook não está funcionando
- Verifique se a URL está correta
- Confirme se o secret está configurado
- Verifique os logs do servidor

### Usuário não está sendo criado
- Verifique se o email está sendo enviado corretamente
- Confirme se o produto está na whitelist
- Verifique se o Supabase está configurado

### Email não está sendo enviado
- Verifique se `RESEND_API_KEY` está configurado
- Confirme se `MAIL_FROM` está definido
- Verifique os logs de erro
