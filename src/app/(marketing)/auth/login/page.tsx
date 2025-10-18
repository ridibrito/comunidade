"use client";

import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Configuração do Supabase ausente.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const redirectTo = typeof window !== "undefined" ? `${location.origin}/dashboard` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Enviamos um link de acesso para o seu e‑mail.");
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex justify-center">
          <Image src="/logo_full.png" alt="Singulari" width={200} height={40} />
        </div>
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-[var(--foreground)]/70 mt-1 text-sm">Acesso via link mágico no e‑mail cadastrado.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm">E‑mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3"
              placeholder="voce@exemplo.com"
            />
          </div>
          <button disabled={loading} className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--accent-purple)] text-white hover:brightness-110 disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar link de acesso"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-[var(--foreground)]/80">{message}</div>}
        <div className="mt-4 text-xs text-[var(--foreground)]/60">
          Precisa redefinir a senha? <a href="/auth/recover" className="text-[var(--accent-purple)]">Recuperar acesso</a>
        </div>
        <div className="mt-3 text-xs text-[var(--foreground)]/60">
          Cadastro é feito internamente ou via Hotmart após compra aprovada.
        </div>
      </div>
    </main>
  );
}


