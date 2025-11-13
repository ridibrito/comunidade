import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para gerar UUID simples
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função para escapar caracteres HTML especiais
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Edge Function iniciada');
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar requisição', details: parseError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { email, name, tempPassword } = requestBody;
    console.log('📧 Dados recebidos:', { email, name, hasTempPassword: !!tempPassword });

    if (!email || !name || !tempPassword) {
      console.error('❌ Dados incompletos:', { email, name, hasTempPassword: !!tempPassword });
      return new Response(
        JSON.stringify({ error: 'Email, nome e senha são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // HTML do email exatamente no padrão visual fornecido
    let emailHTML: string;
    try {
      // Escapar variáveis para prevenir problemas com caracteres especiais
      const escapedName = escapeHtml(name);
      const escapedEmail = escapeHtml(email);
      const escapedPassword = escapeHtml(tempPassword);
      const currentYear = new Date().getFullYear();
      
      emailHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Bem-vindo(a) à Aldeia Singular</title>
  <style>
    body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4;margin:0;padding:0}
    .container{max-width:600px;margin:20px auto;background:#fff;padding:0;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1);overflow:hidden;border:1px solid #eee}
    .topbar{height:6px;background:#ffb000}
    .header{text-align:left;padding:20px 28px;border-bottom:1px solid #eee}
    .brand{display:block;width:220px;max-width:100%;height:auto}
    .title{padding:14px 28px 0 28px}
    .title h1{color:#1c1c1c;font-size:22px;margin:0;line-height:1.4}
    .content{padding:16px 28px 24px 28px}
    .content p{margin:0 0 14px 0}
    .credentials-box{margin:20px 0;background-color:#f8f9fa;border:1px solid #e9ecef;border-radius:6px;padding:20px}
    .credentials-box h3{margin:0 0 12px 0;font-size:14px;font-weight:bold;color:#666}
    .credential-item{margin-bottom:12px;padding:10px;background-color:#ffffff;border-radius:4px;border-left:3px solid #ffb000}
    .credential-label{font-size:12px;color:#666;font-weight:bold;margin-bottom:5px}
    .credential-value{font-size:14px;color:#333;font-family:'Courier New',monospace;word-break:break-all;margin:0}
    .credential-warning{margin-top:12px;font-size:12px;color:#856404;line-height:1.5}
    .cta-wrap{text-align:center;margin:22px 0}
    .button{display:inline-block;background:#ffb000;color:#1c1c1c!important;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold}
    .footer-gradient{margin-top:10px;padding:24px 20px;background:radial-gradient(120% 140% at 10% 80%, rgba(197,72,115,.25) 0%, rgba(28,28,28,0) 55%), #1C1C1C;color:#fff;text-align:left}
    .footer-gradient h3{margin:0 0 6px 0;font-size:18px;line-height:28px;font-weight:700}
    .footer-gradient span{color:#FFB000}
    .footer{text-align:center;padding:14px 20px;background:#111;border-top:1px solid #2a2a2a;font-size:12px;color:#a0a0a0}
    .footer a{color:#ffb000;text-decoration:underline}
  </style>
</head>
<body>
  <div class="container">
    <div class="topbar"></div>
    <div class="header">
      <img src="https://live.aldeiasingular.com.br/horizontal.png" alt="Aldeia Singular" class="brand">
    </div>
    <div class="title">
      <h1>Bem-vindo(a) à Aldeia Singular</h1>
    </div>
    <div class="content">
      <p>Olá ${escapedName},</p>
      <p>Estamos muito felizes em ter você conosco! 🌿</p>
      <p>Sua conta foi criada com sucesso na <strong>Aldeia Singular</strong>. A partir de agora, você faz parte de uma comunidade que acredita em transformação, acolhimento e crescimento conjunto.</p>
      
      <div class="credentials-box">
        <h3>🔑 Suas credenciais de acesso:</h3>
        <div class="credential-item">
          <div class="credential-label">Email:</div>
          <div class="credential-value">${escapedEmail}</div>
        </div>
        <div class="credential-item">
          <div class="credential-label">Senha Temporária:</div>
          <div class="credential-value">${escapedPassword}</div>
        </div>
        <div class="credential-warning">
          <strong>Importante:</strong> Esta é uma senha temporária. Você será solicitado a alterar sua senha no primeiro login.
        </div>
      </div>

      <p>Para começar sua jornada, clique no botão abaixo e acesse sua conta:</p>
      <div class="cta-wrap">
        <a href="https://app.aldeiasingular.com.br/auth/login" class="button">🚀 Acessar a Aldeia Singular</a>
      </div>
      <p>Em caso de dúvidas ou suporte, visite nosso site:  
        <a href="https://aldeiasingular.com.br" target="_blank" style="color:#ffb000;text-decoration:underline;">aldeiasingular.com.br</a>
      </p>
      <p>Com carinho,<br>Equipe Aldeia Singular 🦉</p>
    </div>
    <div class="footer-gradient">
      <h3><span>Pais</span> acolhidos.</h3>
      <h3><span>Filhos</span> compreendidos.</h3>
      <h3><span>Lares</span> fortalecidos.</h3>
    </div>
    <div class="footer">
      <p>&copy; ${currentYear} Comunidade Aldeia Singular. Todos os direitos reservados.</p>
      <p><a href="https://aldeiasingular.com.br" target="_blank" rel="noopener">aldeiasingular.com.br</a></p>
    </div>
  </div>
</body>
</html>`;
    } catch (htmlError) {
      console.error('❌ Erro ao criar HTML:', htmlError);
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar template de email', details: htmlError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enviar email usando Resend
    console.log('🔑 Verificando RESEND_API_KEY...');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('🔑 RESEND_API_KEY presente:', !!resendApiKey);
    
    if (!resendApiKey) {
      console.warn('⚠️  RESEND_API_KEY não configurada. Email não será enviado.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'RESEND_API_KEY não configurada',
          emailHTML: emailHTML,
          credentials: {
            email: email,
            name: name,
            tempPassword: tempPassword
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📮 Preparando envio via Resend API...');
    
    // Usar domínio verificado se disponível, senão usar resend.dev
    const mailFrom = Deno.env.get('MAIL_FROM') || 'Aldeia Singular <onboarding@resend.dev>';
    const mailFromName = Deno.env.get('MAIL_FROM_NAME') || 'Aldeia Singular';
    
    const emailPayload: any = {
      from: mailFrom,
      to: [email],
      subject: 'Bem-vindo à Aldeia Singular!',
      html: emailHTML,
      // NÃO usar 'text' para garantir que apenas HTML seja usado
      // text: '', // Removido para forçar uso do HTML
      // Headers para melhorar entrega em Gmail, Hotmail, Yahoo
      headers: {
        'X-Entity-Ref-ID': generateUUID(),
        'X-Priority': '1',
        'Importance': 'high',
      },
      // Tags para tracking e organização
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'source', value: 'user-signup' }
      ],
    };
    
    // Log do HTML completo para debug
    console.log('📄 HTML completo (primeiros 500 chars):', emailHTML.substring(0, 500));
    console.log('📄 HTML completo (tamanho total):', emailHTML.length, 'caracteres');
    
    console.log('📮 Payload preparado:', { 
      from: emailPayload.from, 
      to: emailPayload.to, 
      subject: emailPayload.subject,
      hasHeaders: !!emailPayload.headers,
      htmlLength: emailHTML.length,
      htmlPreview: emailHTML.substring(0, 200) + '...',
      payloadKeys: Object.keys(emailPayload)
    });

    // Enviar email via Resend API com retry
    console.log('🌐 Fazendo request para Resend...');
    let resendResponse: Response;
    let resendData: any;
    let lastError: any;
    
    // Tentar até 3 vezes em caso de erro temporário
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Log do payload completo antes de enviar para debug
        console.log(`📤 Enviando payload (tentativa ${attempt}):`, JSON.stringify({
          from: emailPayload.from,
          to: emailPayload.to,
          subject: emailPayload.subject,
          htmlLength: emailPayload.html?.length || 0,
          htmlPreview: emailPayload.html?.substring(0, 300) || 'HTML não encontrado',
          hasHeaders: !!emailPayload.headers,
          hasTags: !!emailPayload.tags
        }));
        
        resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        console.log(`📡 Resposta recebida do Resend (tentativa ${attempt}). Status:`, resendResponse.status);
        
        const responseText = await resendResponse.text();
        try {
          resendData = JSON.parse(responseText);
        } catch {
          resendData = { message: responseText, status: resendResponse.status };
        }
        
        console.log('📡 Dados da resposta:', resendData);

        // Se sucesso ou erro não temporário, sair do loop
        if (resendResponse.ok || (resendResponse.status !== 429 && resendResponse.status !== 500 && resendResponse.status !== 502 && resendResponse.status !== 503)) {
          break;
        }
        
        // Se erro temporário e não é última tentativa, aguardar antes de tentar novamente
        if (attempt < 3) {
          const waitTime = attempt * 1000; // 1s, 2s
          console.log(`⏳ Aguardando ${waitTime}ms antes de tentar novamente...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        lastError = resendData;
      } catch (fetchError) {
        console.error(`❌ Erro na tentativa ${attempt}:`, fetchError);
        lastError = fetchError;
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    if (!resendResponse!.ok) {
      console.error('❌ Erro ao enviar email via Resend após todas as tentativas:', resendData);
      
      // Log detalhado do erro para debug
      const errorDetails = {
        status: resendResponse!.status,
        statusText: resendResponse!.statusText,
        error: resendData,
        email: email,
        from: emailPayload.from,
      };
      console.error('❌ Detalhes do erro:', JSON.stringify(errorDetails, null, 2));
      
      // Retornar erro específico baseado no tipo
      let errorMessage = 'Erro ao enviar email';
      if (resendData?.message) {
        errorMessage = resendData.message;
      } else if (resendResponse!.status === 422) {
        errorMessage = 'Email inválido ou domínio não verificado';
      } else if (resendResponse!.status === 429) {
        errorMessage = 'Limite de envio excedido. Tente novamente mais tarde';
      } else if (resendResponse!.status === 403) {
        errorMessage = 'API Key inválida ou sem permissão';
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: errorMessage,
          error: resendData,
          details: errorDetails,
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Email enviado com sucesso via Resend:', resendData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        emailId: resendData.id,
        credentials: {
          email: email,
          name: name,
          tempPassword: tempPassword
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Erro na Edge Function:', error);
    console.error('💥 Stack trace:', error.stack);
    console.error('💥 Mensagem:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
