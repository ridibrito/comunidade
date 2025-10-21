import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !service) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    
    // list users (emails)
    const emails: Record<string, string> = {};
    let page = 1;
    for (let i = 0; i < 10; i++) { // hard cap 1000 users per request
      const resp = await supabase.auth.admin.listUsers({ page, perPage: 100 });
      if (resp.error) {
        console.error("Erro ao listar usuários:", resp.error);
        throw new Error(`Erro ao listar usuários: ${resp.error.message}`);
      }
      const users = resp.data?.users ?? [];
      for (const u of users) emails[u.id] = u.email ?? "";
      if (users.length < 100) break;
      page++;
    }
    
    // profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, role, invite_status, invite_sent_at, last_login_at, login_count, invited_by, invite_email");
    
    if (profilesError) {
      console.error("Erro ao buscar perfis:", profilesError);
      throw new Error(`Erro ao buscar perfis: ${profilesError.message}`);
    }
    
    const list = (profiles ?? []).map((p: any) => ({ 
      id: p.id, 
      full_name: p.full_name, 
      role: p.role, 
      email: emails[p.id] ?? "",
      invite_status: p.invite_status || 'pending',
      invite_sent_at: p.invite_sent_at,
      last_login_at: p.last_login_at,
      login_count: p.login_count || 0,
      invited_by: p.invited_by,
      invite_email: p.invite_email
    }));
    
    console.log("Users found:", list.length);
    return NextResponse.json({ users: list });
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, role } = await req.json();
    const supabase = getAdminClient();
    
    // Verificar se usuário já existe
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === email);
    
    if (userExists) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 400 });
    }
    
    // Gerar token único para o convite
    const inviteToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Usar o sistema de convites do Supabase com Resend integrado
    const { data: inviteResult, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: name,
        role: role,
        invite_token: inviteToken,
        Nome: name,  // Variável específica para o template do email
        name: name   // Variável padrão do template
      },
      redirectTo: config.getResetUrl(inviteToken, email)
    });
    
    if (inviteError) {
      console.error("Erro ao enviar convite:", inviteError);
      // Se falhar o convite do Supabase, criar usuário manualmente
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: false,
        user_metadata: {
          full_name: name,
          role: role,
          invite_token: inviteToken,
          Nome: name,  // Variável específica para o template do email
          name: name   // Variável padrão do template
        }
      });
      
      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
      
      if (newUser.user?.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ 
            id: newUser.user.id, 
            full_name: name ?? "", 
            role: role ?? null, 
            is_admin: role === "admin",
            invite_status: 'sent',
            invite_sent_at: new Date().toISOString(),
            invite_email: email,
            invite_token: inviteToken
          });
          
        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          return NextResponse.json({ error: "Erro ao criar perfil do usuário" }, { status: 500 });
        }
      }
      
      const inviteLink = config.getResetUrl(inviteToken, email);
      
      return NextResponse.json({ 
        ok: true, 
        userId: newUser.user?.id,
        message: "Usuário criado. Convite enviado via Supabase (pode ter falhado).",
        inviteToken,
        inviteLink,
        supabaseError: inviteError.message
      });
    }
    
    // Se o convite do Supabase funcionou, criar o perfil
    if (inviteResult.user?.id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ 
          id: inviteResult.user.id, 
          full_name: name ?? "", 
          role: role ?? null, 
          is_admin: role === "admin",
          invite_status: 'sent',
          invite_sent_at: new Date().toISOString(),
          invite_email: email,
          invite_token: inviteToken
        });
        
      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        return NextResponse.json({ error: "Erro ao criar perfil do usuário" }, { status: 500 });
      }
    }
    
    // Se chegou aqui, o convite do Supabase funcionou
    return NextResponse.json({ 
      ok: true, 
      userId: inviteResult.user?.id,
      message: "Convite enviado com sucesso via Supabase!",
      inviteToken,
      emailSent: true
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { id, full_name, role } = await req.json();
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const supabase = getAdminClient();
  // update profile (role + name + is_admin flag)
  await supabase.from("profiles").update({ full_name: full_name ?? null, role: role ?? null, is_admin: role === "admin" }).eq("id", id);
  // update auth user metadata name (optional)
  try {
    await supabase.auth.admin.updateUserById(id, { user_metadata: { full_name } } as { user_metadata: { full_name: string } });
  } catch {}
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await supabase.auth.admin.deleteUser(id);
  await supabase.from("profiles").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}


