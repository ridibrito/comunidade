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
    <main className="min-h-screen flex items-center justify-center p-6 bg-light-bg">
      <div className="w-full max-w-md rounded-2xl border border-light-border bg-light-surface p-6">
        <div className="mb-4 flex justify-center">
          <Image 
            src="/logo_full.png" 
            alt="Aldeia Singular" 
            width={200} 
            height={40}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <h1 className="text-2xl font-semibold text-light-text">Recuperar acesso</h1>
        <p className="text-light-muted mt-1 text-sm">Informe seu e‑mail cadastrado para receber o link de redefinição.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-light-text">E‑mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border border-light-border px-3 text-light-text placeholder-light-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              placeholder="voce@exemplo.com"
            />
          </div>
          <button disabled={loading} className="h-11 w-full rounded-xl bg-brand-accent text-white hover:brightness-110 disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-light-text">{message}</div>}
        <div className="mt-4 text-xs text-light-muted">
          Lembrou a senha? <a href="/auth/login" className="text-brand-accent">Voltar ao login</a>
        </div>
      </div>
    </main>
  );
}


