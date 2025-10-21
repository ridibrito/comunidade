"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Sucesso() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    const r = setTimeout(() => router.push("/dashboard"), 3000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, [router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-8 text-center bg-light-bg dark:bg-dark-bg">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Tudo pronto!</h1>
          <p className="text-light-muted dark:text-dark-muted">
            Senha definida com sucesso. Bem-vindo(a) à Comunidade Coruss!
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-3 text-sm text-light-muted dark:text-dark-muted mb-6">
          <div className="w-5 h-5 rounded-full border-2 border-light-border dark:border-dark-border border-t-brand-accent animate-spin" />
          <span>Redirecionando em {seconds}s…</span>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="h-11 w-full rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors font-medium"
          >
            Ir para o Dashboard agora
          </button>
          <button 
            onClick={() => router.push("/catalog")} 
            className="h-11 w-full rounded-lg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            Explorar Conteúdo
          </button>
        </div>
      </div>
    </main>
  );
}


