import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServerClient();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Sem token" }, { status: 401 });

    const { data: { user }, error: uerr } = await supabase.auth.getUser(token);
    if (uerr || !user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { error } = await supabase.from("profiles").update(body).eq("id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro" }, { status: 500 });
  }
}


