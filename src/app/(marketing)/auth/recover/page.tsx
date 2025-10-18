"use client";

import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function RecoverPage() {
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
    const redirectTo = typeof window !== "undefined" ? `${location.origin}/auth/reset` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Enviamos um link para redefinição de senha.");
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex justify-center">
          <Image src="/logo_full.png" alt="Singulari" width={200} height={40} />
        </div>
        <h1 className="text-2xl font-semibold">Recuperar acesso</h1>
        <p className="text-[var(--foreground)]/70 mt-1 text-sm">Informe seu e‑mail cadastrado para receber o link de redefinição.</p>
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
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-[var(--foreground)]/80">{message}</div>}
        <div className="mt-4 text-xs text-[var(--foreground)]/60">
          Lembrou a senha? <a href="/auth/login" className="text-[var(--accent-purple)]">Voltar ao login</a>
        </div>
      </div>
    </main>
  );
}


