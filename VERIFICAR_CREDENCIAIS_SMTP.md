# ✅ SMTP Configurado - Verificar Credenciais

## 📋 O Que Você Mostrou

Na imagem vejo:
- ✅ Enable Custom SMTP: ON
- ✅ Sender email: comunidade@aldeiasingular.com.br
- ✅ Sender name: Aldeia Singular
- ✅ Host: smtp.resend.com
- ✅ Port: 465

## ⚠️ FALTA VERIFICAR

**Scroll para baixo** na mesma página e verifique se você preencheu:

```
Username: resend
Password: [sua RESEND_API_KEY]

Encryption: (TLS/SSL - deve estar selecionado)
```

## 🧪 Teste Rápido

### 1. Testar Email de Redefinição de Senha

```
1. Vá em: http://localhost:3000/auth/recover
2. Digite seu email: ricardo.brasiliadf@hotmail.com
3. Clique em "Enviar link"
4. Verifique sua caixa de entrada
```

**Se o email chegar:**
- ✅ SMTP está funcionando perfeitamente
- ✅ Problema é só na Edge Function
- ✅ Vamos corrigir a Edge Function

**Se o email NÃO chegar:**
- ❌ Falta Username/Password
- ❌ Ou credenciais incorretas
- ❌ Scroll para baixo e preencha

## 🔍 Como Ver os Campos de Credenciais

Na página que você está:
```
Settings → Auth → SMTP Settings

Você mostrou:
- Enable Custom SMTP ✅
- Sender details ✅
- SMTP Provider Settings ✅

SCROLL MAIS PARA BAIXO e você vai ver:
- Username (deve ser "resend")
- Password (deve ser sua API Key)
- Encryption (deve ser TLS ou SSL)
```

## 📊 Próximos Passos

### Se Username/Password já estão preenchidos:
```
1. Teste redefinição de senha
2. Se funcionar → SMTP OK
3. Se não funcionar → Credenciais erradas
```

### Se faltam Username/Password:
```
1. Preencha:
   Username: resend
   Password: re_sua_api_key

2. Save
3. Teste redefinição de senha
```

## 🎯 Por Que Isso É Importante

### SMTP (Redefinição de Senha):
- Usa: Host + Port + Username + Password
- Se faltar Username/Password: Não autentica
- Se não autenticar: Não envia email

### Edge Function (Convite):
- Usa: API direta do Resend
- Não depende do SMTP do Supabase
- Precisa de RESEND_API_KEY nas env vars

## ✅ Checklist

- [x] SMTP habilitado
- [x] Host configurado
- [x] Port configurado
- [x] Sender configurado
- [ ] **Username configurado?**
- [ ] **Password configurado?**
- [ ] **Encryption configurado?**
- [ ] Testado redefinição de senha?

**Scroll para baixo na página e verifique os campos de autenticação!**

