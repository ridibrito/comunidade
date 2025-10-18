"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export function AuthButton() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signInWithOtp({ email });
    setEmail("");
  }

  async function handleSignOut() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{userEmail}</span>
        <button onClick={handleSignOut} className="px-3 py-1 text-sm rounded bg-black text-white dark:bg-white dark:text-black">Sair</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="flex items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="h-8 px-2 rounded border bg-transparent text-sm"
      />
      <button type="submit" className="px-3 py-1 text-sm rounded bg-black text-white dark:bg-white dark:text-black">Entrar</button>
    </form>
  );
}


