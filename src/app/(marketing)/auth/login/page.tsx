"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Configuração do Supabase ausente.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message);
    else router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex">
      {/* Coluna esquerda: formulário */}
      <section className="w-full md:w-[30%] max-w-[400px] border-r border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-center">
        <div className="mb-6 flex justify-center">
          <Image src="/logo_full.png" alt="Aldeia Singular" width={240} height={48} />
        </div>
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-[var(--foreground)]/70 mt-1 text-sm">Acesse com e‑mail e senha. No primeiro acesso, use o link de definição de senha.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
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
          <div>
            <label className="text-sm">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3"
              placeholder="Sua senha"
            />
          </div>
          <button disabled={loading} className="h-11 w-full rounded-lg bg-[var(--accent-purple)] text-white hover:brightness-110 disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-[var(--foreground)]/80">{message}</div>}
        <div className="mt-4 text-xs text-[var(--foreground)]/60">
          Esqueceu a senha? <a href="/auth/recover" className="text-[var(--accent-purple)]">Recuperar acesso</a>
        </div>
        <div className="mt-8 text-center text-[var(--foreground)]/50 text-xs">© {new Date().getFullYear()} Aldeia Singular</div>
      </section>

      {/* Coluna direita: imagem/placeholder */}
      <section className="hidden md:block flex-1 relative">
        <Image
          src="/hero.webp"
          alt="Aldeia Singular"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </section>
    </main>
  );
}


