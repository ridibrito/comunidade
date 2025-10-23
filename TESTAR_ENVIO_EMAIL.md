# 🧪 Testar Envio de Email - Guia Rápido

## ✅ Status Atual

- ✅ Resend integrado via Vercel
- ✅ API Key configurada no `.env.local`
- ✅ Código de envio implementado
- ✅ Código enviado para GitHub
- ⏳ Aguardando deploy do Vercel

## 🔍 Como Testar

### 1️⃣ Teste Local (Desenvolvimento)

```bash
# 1. Certifique-se de que o servidor está rodando
npm run dev

# 2. Abra o navegador
http://localhost:3000/admin/users

# 3. Clique em "Convidar Novo Usuário"

# 4. Preencha:
Nome: Teste Email
Email: seu-email@gmail.com (use seu email real!)
Role: User

# 5. Clique em "Enviar Convite"

# 6. Verifique os LOGS no terminal:
```

**Logs Esperados (Sucesso):**
```
🔗 URL de redirecionamento configurada: https://app.aldeiasingular.com.br
🔧 Variáveis disponíveis: { SITE_URL: undefined, VERCEL_URL: undefined, ... }
🔗 Link de convite gerado: https://app.aldeiasingular.com.br/auth/reset?email=...
📧 Tentando enviar email para: seu-email@gmail.com
✅ Email enviado com sucesso! { id: '550e8400-...' }
```

**Logs Esperados (Sem API Key):**
```
⚠️  RESEND_API_KEY não configurada. Email não será enviado.
📋 Link para copiar: https://app.aldeiasingular.com.br/auth/reset?email=...
```

### 2️⃣ Verificar Email

```bash
# 1. Abra seu email
# 2. Procure por email de: Aldeia Singular <onboarding@resend.dev>
# 3. Verifique se chegou (pode levar alguns segundos)
# 4. Se não encontrar, verifique:
#    - Pasta de SPAM/Lixo Eletrônico
#    - Promoções (Gmail)
#    - Todas as pastas

# 5. Abra o email e verifique:
✅ Assunto: "Convite para acessar a plataforma Coruss"
✅ Botão: "Definir Senha e Acessar"
✅ Link: https://app.aldeiasingular.com.br/auth/reset?email=...
```

### 3️⃣ Testar o Link

```bash
# 1. Clique no botão ou copie o link
# 2. Deve abrir: https://app.aldeiasingular.com.br/auth/reset
# 3. Preencha uma nova senha
# 4. Clique em "Redefinir Senha"
# 5. Deve ser redirecionado para o login
# 6. Faça login com o email e a nova senha
```

## 🐛 Troubleshooting

### Problema 1: "RESEND_API_KEY não configurada"

**Causa:** A variável não foi carregada no ambiente.

**Soluções:**

**A) Verificar .env.local:**
```bash
# Abra o arquivo .env.local
# Verifique se tem a linha:
RESEND_API_KEY=re_SuaChaveAqui

# IMPORTANTE: Sem aspas, sem espaços
# ✅ Correto: RESEND_API_KEY=re_abc123
# ❌ Errado: RESEND_API_KEY="re_abc123"
# ❌ Errado: RESEND_API_KEY = re_abc123
```

**B) Restart do Servidor:**
```bash
# Pare o servidor (Ctrl+C)
# Reinicie:
npm run dev
```

**C) Verificar nome da variável:**
```bash
# O código espera: RESEND_API_KEY
# Verifique se não está como:
# - RESEND_KEY
# - NEXT_PUBLIC_RESEND_API_KEY
# - etc.
```

### Problema 2: Email não chega

**Possíveis causas:**

**A) API Key inválida:**
```bash
# Verifique no Resend Dashboard:
# 1. Vá em: https://resend.com/api-keys
# 2. Verifique se a chave está ativa
# 3. Se necessário, gere uma nova
```

**B) Email na lista de spam:**
```bash
# 1. Verifique TODAS as pastas
# 2. Marque como "Não é spam"
# 3. Adicione onboarding@resend.dev aos contatos
```

**C) Erro no envio:**
```bash
# Verifique os logs no terminal
# Se houver erro, ele será mostrado:
❌ Erro ao enviar email: { message: '...' }
```

### Problema 3: Link expirado

**Causa:** Links do Supabase expiram em 24h.

**Solução:**
```bash
# 1. Envie um novo convite
# 2. Use o novo link imediatamente
# 3. Links são de uso único
```

### Problema 4: "Error sending email"

**Possíveis causas e soluções:**

**A) Rate limit (muitos emails):**
```bash
# Plano gratuito: 100 emails/dia
# Aguarde alguns minutos e tente novamente
```

**B) Domínio não verificado:**
```bash
# Se usar domínio customizado, ele precisa estar verificado
# Use onboarding@resend.dev enquanto isso
```

**C) Email inválido:**
```bash
# Verifique se o email está correto
# Teste com outro email
```

## 📊 Checklist de Teste Completo

- [ ] `.env.local` tem `RESEND_API_KEY`
- [ ] Servidor reiniciado após adicionar variável
- [ ] Convite enviado via admin
- [ ] Logs mostram "✅ Email enviado com sucesso!"
- [ ] Email recebido (verificou spam)
- [ ] Assunto e conteúdo corretos
- [ ] Link do email funciona
- [ ] Redireciona para página de reset
- [ ] Consegue definir nova senha
- [ ] Consegue fazer login com nova senha

## 🚀 Teste em Produção (Após Deploy)

```bash
# 1. Aguarde o deploy do Vercel terminar (~2-3min)

# 2. Acesse a produção:
https://app.aldeiasingular.com.br/admin/users

# 3. Envie um convite

# 4. Verifique os logs do Vercel:
# Vercel Dashboard → Deployments → Latest → Functions

# 5. Procure pelos logs:
🔗 Link de convite gerado: ...
📧 Tentando enviar email para: ...
✅ Email enviado com sucesso!

# 6. Verifique seu email
```

## 💡 Dicas

### Para Debug:

1. **Sempre verifique os logs** - Eles dizem exatamente o que está acontecendo
2. **Teste com seu próprio email** - Assim você vê exatamente o que o usuário recebe
3. **Guarde os links** - Se o email não chegar, você tem o link nos logs
4. **Teste em desenvolvimento primeiro** - Mais fácil de debugar

### Para Produção:

1. **Configure domínio customizado no Resend** - Emails de `@aldeiasingular.com.br` têm mais credibilidade
2. **Monitore os logs** - Veja se há erros
3. **Configure alertas** - Para saber se o envio falhar
4. **Tenha um plano B** - Copie o link manualmente se necessário

## 📞 Precisa de Ajuda?

Se após seguir este guia o email ainda não funcionar:

1. ✅ Copie os logs completos do terminal
2. ✅ Verifique se a API Key está correta
3. ✅ Teste com outro email
4. ✅ Verifique o status do Resend: https://status.resend.com
5. ✅ Verifique os logs do Vercel (produção)

## 🎉 Quando Funcionar

Você verá:
- ✅ Logs de sucesso no terminal
- ✅ Email chegando em segundos
- ✅ Link funcionando perfeitamente
- ✅ Usuário conseguindo acessar a plataforma

**Sistema totalmente funcional! 🚀✨**

