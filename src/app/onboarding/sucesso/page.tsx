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
    <main className="min-h-[60vh] flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="page-title mb-2">Tudo pronto 🎉</h1>
        <p className="mb-4">Senha definida com sucesso. Bem-vindo(a) à Aldeia Singular!</p>
        <div className="flex items-center justify-center gap-3 text-sm text-[var(--foreground)]/80">
          <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--foreground)] animate-spin" />
          <span>Redirecionando em {seconds}s…</span>
        </div>
        <div className="mt-4">
          <button onClick={() => router.push("/dashboard")} className="h-10 px-4 rounded-lg bg-[var(--accent-purple)] text-white hover:brightness-110">Ir para o Início agora</button>
        </div>
      </div>
    </main>
  );
}


