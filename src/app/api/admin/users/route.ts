import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !service) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET() {
  const supabase = getAdminClient();
  // list users (emails)
  const emails: Record<string, string> = {};
  let page = 1;
  for (let i = 0; i < 10; i++) { // hard cap 1000 users per request
    const resp: any = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    const users = resp?.data?.users ?? [];
    for (const u of users) emails[u.id] = u.email ?? "";
    if (users.length < 100) break;
    page++;
  }
  // profiles
  const { data: profiles } = await supabase.from("profiles").select("id, full_name, role");
  const list = (profiles ?? []).map((p: any) => ({ id: p.id, full_name: p.full_name, role: p.role, email: emails[p.id] ?? "" }));
  return NextResponse.json({ users: list });
}

export async function POST(req: NextRequest) {
  const { email, name, role } = await req.json();
  const supabase = getAdminClient();
  // send invite email from Supabase
  const invite: any = await supabase.auth.admin.inviteUserByEmail(email, { data: { full_name: name, role } });
  if (invite.error) return NextResponse.json({ error: invite.error.message }, { status: 400 });
  const user = invite.data.user;
  if (user?.id) {
    await supabase.from("profiles").upsert({ id: user.id, full_name: name ?? "", role: role ?? null, is_admin: role === "admin" });
  }
  return NextResponse.json({ ok: true, userId: user?.id });
}

export async function PATCH(req: NextRequest) {
  const { id, full_name, role } = await req.json();
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const supabase = getAdminClient();
  // update profile (role + name + is_admin flag)
  await supabase.from("profiles").update({ full_name: full_name ?? null, role: role ?? null, is_admin: role === "admin" }).eq("id", id);
  // update auth user metadata name (optional)
  try {
    await (supabase as any).auth.admin.updateUserById(id, { user_metadata: { full_name } });
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


