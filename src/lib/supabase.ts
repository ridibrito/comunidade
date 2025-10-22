import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Singleton para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getBrowserSupabaseClient() {
  // Reutiliza a instância criada por createClient para garantir cookie-based auth do SSR
  if (supabaseClient) return supabaseClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null as unknown as never;
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase credentials not configured. Check your environment variables.");

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


