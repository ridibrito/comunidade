# 🔍 Como Ver os Logs Detalhados do Console

## 📍 Onde Encontrar os Logs

### Opção 1: Logs de Console (Melhor para Debug)

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions

2. No filtro, selecione:
   - **Source**: `send-welcome-email`
   - **Level**: `All` ou `Info + Error`

3. Procure pelos emojis nos logs:
   ```
   🚀 Edge Function iniciada
   📧 Dados recebidos
   🔑 RESEND_API_KEY presente
   📮 Payload preparado
   🌐 Fazendo request
   📡 Resposta recebida
   ✅ Email enviado
   ❌ Erro ao enviar
   💥 Erro na Edge Function
   ```

### Opção 2: Logs de Invocação (O que você enviou)

Os logs que você enviou mostram apenas:
- Status HTTP: 500
- Execution time: 1430ms
- Headers
- **NÃO** mostram os `console.log()` que adicionamos

## 🐛 Possíveis Motivos do Erro 500

Se os logs de console não aparecem, o erro pode ser:

### 1. Erro de Sintaxe (mais provável)
O HTML minificado pode ter quebrado algo. Vou criar versão com HTML em variável separada.

### 2. Timeout
1430ms é muito tempo. Pode ser que o Resend esteja demorando ou dando timeout.

### 3. Erro no Parse do JSON
O response do Resend pode não ser JSON válido.

### 4. Problema com Encoding
Emojis no HTML podem estar causando problema de encoding.

## 🔧 Próxima Tentativa

Vou criar versão 24 com:
- HTML simples SEM emojis
- Menos logs de console
- Tratamento de erro mais robusto
- Timeout configurado

## 📊 Informações Necessárias

Por favor, acesse o link dos logs e me envie:
1. **Qualquer mensagem** que apareça com os emojis
2. **Mensagens de erro** em vermelho
3. **Stack traces** se houver

Se não houver NENHUMA mensagem com emojis, significa que o erro está acontecendo ANTES do código rodar, o que indica:
- Problema na compilação
- Problema no Deno runtime
- Problema com o HTML muito grande

**Vamos simplificar drasticamente na v24!**

