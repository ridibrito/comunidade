import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    // Recupera usuário logado via cookies (anon key) para identificar com segurança
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceRole) {
      return NextResponse.json({ error: "Variáveis de ambiente ausentes" }, { status: 500 });
    }

    const cookieStore = req.cookies;
    const ssr = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await ssr.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Usa service role para garantir permissão de update
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: updateError } = await admin
      .from("profiles")
      .update({ invite_status: "accepted", last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// Sem PUT adicional: mantemos apenas POST com service role para evitar duplicação de imports e conflitos de build.


