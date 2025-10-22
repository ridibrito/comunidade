# Configuração do Template de Email no Supabase

## 🎯 Objetivo
Configurar o template de reset de senha do Supabase para enviar emails automáticos com credenciais quando novos usuários são criados.

## 📧 Configuração do Template

### 1. Acessar o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **Authentication**
4. Clique em **Email Templates**

### 2. Configurar o Template "Confirm signup"
1. Na seção **Email Templates**, encontre **"Confirm signup"**
2. Clique em **"Customize"** ou **"Edit"**

### 3. Personalizar o Template

#### **Assunto do Email:**
```
Bem-vindo à Comunidade Montanha do Amanhã! Confirme seu acesso
```

#### **Conteúdo do Email (HTML):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Comunidade Montanha do Amanhã!</title>
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
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
            border-top: 5px solid #6b46c1; 
        }
        .header { 
            text-align: center; 
            padding-bottom: 20px; 
            border-bottom: 1px solid #eeeeee; 
        }
        .header h1 { 
            color: #6b46c1; 
            font-size: 24px; 
            margin: 0; 
        }
        .content { 
            padding: 20px 0; 
        }
        .content p { 
            margin-bottom: 15px; 
        }
        .button-container { 
            text-align: center; 
            margin-top: 20px; 
        }
        .button { 
            display: inline-block; 
            background-color: #6b46c1; 
            color: #ffffff !important; 
            padding: 12px 25px; 
            border-radius: 5px; 
            text-decoration: none; 
            font-weight: bold; 
        }
        .footer { 
            text-align: center; 
            padding-top: 20px; 
            border-top: 1px solid #eeeeee; 
            font-size: 12px; 
            color: #777777; 
        }
        .footer a { 
            color: #6b46c1; 
            text-decoration: none; 
        }
        .credentials { 
            background-color: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 5px; 
            padding: 15px; 
            margin: 15px 0; 
        }
        .credentials h3 { 
            margin-top: 0; 
            color: #495057; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Comunidade Montanha do Amanhã</h1>
        </div>
        <div class="content">
            <p>Olá {{ .Email }},</p>
            <p>Sua conta foi criada com sucesso na Comunidade Montanha do Amanhã!</p>
            
            <div class="credentials">
                <h3>📧 Suas Credenciais de Acesso:</h3>
                <p><strong>Email:</strong> {{ .Email }}</p>
                <p><strong>Status:</strong> Conta criada e aguardando confirmação</p>
            </div>
            
            <p>Para ativar sua conta e definir sua senha, clique no botão abaixo:</p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Confirmar Acesso e Definir Senha</a>
            </div>
            
            <p><strong>Importante:</strong> Este link é válido por 24 horas. Após clicar no link, você será direcionado para definir sua senha de acesso.</p>
            
            <p>Se tiver qualquer dúvida, entre em contato conosco.</p>
            <p>Atenciosamente,<br>A Equipe Montanha do Amanhã</p>
        </div>
        <div class="footer">
            <p>&copy; {{ .CurrentYear }} Comunidade Montanha do Amanhã. Todos os direitos reservados.</p>
            <p><a href="{{ .SiteURL }}">Nosso Site</a></p>
        </div>
    </div>
</body>
</html>
```

### 4. Configurações Adicionais

#### **URLs de Redirecionamento:**
Certifique-se de que as seguintes URLs estão configuradas em **Authentication > URL Configuration**:

```
Site URL: http://localhost:3000
Additional Redirect URLs:
- http://localhost:3000/auth/callback
- http://localhost:3000/auth/change-password
- http://localhost:3000/auth/callback?type=invite
- http://localhost:3000/auth/callback?next=/auth/change-password
```

#### **Configurações de Email:**
Em **Authentication > Settings**, verifique:
- ✅ **Enable email confirmations**: ON
- ✅ **Enable email change confirmations**: ON
- ✅ **Enable phone confirmations**: OFF (se não usar telefone)

### 5. Variáveis Disponíveis no Template

O Supabase fornece as seguintes variáveis para personalização:

- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .SiteURL }}` - URL do site
- `{{ .CurrentYear }}` - Ano atual
- `{{ .Token }}` - Token de confirmação
- `{{ .TokenHash }}` - Hash do token

### 6. Testando o Template

1. **Criar um usuário de teste** via interface admin
2. **Verificar o email** na caixa de entrada
3. **Clicar no link** para confirmar
4. **Definir senha** na página de confirmação
5. **Fazer login** com as novas credenciais

### 7. Personalizações Adicionais

#### **Para Produção:**
- Substitua `http://localhost:3000` pela URL real do seu site
- Adicione logo da empresa no template
- Personalize cores e fontes conforme identidade visual
- Configure domínio de email personalizado

#### **Para Desenvolvimento:**
- Use `http://localhost:3000` para testes locais
- Configure SMTP para envio real de emails
- Teste com diferentes provedores de email (Gmail, Outlook, etc.)

## ✅ Resultado Final

Após a configuração:
- ✅ **Emails automáticos** enviados pelo Supabase
- ✅ **Template personalizado** com identidade visual
- ✅ **Link de confirmação** funcional
- ✅ **Redirecionamento** para página de definição de senha
- ✅ **Sistema robusto** e confiável

## 🔧 Troubleshooting

### Email não chega:
1. Verifique a pasta de spam
2. Confirme configurações de SMTP
3. Teste com diferentes provedores de email
4. Verifique logs do Supabase

### Link não funciona:
1. Confirme URLs de redirecionamento
2. Verifique se o link não expirou (24h)
3. Teste em navegador incógnito
4. Verifique configurações de CORS

### Template não aparece:
1. Salve as alterações no dashboard
2. Aguarde alguns minutos para propagação
3. Teste criando um novo usuário
4. Verifique se não há erros de sintaxe no HTML
