# 🐛 Próximo Passo - Debug do Erro 500

## ❌ Problema Atual

Edge Function retorna **500 Internal Server Error** ao tentar enviar email.

## ✅ O Que Já Foi Feito

1. ✅ RESEND_API_KEY configurada no Supabase
2. ✅ Edge Function v22 deployada com integração Resend
3. ✅ Código local atualizado com logs detalhados
4. ⏳ **FALTA**: Deploy versão 23 com logs de debug

## 🚀 Como Fazer Deploy da V23 (Logs Detalhados)

### Opção 1: Via Supabase CLI (Recomendado)

```bash
# 1. Instalar Supabase CLI (se ainda não tem)
npm install -g supabase

# 2. Login no Supabase
supabase login

# 3. Link ao projeto
supabase link --project-ref btuenakbvssiekfdbecx

# 4. Deploy da função
supabase functions deploy send-welcome-email
```

### Opção 2: Via MCP Supabase (Alternativa)

Eu posso fazer o deploy via MCP quando você quiser, mas devido ao tamanho do arquivo, pode ser melhor usar a CLI.

### Opção 3: Copiar e Colar Manual (Mais Rápido)

1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/functions

2. Clique em `send-welcome-email`

3. Clique em **Edit** ou **Update**

4. Copie todo o conteúdo de: `supabase/functions/send-welcome-email/index.ts`

5. Cole no editor online

6. Clique em **Deploy**

## 🔍 Depois do Deploy V23

### 1. Enviar Novo Convite

```bash
# Acesse: http://localhost:3000/admin/users
# Envie um convite
```

### 2. Verificar Logs Detalhados

```
Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/logs/edge-functions

Procure por:
🚀 Edge Function iniciada
📧 Dados recebidos
🔑 RESEND_API_KEY presente
📮 Payload preparado
🌐 Fazendo request
📡 Resposta recebida
```

### 3. Identificar o Erro Exato

Os logs vão mostrar **exatamente** onde está falhando:

- Se parar em 🔑: API Key não está acessível
- Se parar em 🌐: Problema ao fazer request
- Se mostrar 📡 com erro: Resend rejeitou o request
- Se mostrar 💥: Exceção não tratada

## 📋 Checklist

- [ ] Deploy versão 23 com logs
- [ ] Enviar novo convite
- [ ] Verificar logs no Supabase
- [ ] Copiar mensagem de erro específica
- [ ] Me enviar os logs para análise

## 💡 Alternativa Temporária

Se quiser testar o sistema sem esperar o debug, posso criar uma versão simplificada que:
- Apenas registra o usuário
- Mostra as credenciais na tela
- Administrador copia e envia manualmente

Mas o ideal é resolver o erro 500 para ter o sistema automático funcionando.

## 🎯 Objetivo

Descobrir **exatamente** por que o Resend está retornando erro 500 e corrigir.

**Qual opção você prefere para fazer o deploy da v23?**
1. CLI (mais profissional)
2. MCP (eu faço)
3. Manual (copiar/colar no dashboard)

