export const inviteEmailTemplate = (fullName: string, inviteLink: string) => {
  return {
    subject: "Convite para acessar a plataforma Coruss",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Convite - Coruss</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #FF6B00;
            margin-bottom: 10px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #FF6B00;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #e55a00;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CORUSS</div>
            <h1 class="title">Você foi convidado!</h1>
          </div>
          
          <div class="content">
            <p>Olá <strong>${fullName}</strong>,</p>
            
            <p>Você foi convidado para fazer parte da plataforma Coruss, uma comunidade dedicada ao desenvolvimento e aprendizado sobre características AHSD.</p>
            
            <p>Para começar, você precisa definir uma senha para sua conta. Clique no botão abaixo para criar sua senha:</p>
            
            <div style="text-align: center;">
              <a href="${inviteLink}" class="button">Definir Senha e Acessar</a>
            </div>
            
            <div class="warning">
              <strong>Importante:</strong> Este link é válido por 24 horas. Após definir sua senha, você será redirecionado automaticamente para a plataforma.
            </div>
            
            <p>Se você não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${inviteLink}
            </p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>Se você não solicitou este convite, pode ignorar este email.</p>
            <p>&copy; 2024 Coruss. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá ${fullName},
      
      Você foi convidado para fazer parte da plataforma Coruss!
      
      Para começar, você precisa definir uma senha para sua conta. Acesse o link abaixo:
      
      ${inviteLink}
      
      Este link é válido por 24 horas. Após definir sua senha, você será redirecionado automaticamente para a plataforma.
      
      Se você não solicitou este convite, pode ignorar este email.
      
      Atenciosamente,
      Equipe Coruss
    `
  };
};

export const resetPasswordEmailTemplate = (fullName: string, resetLink: string) => {
  return {
    subject: "Redefinir senha - Coruss",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - Coruss</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #FF6B00;
            margin-bottom: 10px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #FF6B00;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #e55a00;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CORUSS</div>
            <h1 class="title">Redefinir Senha</h1>
          </div>
          
          <div class="content">
            <p>Olá <strong>${fullName}</strong>,</p>
            
            <p>Recebemos uma solicitação para redefinir a senha da sua conta na plataforma Coruss.</p>
            
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>Importante:</strong> Este link é válido por 24 horas. Se você não solicitou a redefinição de senha, ignore este email.
            </div>
            
            <p>Se você não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${resetLink}
            </p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>Se você não solicitou a redefinição de senha, pode ignorar este email.</p>
            <p>&copy; 2024 Coruss. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá ${fullName},
      
      Recebemos uma solicitação para redefinir a senha da sua conta na plataforma Coruss.
      
      Para redefinir sua senha, acesse o link abaixo:
      
      ${resetLink}
      
      Este link é válido por 24 horas. Se você não solicitou a redefinição de senha, ignore este email.
      
      Atenciosamente,
      Equipe Coruss
    `
  };
};
