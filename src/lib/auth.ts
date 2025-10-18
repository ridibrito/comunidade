import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getServerUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireAdmin() {
  const user = await getServerUser();
  if (!user) return { user: null, isAdmin: false };
  // Placeholder; depois consultar tabela profiles
  const isAdmin = user.email?.endsWith("@singulari.com") ?? false;
  return { user, isAdmin };
}

export async function getServerProfile() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle();
  return data ? { ...data, email: user.email, id: user.id } : { email: user.email, id: user.id };
}


