import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { inviteEmailTemplate } from "@/lib/email-templates";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, role = "user" } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar cliente admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verificar se o usuário já existe
    {/* @ts-ignore */}
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
    if (existingUser.user) {
      return NextResponse.json(
        { error: "Usuário já existe com este email" },
        { status: 400 }
      );
    }

    // Gerar link de reset de senha
    // Em API routes, use variáveis sem NEXT_PUBLIC_ ou force a URL de produção
    const siteUrl = process.env.SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'https://app.aldeiasingular.com.br';
    
    console.log('🔗 URL de redirecionamento configurada:', siteUrl);
    console.log('🔧 Variáveis disponíveis:', {
      SITE_URL: process.env.SITE_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
    });
    
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${siteUrl}/auth/reset?email=${encodeURIComponent(email)}`
      }
    });

    if (resetError) {
      console.error("Erro ao gerar link de reset:", resetError);
      return NextResponse.json(
        { error: "Erro ao gerar link de convite" },
        { status: 500 }
      );
    }

    // Criar registro na tabela profiles com status de convite pendente
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: resetData.user.id,
        full_name: fullName,
        role: role,
        invite_status: 'pending',
        invite_email: email,
        invite_sent_at: new Date().toISOString(),
        // @ts-ignore
        invite_token: resetData.properties?.access_token || null
      })
      .select()
      .single();

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError);
      return NextResponse.json(
        { error: "Erro ao criar perfil do usuário" },
        { status: 500 }
      );
    }

    // Gerar template de email
    const emailTemplate = inviteEmailTemplate(fullName, resetData.properties?.action_link || '');
    
    // Enviar email via Resend
    console.log("🔗 Link de convite gerado:", resetData.properties?.action_link);
    console.log("📧 Tentando enviar email para:", email);
    
    try {
      // Tentar enviar via Resend direto primeiro
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (resendApiKey) {
        console.log("📧 Enviando email diretamente via Resend");
        
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.MAIL_FROM || 'Comunidade Coruss <noreply@aldeiasingular.com.br>',
            to: email,
            subject: 'Bem-vindo à Comunidade Coruss! 🎉',
            html: emailTemplate
          })
        });
        
        if (resendResponse.ok) {
          const result = await resendResponse.json();
          console.log("✅ Email enviado com sucesso via Resend:", result.id);
        } else {
          const error = await resendResponse.json();
          console.error("❌ Erro ao enviar email via Resend:", error);
          throw new Error('Falha ao enviar email via Resend');
        }
      } else {
        console.warn("⚠️ RESEND_API_KEY não configurada. Email não será enviado.");
      }
    } catch (emailError: any) {
      console.error("❌ Erro ao processar envio de email:", emailError.message || emailError);
      // Não falhar a requisição se o email falhar
    }

    return NextResponse.json({
      success: true,
      message: "Convite enviado com sucesso",
      inviteLink: resetData.properties?.action_link, // Para desenvolvimento
      user: {
        id: profileData.id,
        email: email,
        full_name: fullName,
        role: role,
        invite_status: 'pending'
      }
    });

  } catch (error) {
    console.error("Erro no convite de usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
