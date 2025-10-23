# 📧 Configurar Resend para Envio de Emails

## 🚨 Problema
Emails de convite não estão sendo enviados porque falta a API Key do Resend.

## ✅ Solução Completa (10 minutos)

### 1️⃣ Criar Conta no Resend (Gratuito)

1. Acesse: https://resend.com
2. Clique em **Sign Up**
3. Crie uma conta (100 emails/dia grátis)
4. Confirme seu email

### 2️⃣ Gerar API Key

1. Após login, vá em: **API Keys** (menu lateral)
2. Clique em **Create API Key**
3. Nome: `Aldeia Singular Produção`
4. Permissões: **Sending access** (Full access)
5. Clique em **Add**
6. **COPIE** a chave que aparece (começa com `re_`)
   ```
   Exemplo: re_AbCdEfGh123456789...
   ```
7. ⚠️ **IMPORTANTE:** Guarde esta chave em local seguro! Ela só aparece uma vez.

### 3️⃣ Configurar no Vercel

#### **Opção A: Via Dashboard (Recomendado)**

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Clique em **Add New**
3. Preencha:
   ```
   Name: RESEND_API_KEY
   Value: re_SuaChaveAqui (cole a chave copiada)
   Environment: Production, Preview, Development (todos)
   ```
4. Clique em **Save**
5. **Faça Redeploy** para aplicar as mudanças

#### **Opção B: Via .env.local (Desenvolvimento)**

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione:
   ```bash
   RESEND_API_KEY=re_SuaChaveAqui
   ```
3. Salve o arquivo
4. Restart o servidor: `npm run dev`

### 4️⃣ (Opcional) Configurar Domínio Personalizado

Por padrão, os emails vêm de `onboarding@resend.dev`.  
Para usar `contato@aldeiasingular.com.br`:

1. No Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite: `aldeiasingular.com.br`
4. Siga as instruções para adicionar registros DNS
5. Aguarde verificação (até 48h)
6. Após verificado, atualize o código:
   ```typescript
   from: 'Aldeia Singular <contato@aldeiasingular.com.br>'
   ```

## 🧪 Testar

### 1. Desenvolvimento Local

```bash
# 1. Adicione a chave no .env.local
RESEND_API_KEY=re_SuaChaveAqui

# 2. Restart o servidor
npm run dev

# 3. Teste enviando um convite
# Vá em: http://localhost:3000/admin/users
# Clique em "Convidar Novo Usuário"
# Preencha e envie

# 4. Verifique os logs no terminal:
🔗 Link de convite gerado: https://...
📧 Tentando enviar email para: teste@exemplo.com
✅ Email enviado com sucesso! { id: 'abc123...' }
```

### 2. Produção (Vercel)

```bash
# 1. Adicione RESEND_API_KEY no Vercel
# 2. Faça Redeploy
# 3. Teste enviando um convite em produção
# 4. Verifique os logs:
#    Vercel → Deployments → Latest → Functions → Logs
```

## 🔍 Verificar se Funcionou

### Logs de Sucesso:
```
🔗 Link de convite gerado: https://app.aldeiasingular.com.br/auth/reset?email=...
📧 Tentando enviar email para: usuario@exemplo.com
✅ Email enviado com sucesso! { id: '550e8400-e29b-41d4-a716-446655440000' }
```

### Logs de Erro (sem API Key):
```
⚠️  RESEND_API_KEY não configurada. Email não será enviado.
📋 Link para copiar: https://app.aldeiasingular.com.br/auth/reset?email=...
```

### Email Recebido:
```
De: Aldeia Singular <onboarding@resend.dev>
Assunto: Convite para acessar a plataforma Coruss

[Email bonito com botão "Definir Senha e Acessar"]
```

## 📊 Limites do Plano Gratuito

| Recurso | Plano Gratuito |
|---------|----------------|
| Emails/dia | 100 |
| Emails/mês | 3.000 |
| Domínios | 1 |
| API Keys | Ilimitadas |
| Custo | R$ 0 |

**Para mais emails:** Upgrade para plano pago (a partir de $20/mês)

## 🛠️ Troubleshooting

### Problema: "RESEND_API_KEY não configurada"
**Solução:** 
- Verifique se a variável foi adicionada no Vercel
- Faça redeploy após adicionar a variável
- No desenvolvimento, restart o servidor após adicionar no .env.local

### Problema: "Error sending email: API key not found"
**Solução:**
- Verifique se copiou a chave correta
- A chave deve começar com `re_`
- Não use aspas ao adicionar a variável

### Problema: Email não chega
**Solução:**
- Verifique pasta de spam/lixo eletrônico
- Verifique os logs para ver se houve erro
- Teste com outro email
- Verifique se o domínio está verificado (se usar domínio customizado)

### Problema: "Domain not verified"
**Solução:**
- Se usar `onboarding@resend.dev`, não precisa verificar domínio
- Se usar domínio próprio, siga as instruções de verificação DNS

## 📝 Checklist

- [ ] Conta criada no Resend
- [ ] API Key gerada e copiada
- [ ] Variável `RESEND_API_KEY` adicionada no Vercel
- [ ] Redeploy realizado (se em produção)
- [ ] Variável adicionada no `.env.local` (se desenvolvimento)
- [ ] Servidor restartado (se desenvolvimento)
- [ ] Teste de envio realizado
- [ ] Email recebido com sucesso
- [ ] Link do email funciona corretamente

## 🎉 Depois de Configurado

Após configurar a API Key do Resend:

1. ✅ Emails de convite serão enviados automaticamente
2. ✅ Usuários receberão o link por email
3. ✅ Link redireciona para `https://app.aldeiasingular.com.br/auth/reset`
4. ✅ Usuário define senha e acessa a plataforma
5. ✅ Sistema totalmente funcional!

## 📞 Suporte

**Resend:**
- Documentação: https://resend.com/docs
- Status: https://status.resend.com
- Support: support@resend.com

**Problemas com a integração:**
- Verifique os logs do Vercel
- Verifique os logs do console do navegador
- Teste em desenvolvimento local primeiro

