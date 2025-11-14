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

export async function getServerSupabaseClient() {
  const { url, key } = validateSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient(
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
}


