import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { inviteEmailTemplate } from "@/lib/email-templates";
import crypto from "crypto";

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
        
        // Usar domínio verificado se disponível
        const mailFrom = process.env.MAIL_FROM || 'Comunidade Coruss <noreply@aldeiasingular.com.br>';
        
        const emailPayload: any = {
          from: mailFrom,
          to: email,
          subject: 'Bem-vindo à Comunidade Coruss! 🎉',
          html: emailTemplate,
          // Headers para melhorar entrega em Gmail, Hotmail, Yahoo
          headers: {
            'X-Entity-Ref-ID': crypto.randomUUID(),
            'X-Priority': '1',
            'Importance': 'high',
          },
          // Tags para tracking
          tags: [
            { name: 'category', value: 'invite' },
            { name: 'source', value: 'admin-invite' }
          ],
        };
        
        // Tentar até 3 vezes em caso de erro temporário
        let resendResponse: Response | null = null;
        let result: any = null;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            resendResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(emailPayload)
            });
            
            const responseText = await resendResponse.text();
            try {
              result = JSON.parse(responseText);
            } catch {
              result = { message: responseText, status: resendResponse.status };
            }
            
            if (resendResponse.ok) {
              console.log(`✅ Email enviado com sucesso via Resend (tentativa ${attempt}):`, result.id);
              break;
            }
            
            // Se erro não temporário, sair do loop
            if (resendResponse.status !== 429 && resendResponse.status !== 500 && resendResponse.status !== 502 && resendResponse.status !== 503) {
              break;
            }
            
            // Se erro temporário e não é última tentativa, aguardar
            if (attempt < 3) {
              const waitTime = attempt * 1000;
              console.log(`⏳ Aguardando ${waitTime}ms antes de tentar novamente...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }
          } catch (fetchError: any) {
            console.error(`❌ Erro na tentativa ${attempt}:`, fetchError);
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            } else {
              throw fetchError;
            }
          }
        }
        
        if (!resendResponse?.ok) {
          console.error("❌ Erro ao enviar email via Resend após todas as tentativas:", result);
          const errorMessage = result?.message || `Erro HTTP ${resendResponse?.status}`;
          throw new Error(`Falha ao enviar email via Resend: ${errorMessage}`);
        }
      } else {
        console.warn("⚠️ RESEND_API_KEY não configurada. Email não será enviado.");
      }
    } catch (emailError: any) {
      console.error("❌ Erro ao processar envio de email:", emailError.message || emailError);
      // Não falhar a requisição se o email falhar, mas logar o erro
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
