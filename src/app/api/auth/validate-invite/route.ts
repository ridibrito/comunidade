import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: "Token e email são obrigatórios" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Buscar usuário pelo email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }

    const user = users?.users?.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    // Verificar se o token é válido
    if (profile.invite_token !== token) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

    // Verificar se o convite ainda é válido (não expirou)
    const inviteSentAt = new Date(profile.invite_sent_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - inviteSentAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 72) { // Convite expira em 72 horas
      return NextResponse.json({ error: "Convite expirado" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        role: profile.role
      }
    });

  } catch (error) {
    console.error("Erro ao validar convite:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" }, 
      { status: 500 }
    );
  }
}
