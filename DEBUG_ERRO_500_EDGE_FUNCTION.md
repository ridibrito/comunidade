# 🔍 Debug: Erro 500 na Edge Function

## ✅ Confirmações
- ✅ RESEND_API_KEY está configurada no Supabase
- ✅ Versão 42 deployada com melhor tratamento de erros
- ❌ Versão 41 retornou erro 500
- ✅ Versão 40 funcionou (status 200)

## 🧪 Teste Necessário

### 1. Criar Novo Usuário
1. Acesse: `/admin/users`
2. Crie um novo usuário
3. Observe se há erro no console

### 2. Verificar Logs Detalhados (IMPORTANTE)

Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions

**Filtre por:**
- Source: `send-welcome-email`
- Level: `All` ou `Info + Error`

**Procure por estas mensagens:**
```
🚀 Edge Function iniciada
📧 Dados recebidos: { email: '...', name: '...', hasTempPassword: true }
🔑 Verificando RESEND_API_KEY...
🔑 RESEND_API_KEY presente: true/false
📮 Preparando envio via Resend API...
📮 Payload preparado: { from: '...', to: [...], subject: '...' }
🌐 Fazendo request para Resend...
📡 Resposta recebida do Resend (tentativa 1). Status: XXX
📡 Dados da resposta: {...}
```

**Se aparecer:**
- `❌ Erro ao fazer parse do JSON` → Problema no body da requisição
- `❌ Erro ao criar HTML` → Problema no template
- `⚠️ RESEND_API_KEY não configurada` → Chave não está acessível
- `❌ Erro na tentativa X` → Problema ao chamar Resend
- `💥 Erro na Edge Function` → Erro não tratado

### 3. Verificar Resend Dashboard

Acesse: https://resend.com/emails

Veja se aparece algum envio recente ou erro.

## 🎯 Possíveis Causas do Erro 500

### 1. Problema com Template String do HTML
O HTML muito grande pode estar causando problema. A versão 42 tem tratamento específico para isso.

### 2. Problema com Emojis
Emojis no código podem causar problemas de encoding. A versão 42 mantém os emojis mas com melhor tratamento.

### 3. Problema com JSON Parse
O body pode não estar chegando corretamente. A versão 42 tem try-catch específico.

### 4. Problema com Resend API
O Resend pode estar rejeitando a requisição. Os logs vão mostrar o status HTTP específico.

## 📋 O Que Preciso Saber

Após testar, me envie:

1. **O que aparece nos logs do Supabase?**
   - Copie TODAS as mensagens que aparecem
   - Especialmente as com emojis 🚀 📧 🔑 📮 🌐 📡 ✅ ❌ 💥

2. **Qual o status HTTP retornado?**
   - 200 = Sucesso
   - 400 = Erro no request
   - 500 = Erro interno

3. **Aparece algo no Resend Dashboard?**
   - Sim/Não
   - Se sim, qual o status?

4. **O erro acontece imediatamente ou demora?**
   - Imediato = Problema no código
   - Demora = Problema com Resend/timeout

## 🚀 Próximos Passos

1. **Teste agora** com a versão 42
2. **Verifique os logs detalhados** no Supabase
3. **Me envie o que aparecer** nos logs
4. **Vou corrigir** baseado nos logs específicos

Com os logs detalhados, vou identificar exatamente onde está falhando!

