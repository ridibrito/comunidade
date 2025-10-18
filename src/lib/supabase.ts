import { createBrowserClient } from "@supabase/ssr";

export function getBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null as unknown as never;
  return createBrowserClient(url, key);
}


