"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    <main className="min-h-screen flex bg-white dark:bg-dark-bg">
      {/* Coluna esquerda: formulário */}
      <section className="w-full md:w-[30%] max-w-[400px] border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface p-6 flex flex-col justify-center relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="mb-6 flex justify-center">
          <Image src="/logo_full.png" alt="Aldeia Singular" width={240} height={48} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text">Entrar</h1>
        <p className="text-gray-600 dark:text-dark-muted mt-1 text-sm">Acesse com e‑mail e senha. No primeiro acesso, use o link de definição de senha.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm text-gray-700 dark:text-dark-text">E‑mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border border-gray-300 dark:border-dark-border px-3 text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-dark-text">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border border-gray-300 dark:border-dark-border px-3 text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              placeholder="Sua senha"
            />
          </div>
          <button disabled={loading} className="h-11 w-full rounded-lg bg-brand-accent text-white hover:brightness-110 disabled:opacity-50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {message && <div className="mt-3 text-sm text-red-600 dark:text-red-400">{message}</div>}
        <div className="mt-4 text-xs text-gray-500 dark:text-dark-muted">
          Esqueceu a senha? <a href="/auth/recover" className="text-brand-accent hover:underline cursor-pointer">Recuperar acesso</a>
        </div>
        <div className="mt-8 text-center text-gray-400 dark:text-dark-muted text-xs">© {new Date().getFullYear()} Aldeia Singular</div>
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


