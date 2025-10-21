# Template de Email de Convite - Supabase/Resend

## Template HTML para usar no Supabase Dashboard

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Convite – Comunidade Coruss</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    body { margin:0; padding:0; width:100% !important; height:100% !important; font-family:'Inter', Arial, Helvetica, sans-serif; }
    @media screen and (max-width:600px){
      .wrapper { width:100% !important; padding:0 16px !important; }
      .h1 { font-size:22px !important; line-height:30px !important; }
      .p  { font-size:15px !important; line-height:24px !important; }
      .footer-slogan { text-align:left !important; }
    }
  </style>
</head>
<body style="background:#f5f5f5; margin:0; padding:0;">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f5f5f5;">
    Você foi convidado(a) para a Comunidade Coruss. Defina sua senha para acessar.
  </div>

  <table role="presentation" width="100%" align="center">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" class="wrapper" style="background:#ffffff; border-radius:12px; overflow:hidden;">
          <tr>
            <td align="left" style="padding:20px 28px; border-bottom:1px solid #eee;">
               <img src="https://app.aldeiasingular.com.br/logo_full.png" width="220" alt="Comunidade Coruss" style="max-width:220px;">
            </td>
          </tr>

          <tr>
            <td align="left" style="padding:24px 28px 0;">
              <h1 class="h1" style="margin:0; font-size:24px; line-height:32px; font-weight:700; color:#1c1c1c;">Convite para a Comunidade Coruss</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 0;">
              <table role="presentation" width="100%"><tr><td style="border-top:1px solid #eee; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table>
            </td>
          </tr>

          <tr>
            <td align="left" style="padding:18px 28px 0;">
              <p class="p" style="margin:0 0 16px; font-size:16px; line-height:26px; color:#3c3c3c;">
                Olá, {{ if .Data.name }}{{ .Data.name }}{{ else }}{{ .Email }}{{ end }},
              </p>
              <p class="p" style="margin:0 0 16px; font-size:16px; line-height:26px; color:#3c3c3c;">
                Você foi convidado(a) a participar da <strong>Comunidade Coruss</strong>. Para ativar seu acesso, defina uma senha segura para sua conta.
              </p>
              <p class="p" style="margin:0 0 20px; font-size:16px; line-height:26px; color:#3c3c3c;">
                Clique no botão abaixo para definir sua senha:
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:6px 28px 28px 28px;">
              <a href="{{ .ConfirmationURL }}" target="_blank"
                 style="display:inline-block; text-align:center; text-decoration:none; background:#43085E; color:#ffffff; font-weight:600; font-size:16px; line-height:24px; padding:14px 22px; border-radius:10px; width:100%; max-width:544px;">
                >> DEFINIR MINHA SENHA <<
              </a>
              <p style="margin:14px 0 0; font-size:12px; line-height:18px; color:#707070;">
                Se você não reconhece este convite, ignore este e-mail.
              </p>
            </td>
          </tr>

          <tr>
            <td align="left" style="padding:0 28px 28px 28px;">
              <p class="p" style="margin:0; font-size:16px; line-height:26px; color:#1c1c1c;"><strong>Equipe Comunidade Coruss</strong></p>
            </td>
          </tr>

          <tr>
            <td style="padding:0;">
              <table role="presentation" width="100%" style="background:#43085E;">
                <tr>
                  <td valign="middle" style="padding:28px 24px;">
                    <div style="color:#ffffff;">
                      <div style="font-size:22px; line-height:30px; font-weight:700; margin:0 0 6px;"><span style="color:#FFB000;">Educação</span> transformadora.</div>
                      <div style="font-size:22px; line-height:30px; font-weight:700; margin:0 0 6px;"><span style="color:#FFB000;">Comunidade</span> unida.</div>
                      <div style="font-size:22px; line-height:30px; font-weight:700; margin:0;"><span style="color:#FFB000;">Futuro</span> brilhante.</div>
                    </div>
                  </td>
                  <td valign="middle" align="right" style="padding:28px;">
                     <a href="https://app.aldeiasingular.com.br/" target="_blank" style="color:#fff; text-decoration:none; font-size:14px;">app.aldeiasingular.com.br</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:12px 28px; background:#2D1B3D; border-top:1px solid #5A3A6B; text-align:center;">
                    <p style="margin:0; font-size:12px; line-height:18px; color:#a0a0a0;">
                      Você recebeu este e-mail porque foi convidado(a) a acessar a <strong>Comunidade Coruss</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>