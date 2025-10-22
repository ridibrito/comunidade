# 📧 Como Configurar o Template de Email no Supabase

## 🎯 **Passo a Passo Completo:**

### **1. Acessar o Supabase Dashboard:**
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Faça login** na sua conta
3. **Selecione seu projeto** (btuenakbvssiekfdbecx)

### **2. Navegar para Authentication:**
1. No menu lateral esquerdo, clique em **"Authentication"** (ícone de cadeado)
2. Clique em **"Email Templates"**

### **3. Configurar Template "Confirm signup":**

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
            text-align: left; 
            padding: 20px 28px; 
            border-bottom: 1px solid #eeeeee; 
        }
        .brand {
            display: block;
            width: 220px;
            max-width: 100%;
            height: auto;
        }
        .title {
            padding: 0 28px 10px 28px;
        }
        .title h1 { 
            color: #1c1c1c; 
            font-size: 22px; 
            margin: 0; 
            line-height: 1.4;
        }
        .content { 
            padding: 0 28px 20px 28px; 
        }
        .content p { 
            margin-bottom: 15px; 
        }
        .credentials { 
            background-color: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 15px 0; 
        }
        .credentials h3 { 
            margin: 0 0 8px 0; 
            color: #495057; 
            font-size: 16px;
        }
        .login-button { 
            text-align: center; 
            margin-top: 20px; 
        }
        .button { 
            display: inline-block; 
            background-color: #ffb000; 
            color: #1c1c1c !important; 
            padding: 12px 22px; 
            border-radius: 10px; 
            text-decoration: none; 
            font-weight: bold; 
        }
        .footer-gradient {
            margin-top: 10px;
            padding: 24px 20px;
            background: radial-gradient(120% 140% at 10% 80%, rgba(197,72,115,0.25) 0%, rgba(28,28,28,0) 55%), #1C1C1C;
            color: #ffffff;
            text-align: left;
        }
        .footer-gradient h3 {
            margin: 0 0 6px 0;
            font-size: 18px;
            line-height: 28px;
            font-weight: 700;
        }
        .footer-gradient span { color: #FFB000; }
        .footer { 
            text-align: center; 
            padding: 14px 20px; 
            background: #111111;
            border-top: 1px solid #2a2a2a; 
            font-size: 12px; 
            color: #a0a0a0; 
        }
        .footer a { 
            color: #ffb000; 
            text-decoration: underline; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="topbar"></div>

        <div class="header">
            <img src="https://live.aldeiasingular.com.br/horizontal.png" alt="Aldeia Singular" class="brand">
        </div>

        <div class="title">
            <h1>Bem-vindo(a) à Aldeia Singular!</h1>
        </div>

        <div class="content">
            <p>Olá {{ .Email }},</p>
            <p>Sua conta foi criada com sucesso na <strong>Comunidade Aldeia Singular</strong>!</p>

            <div class="credentials">
                <h3>🔑 Suas Credenciais de Acesso</h3>
                <p><strong>Email:</strong> {{ .Email }}</p>
                <p><strong>Senha Temporária:</strong> [SENHA_GERADA_PELO_SISTEMA]</p>
                <p><strong>Status:</strong> Conta ativa e pronta para uso</p>
            </div>

            <p>Você pode fazer login agora mesmo usando essas credenciais:</p>

            <div class="login-button">
                <a href="{{ .SiteURL }}/auth/login" class="button">Fazer Login Agora</a>
            </div>

            <p><strong>Importante:</strong> Recomendamos que você altere sua senha após o primeiro login por questões de segurança.</p>

            <p>Se precisar de ajuda, estamos por aqui.</p>
            <p>Com carinho,<br>Equipe Aldeia Singular 🦉</p>
        </div>

        <div class="footer-gradient">
            <h3><span>Pais</span> acolhidos.</h3>
            <h3><span>Filhos</span> compreendidos.</h3>
            <h3><span>Lares</span> fortalecidos.</h3>
        </div>

        <div class="footer">
            <p>&copy; {{ .CurrentYear }} Comunidade Aldeia Singular. Todos os direitos reservados.</p>
            <p><a href="{{ .SiteURL }}" target="_blank">aldeiasingular.com.br</a></p>
        </div>
    </div>
</body>
</html>
```

### **4. Configurações Adicionais:**

#### **Site URL:**
```
http://localhost:3000
```

#### **Redirect URLs:**
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/login
http://localhost:3000/dashboard
```

### **5. Salvar Configurações:**
1. **Cole o HTML** no campo "Body"
2. **Digite o assunto** no campo "Subject"
3. **Clique em "Save"** para salvar
4. **Aguarde confirmação** de que foi salvo

## 🎯 **Variáveis Disponíveis:**

- `{{ .Email }}` - Email do usuário
- `{{ .SiteURL }}` - URL do site
- `{{ .CurrentYear }}` - Ano atual
- `{{ .ConfirmationURL }}` - URL de confirmação (não usado neste caso)

## ⚠️ **Importante:**

**O template atual não mostra a senha temporária porque o Supabase não tem acesso a ela. A senha é gerada pelo nosso sistema e exibida apenas no frontend para o admin.**

**Para mostrar a senha no email, precisaríamos:**
1. **Usar Edge Function** (mais complexo)
2. **Ou enviar email separado** após criar usuário
3. **Ou usar sistema de email externo** (Resend, SendGrid, etc.)

## 🧪 **Teste:**

1. **Configure o template** seguindo os passos acima
2. **Crie um usuário** via interface admin
3. **Verifique o email** recebido
4. **Confirme** que o design está correto

## 📞 **Se Precisar de Ajuda:**

1. **Verifique** se todas as configurações foram salvas
2. **Teste** criando um usuário
3. **Verifique** a caixa de spam do email
4. **Confirme** que o template está ativo

**O template está pronto para ser configurado no Supabase Dashboard!** 🚀
