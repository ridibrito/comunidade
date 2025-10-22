# 📧 Como Configurar o Template "Invite User" no Supabase

## 🎯 **Problema Identificado:**
O template "Invite User" não está conseguindo acessar a senha gerada pelo sistema.

## 🔧 **Solução:**

### **1. Acessar o Supabase Dashboard:**
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Faça login** na sua conta
3. **Selecione seu projeto** (btuenakbvssiekfdbecx)

### **2. Navegar para Authentication:**
1. No menu lateral esquerdo, clique em **"Authentication"** (ícone de cadeado)
2. Clique em **"Email Templates"**
3. **Selecione "Invite user"**

### **3. Configurar o Template "Invite user":**

#### **Assunto do Email:**
```
Bem-vindo à Aldeia Singular - Suas Credenciais de Acesso
```

#### **HTML do Template:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Aldeia Singular!</title>
    <style>
        body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: #ffffff; 
            padding: 0; 
            border-radius: 8px; 
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
            overflow: hidden;
            border: 1px solid #eeeeee;
        }
        .topbar {
            height: 6px;
            background-color: #ffb000;
        }
        .header {
            background: linear-gradient(135deg, #ffb000 0%, #ff8c00 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #ffb000;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 18px;
            color: #333333;
            margin-bottom: 30px;
            text-align: center;
        }
        .credentials-box {
            background-color: #f8f9fa;
            border: 2px solid #ffb000;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        .credentials-title {
            font-size: 20px;
            font-weight: bold;
            color: #ffb000;
            margin-bottom: 20px;
        }
        .credential-item {
            margin: 15px 0;
            padding: 15px;
            background-color: white;
            border-radius: 6px;
            border-left: 4px solid #ffb000;
        }
        .credential-label {
            font-weight: bold;
            color: #666666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .credential-value {
            font-size: 18px;
            color: #333333;
            font-family: 'Courier New', monospace;
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }
        .login-button {
            display: inline-block;
            background: linear-gradient(135deg, #ffb000 0%, #ff8c00 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .login-button:hover {
            transform: translateY(-2px);
        }
        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
            color: #856404;
        }
        .security-notice h3 {
            margin: 0 0 10px 0;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666666;
            font-size: 14px;
        }
        .footer-logo {
            width: 40px;
            height: 40px;
            margin: 0 auto 15px;
            background-color: #ffb000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="topbar"></div>
        
        <div class="header">
            <div class="logo">AS</div>
            <h1 class="title">Aldeia Singular</h1>
            <p class="subtitle">Sua jornada de transformação começa aqui</p>
        </div>
        
        <div class="content">
            <div class="welcome-text">
                <strong>Olá {{ .FullName }}!</strong><br>
                Sua conta foi criada com sucesso na Aldeia Singular.
            </div>
            
            <div class="credentials-box">
                <h2 class="credentials-title">🔑 Suas Credenciais de Acesso</h2>
                
                <div class="credential-item">
                    <div class="credential-label">Email:</div>
                    <div class="credential-value">{{ .Email }}</div>
                </div>
                
                <div class="credential-item">
                    <div class="credential-label">Senha Temporária:</div>
                    <div class="credential-value">{{ .GeneratedPassword }}</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="login-button">
                    🚀 Acessar a Aldeia Singular
                </a>
            </div>
            
            <div class="security-notice">
                <h3>🔒 Importante - Segurança:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Esta é uma senha temporária gerada pelo sistema</li>
                    <li>Você será solicitado a alterar sua senha no primeiro login</li>
                    <li>Mantenha suas credenciais seguras e não as compartilhe</li>
                    <li>Se você não solicitou esta conta, ignore este email</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666666; font-size: 14px;">
                    <strong>Status:</strong> Conta ativa e pronta para uso
                </p>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-logo">AS</div>
            <p><strong>Aldeia Singular</strong></p>
            <p>Transformando vidas através da educação e desenvolvimento pessoal</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999999;">
                Este é um email automático, por favor não responda.
            </p>
        </div>
    </div>
</body>
</html>
```

### **4. Variáveis Disponíveis no Template:**

O Supabase "Invite user" tem acesso às seguintes variáveis:
- `{{ .Email }}` - Email do usuário
- `{{ .FullName }}` - Nome completo (do metadata)
- `{{ .ConfirmationURL }}` - URL de confirmação
- `{{ .GeneratedPassword }}` - Senha gerada (do metadata)

### **5. Teste o Template:**

Após configurar, teste criando um novo usuário para verificar se a senha aparece no email.

## ✅ **Resultado Esperado:**

O email deve mostrar:
```
🔑 Suas Credenciais de Acesso
Email: ricardo.brasiliadf@hotmail.com
Senha Temporária: vih5x2nb5DNDI1BF
Status: Conta ativa e pronta para uso
```

## 🔧 **Se a Senha Ainda Não Aparecer:**

Se a variável `{{ .GeneratedPassword }}` não funcionar, podemos usar uma abordagem alternativa:

1. **Usar Edge Function** para envio de email personalizado
2. **Ou modificar o template** para usar outras variáveis disponíveis

**Teste primeiro com o template acima e me informe se a senha aparece no email!** 🚀
