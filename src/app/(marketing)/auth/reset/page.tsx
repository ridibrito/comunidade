"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Página aberta via link de recuperação do Supabase
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setMessage("Senha deve ter no mínimo 8 caracteres.");
    if (password !== confirm) return setMessage("As senhas não conferem.");
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return setMessage("Supabase não configurado.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else router.push("/onboarding/sucesso");
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex justify-center">
          <Image src="/logo_full.png" alt="Singulari" width={200} height={40} />
        </div>
        <h1 className="text-2xl font-semibold">Definir nova senha</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm">Nova senha</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
          </div>
          <div>
            <label className="text-sm">Confirmar senha</label>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
          </div>
          <button className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--accent-purple)] text-white hover:brightness-110">Salvar</button>
        </form>
        {message && <div className="mt-3 text-sm text-[var(--foreground)]/80">{message}</div>}
      </div>
    </main>
  );
}


