import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";
import { invalidateCache } from "@/lib/redis";

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !service) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    
    // Adicionar suporte para paginação
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 50; // Limite configurável, padrão 50
    const offset = (page - 1) * limit;

    // Cache apenas para primeira página (mais acessada) e limit padrão
    const { getCached } = await import('@/lib/redis');
    const cacheKey = (page === 1 && limit === 50) ? `admin:users:page:1:limit:${limit}` : null;
    
    const fetchUsers = async () => {
      // Buscar TODOS os emails dos usuários do auth primeiro
      const emails: Record<string, string> = {};
      const authUserIds = new Set<string>();
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore && currentPage <= 50) { // Limite de segurança: 50 páginas = 5000 usuários
        const resp = await supabase.auth.admin.listUsers({ 
          page: currentPage, 
          perPage: 100 
        });
        
        if (resp.error) {
          console.error("Erro ao listar usuários:", resp.error);
          throw new Error(`Erro ao listar usuários: ${resp.error.message}`);
        }
        
        const users = resp.data?.users ?? [];
        for (const u of users) {
          emails[u.id] = u.email ?? "";
          authUserIds.add(u.id);
        }
        
        if (users.length < 100) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }
      
      // Buscar TODOS os profiles
      const { data: allProfiles, error: profilesError, count } = await supabase
        .from("profiles")
        .select("id, full_name, role, invite_status, invite_sent_at, last_login_at, login_count, invited_by, invite_email, is_active, temp_password, password_reset_token, password_reset_expires", { count: 'exact' })
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw new Error(`Erro ao buscar perfis: ${profilesError.message}`);
      }
      
      // Criar mapa de profiles por ID
      const profilesMap = new Map((allProfiles ?? []).map((p: any) => [p.id, p]));
      
      // Criar lista combinada: profiles existentes + usuários auth sem profile
      const allUsers: any[] = [];
      
      // Adicionar todos os profiles
      for (const profile of (allProfiles ?? [])) {
        allUsers.push({
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
          email: emails[profile.id] ?? profile.invite_email ?? "",
          invite_status: profile.invite_status || 'pending',
          invite_sent_at: profile.invite_sent_at,
          last_login_at: profile.last_login_at,
          login_count: profile.login_count || 0,
          invited_by: profile.invited_by,
          invite_email: profile.invite_email,
          is_active: profile.is_active ?? true,
          temp_password: profile.temp_password,
          password_reset_token: profile.password_reset_token,
          password_reset_expires: profile.password_reset_expires
        });
      }
      
      // Adicionar usuários do auth que não têm profile (caso existam)
      for (const userId of authUserIds) {
        if (!profilesMap.has(userId)) {
          allUsers.push({
            id: userId,
            full_name: null,
            role: null,
            email: emails[userId] ?? "",
            invite_status: 'pending',
            invite_sent_at: null,
            last_login_at: null,
            login_count: 0,
            invited_by: null,
            invite_email: emails[userId] ?? "",
            is_active: true,
            temp_password: null,
            password_reset_token: null,
            password_reset_expires: null
          });
        }
      }
      
      // Ordenar por data de criação (mais recentes primeiro)
      // Se não tiver created_at, colocar no final
      allUsers.sort((a, b) => {
        const aDate = a.invite_sent_at ? new Date(a.invite_sent_at).getTime() : 0;
        const bDate = b.invite_sent_at ? new Date(b.invite_sent_at).getTime() : 0;
        return bDate - aDate;
      });
      
      // Aplicar paginação APÓS fazer o match completo
      const paginatedUsers = allUsers.slice(offset, offset + limit);
      
      console.log(`Total de usuários encontrados: ${allUsers.length} (${allProfiles?.length || 0} profiles + ${authUserIds.size - (allProfiles?.length || 0)} sem profile)`);
      console.log(`Usuários admin encontrados: ${allUsers.filter(u => u.role === 'admin').length}`);
      
      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: allUsers.length,
          totalPages: Math.ceil(allUsers.length / limit)
        }
      };
    };

    // Reduzir cache para 60 segundos para garantir dados atualizados
    const result = cacheKey 
      ? await getCached(cacheKey, fetchUsers, 60) // Cache de 1 minuto apenas para primeira página
      : await fetchUsers();

    console.log(`Users found (page ${page}):`, result.users.length);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Erro desconhecido",
        users: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 1 }
      }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, role } = await req.json();
    const supabase = getAdminClient();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe (página única é suficiente para bases pequenas)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      return NextResponse.json(
        { error: `Erro ao verificar usuários existentes: ${usersError.message}` },
        { status: 500 }
      );
    }
    // @ts-ignore
    const existingUser = usersData.users?.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário já existe com este email" },
        { status: 400 }
      );
    }

    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // Criar usuário diretamente com senha temporária
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        temp_password: true,
        generated_password: tempPassword
      }
    });

    if (createError) {
      console.error("Erro ao criar usuário:", createError);
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${createError.message}` },
        { status: 500 }
      );
    }
    if (!userData?.user?.id) {
      console.error("Resposta inesperada de createUser:", userData);
      return NextResponse.json(
        { error: "Usuário criado mas resposta inválida do provedor" },
        { status: 500 }
      );
    }

    // Enviar email personalizado via Edge Function
    try {
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          name,
          tempPassword
        }
      });

      if (emailError) {
        console.error("Erro ao enviar email via Edge Function:", emailError);
      } else {
        console.log("Email enviado via Edge Function:", emailData);
      }
    } catch (emailError) {
      console.error("Erro ao chamar Edge Function:", emailError);
    }

    // Criar registro na tabela profiles
    console.log("Criando perfil para usuário:", userData.user.id);
    console.log("Dados do perfil:", {
      id: userData.user.id,
      full_name: name,
      role: role,
      is_admin: role === "admin",
      invite_status: 'pending',
      invite_email: email,
      invite_sent_at: new Date().toISOString(),
      temp_password: tempPassword
    });

    const { data: profileResult, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: name,
        role: role,
        is_admin: role === "admin",
        invite_status: 'pending', // Usuário convidado, aguardando confirmação
        invite_email: email,
        invite_sent_at: new Date().toISOString(),
        temp_password: tempPassword
      })
      .select()
      .single();

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError);
      console.error("Detalhes do erro:", JSON.stringify(profileError, null, 2));
      return NextResponse.json(
        { error: `Erro ao criar perfil do usuário: ${profileError.message}` },
        { status: 500 }
      );
    }

    // O email será enviado automaticamente pelo Supabase usando o template configurado
    // As credenciais serão exibidas no frontend para o admin

    // Invalidar cache de usuários após criar
    await invalidateCache('admin:users:*');

    return NextResponse.json({
      success: true,
      message: "Usuário criado e email com credenciais enviado com sucesso",
      emailSent: true, // Edge Function envia email personalizado
      method: "Edge Function (Email Personalizado)",
      credentials: {
        email: email,
        tempPassword: tempPassword
      },
      user: {
        id: profileResult.id,
        email: email,
        full_name: name,
        role: role,
        invite_status: 'accepted'
      }
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
  const { id, full_name, role, is_active, action } = await req.json();
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const supabase = getAdminClient();
  
  try {
    if (action === "toggle_active") {
      // Ativar/Desativar usuário
      const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", id).single();
      const newStatus = !profile?.is_active;
      
      await supabase.from("profiles").update({ is_active: newStatus }).eq("id", id);
      
      // Se desativando, também desativar no auth
      if (!newStatus) {
        try {
          await supabase.auth.admin.updateUserById(id, { 
            ban_duration: "876000h" // 100 anos = banido
          });
        } catch {}
      } else {
        try {
          await supabase.auth.admin.updateUserById(id, { 
            ban_duration: "none" // Remover ban
          });
        } catch {}
      }
      
      // Invalidar cache após mudança
      await invalidateCache('admin:users:*');

      return NextResponse.json({ 
        ok: true, 
        is_active: newStatus,
        message: newStatus ? "Usuário ativado" : "Usuário desativado"
      });
    }
    
    if (action === "reset_password") {
      // Buscar e-mail pelo id e enviar link de reset
      const { data: profileEmail, error: emailFetchError } = await supabase
        .from('profiles')
        .select('invite_email')
        .eq('id', id)
        .single();
      const targetEmail = profileEmail?.invite_email;
      if (!targetEmail || emailFetchError) {
        return NextResponse.json({ ok: false, message: 'Email do usuário não encontrado' }, { status: 404 });
      }

      const { error: resetError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: targetEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/change-password`
        }
      });
      
      if (resetError) {
        console.error("Erro ao enviar link de reset:", resetError);
        return NextResponse.json({ 
          ok: false, 
          message: "Erro ao enviar link de reset de senha"
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        ok: true, 
        message: "Link de reset de senha enviado por email"
      });
    }
    
    // Atualização normal (nome, role, etc.)
    await supabase.from("profiles").update({ 
      full_name: full_name ?? null, 
      role: role ?? null, 
      is_admin: role === "admin" 
    }).eq("id", id);
    
    // update auth user metadata name (optional)
    try {
      await supabase.auth.admin.updateUserById(id, { user_metadata: { full_name } } as { user_metadata: { full_name: string } });
    } catch {}
    
    // Invalidar cache após atualização
    await invalidateCache('admin:users:*');
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await supabase.auth.admin.deleteUser(id);
  await supabase.from("profiles").delete().eq("id", id);
  
  // Invalidar cache após deletar
  await invalidateCache('admin:users:*');
  
  return NextResponse.json({ ok: true });
}


