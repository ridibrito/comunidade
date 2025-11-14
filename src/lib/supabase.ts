import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Singleton para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

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

export function getBrowserSupabaseClient() {
  // Reutiliza a instância criada por createClient para garantir cookie-based auth do SSR
  if (supabaseClient) return supabaseClient;
  const { url, key } = validateSupabaseEnv();
  supabaseClient = createBrowserClient(url, key);
  return supabaseClient;
}

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function createClient() {
  // Reutilizar instância existente se disponível
  if (supabaseClient) return supabaseClient;

  const { url, key } = validateSupabaseEnv();

  // Usa createBrowserClient (SSR helper) para sincronizar cookies com o servidor
  supabaseClient = createBrowserClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }) as unknown as ReturnType<typeof createSupabaseClient>;

  return supabaseClient;
}


