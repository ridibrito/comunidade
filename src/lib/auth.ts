import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function validateSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      `Variáveis de ambiente do Supabase não configuradas!\n\n` +
      `Por favor, configure as seguintes variáveis no arquivo .env.local:\n` +
      `- NEXT_PUBLIC_SUPABASE_URL\n` +
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n` +
      `Você pode encontrar essas credenciais em:\n` +
      `https://supabase.com/dashboard/project/_/settings/api`
    );
  }

  return { url, key };
}

export async function getServerUser() {
  const { url, key } = validateSupabaseEnv();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Sem set/remove: Next.js cookies() pode ser somente leitura em algumas rotas
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
  const { url, key } = validateSupabaseEnv();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    url,
    key,
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


