# 🐛 Deploy Edge Function com Debug

## 📋 Status

- ✅ Logs detalhados adicionados
- ✅ Tratamento de erro melhorado
- ⏳ Aguardando deploy versão 23

## 🚀 Deploy Manual Via MCP

Devido ao tamanho do arquivo, vou fazer deploy via MCP Supabase.

## 📊 O Que os Logs Vão Mostrar

Após o próximo deploy e teste, os logs vão mostrar:

```
🚀 Edge Function iniciada
📧 Dados recebidos: { email: '...', name: '...', hasTempPassword: true }
🔑 Verificando RESEND_API_KEY...
🔑 RESEND_API_KEY presente: true/false
📮 Preparando envio via Resend API...
📮 Payload preparado: { from: '...', to: [...], subject: '...' }
🌐 Fazendo request para Resend...
📡 Resposta recebida do Resend. Status: 200/400/etc
📡 Dados da resposta: { id: '...' } ou { error: '...' }
```

## 🔍 Como Ver os Logs Detalhados

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions

2. Filtre por: `send-welcome-email`

3. Procure pelos emojis: 🚀 📧 🔑 📮 🌐 📡 ✅ ❌ 💥

4. Logs de erro vão mostrar:
   - Mensagem do erro
   - Stack trace completo
   - Detalhes do que deu errado

## ⏭️ Próximos Passos

1. Deploy versão 23 (com logs)
2. Enviar novo convite
3. Verificar logs detalhados
4. Identificar exatamente onde está falhando
5. Corrigir o problema específico

## 🎯 Possíveis Causas do Erro 500

1. **API Key inválida**: Resend rejeita o request
2. **Email inválido**: To/From com formato errado
3. **HTML muito grande**: Payload excede limite
4. **Timeout**: Resend demora demais para responder
5. **Network error**: Problema de conexão
6. **JSON parse error**: Resposta do Resend não é JSON válido

Vamos descobrir exatamente qual é o problema nos próximos logs! 🕵️

