# 🚨 CONFIGURAR SMTP NO SUPABASE - URGENTE

## ❌ Problema Identificado

**NENHUM email está sendo enviado** porque o Supabase **NÃO** tem provedor de email configurado!

## ✅ Solução Rápida (5 minutos)

### 1️⃣ Pegar Credenciais do Resend

Você já tem a API Key. Use ela como senha SMTP:

```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_sua_api_key_do_resend
```

### 2️⃣ Configurar no Supabase

**Link Direto:**
https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/settings/auth

1. **Scroll para baixo** até "SMTP Settings"

2. **Enable Custom SMTP** → Ative (toggle ON)

3. Preencha:
   ```
   Sender email: onboarding@resend.dev
   Sender name: Aldeia Singular
   Host: smtp.resend.com
   Port number: 587
   Username: resend
   Password: [sua RESEND_API_KEY]
   ```

4. **Save**

### 3️⃣ Testar Imediatamente

```bash
# Teste 1: Redefinição de senha
1. Vá em: http://localhost:3000/auth/recover
2. Digite seu email
3. Envie
✅ Email deve chegar!

# Teste 2: Convite de usuário
1. Vá em: http://localhost:3000/admin/users
2. Adicione usuário
✅ Email deve chegar!
```

## 🎯 Screenshots do Que Fazer

### No Supabase Dashboard:
```
Settings (⚙️)
  ↓
Authentication
  ↓
SMTP Settings (scroll para baixo)
  ↓
Enable Custom SMTP [Toggle ON]
  ↓
Preencher campos
  ↓
Save
```

## 📋 Campos Exatos

Copie e cole exatamente:

```
Enable Custom SMTP: ✅ ON

Sender email: onboarding@resend.dev
Sender name: Aldeia Singular
Host: smtp.resend.com
Port number: 587
Username: resend
Password: [COLE SUA RESEND_API_KEY AQUI]

Encryption: (deixe default ou selecione TLS)
```

## ⚠️ Importante

### Se Não Configurar SMTP:
- ❌ Nenhum email será enviado
- ❌ Usuários não conseguem redefinir senha
- ❌ Convites não funcionam
- ❌ Sistema não funciona completamente

### Depois de Configurar SMTP:
- ✅ Todos os emails funcionam
- ✅ Redefinição de senha OK
- ✅ Convites OK
- ✅ Sistema 100% funcional

## 🔧 Troubleshooting

### "SMTP connection failed"
**Solução:**
- Verifique se a API Key está correta
- Tente Port 465 em vez de 587
- Verifique se copiou a chave completa (começa com re_)

### "Invalid credentials"
**Solução:**
- Username deve ser exatamente: `resend`
- Password deve ser a API Key do Resend (começa com re_)
- Não coloque aspas

### "Authentication failed"
**Solução:**
- Gere uma nova API Key no Resend
- Use a nova chave no Password

## 🎉 Depois de Configurar

**TESTE IMEDIATAMENTE:**

1. ✅ Email de redefinição de senha
2. ✅ Email de convite de usuário
3. ✅ Ambos devem funcionar!

## 📞 Se Ainda Não Funcionar

Me envie:
1. Screenshot da configuração SMTP
2. Mensagem de erro (se houver)
3. Logs do Supabase

Mas muito provavelmente vai funcionar! 🚀

**CONFIGURE AGORA E TESTE!**

