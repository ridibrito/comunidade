import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Edge Function iniciada');
    const { email, name, tempPassword } = await req.json();
    console.log('Dados recebidos:', email, name);

    if (!email || !name || !tempPassword) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // HTML SUPER SIMPLES
    const emailHTML = `
      <html>
        <body>
          <h1>Bem-vindo ${name}</h1>
          <p>Email: ${email}</p>
          <p>Senha: ${tempPassword}</p>
          <a href="https://app.aldeiasingular.com.br/auth/login">Acessar</a>
        </body>
      </html>
    `;

    console.log('Verificando RESEND_API_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('API Key presente:', !!resendApiKey);
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY nao configurada');
      return new Response(
        JSON.stringify({ success: false, message: 'API Key nao configurada' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Preparando envio');
    const payload = {
      from: 'Aldeia Singular <onboarding@resend.dev>',
      to: [email],
      subject: 'Bem-vindo a Aldeia Singular',
      html: emailHTML,
    };

    console.log('Enviando para Resend');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Resposta status:', response.status);
    const data = await response.json();
    console.log('Resposta data:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Erro do Resend:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ success: false, error: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email enviado com sucesso');
    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ERRO:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

