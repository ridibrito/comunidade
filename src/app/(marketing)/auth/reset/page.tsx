"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [inviteUser, setInviteUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar se é um convite ou reset de senha
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const hash = window.location.hash;
    
    // Se há token e email na URL, é um convite
    if (token && email) {
      setIsInvite(true);
      validateInviteToken(token, email);
    }
    // Se há hash na URL, provavelmente é um convite do Supabase
    else if (hash.includes('access_token') || hash.includes('type=signup')) {
      setIsInvite(true);
      setInviteValid(true); // Assumir válido para fluxo do Supabase
    } 
    // Se há type=invite na URL
    else if (type === 'invite') {
      setIsInvite(true);
      setInviteValid(true); // Assumir válido
    }
  }, []);

  async function validateInviteToken(token: string, email: string) {
    try {
      const response = await fetch(`/api/auth/validate-invite?token=${token}&email=${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (result.valid) {
        setInviteValid(true);
        setInviteUser(result.user);
      } else {
        setInviteValid(false);
        setMessage(result.error || "Convite inválido ou expirado");
      }
    } catch (error) {
      setInviteValid(false);
      setMessage("Erro ao validar convite");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setMessage("Senha deve ter no mínimo 8 caracteres.");
    if (password !== confirm) return setMessage("As senhas não conferem.");
    
    setLoading(true);
    setMessage(null);
    
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return setMessage("Supabase não configurado.");
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Senha definida com sucesso! Redirecionando...");
        
        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          if (isInvite) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding/sucesso");
          }
        }, 1500);
      }
    } catch (error) {
      setMessage("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Mostrar loading enquanto valida o convite
  if (isInvite && inviteValid === null) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6 bg-light-bg dark:bg-dark-bg">
        <div className="w-full max-w-md rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 shadow-lg text-center">
          <div className="mb-6 flex justify-center">
            <Image src="/logo_full.png" alt="Comunidade Coruss" width={200} height={40} />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-light-border dark:border-dark-border border-t-brand-accent animate-spin" />
            <span className="text-light-muted dark:text-dark-muted">Validando convite...</span>
          </div>
        </div>
      </main>
    );
  }

  // Mostrar erro se convite inválido
  if (isInvite && inviteValid === false) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6 bg-light-bg dark:bg-dark-bg">
        <div className="w-full max-w-md rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 shadow-lg text-center">
          <div className="mb-6 flex justify-center">
            <Image src="/logo_full.png" alt="Comunidade Coruss" width={200} height={40} />
          </div>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">Convite Inválido</h1>
          <p className="text-light-muted dark:text-dark-muted mb-6">
            {message || "Este convite não é válido ou expirou. Entre em contato com o administrador."}
          </p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="h-11 w-full rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors font-medium"
          >
            Ir para Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6 bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-md rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Image src="/logo_full.png" alt="Comunidade Coruss" width={200} height={40} />
        </div>
        <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
          {isInvite ? "Definir sua senha" : "Redefinir senha"}
        </h1>
        <p className="text-light-muted dark:text-dark-muted mb-6">
          {isInvite 
            ? `Olá ${inviteUser?.full_name || ''}! Você foi convidado para participar da nossa comunidade. Defina uma senha segura para acessar sua conta.`
            : "Defina uma nova senha segura para sua conta."
          }
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text">Nova senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text">Confirmar senha</label>
            <input 
              type="password" 
              value={confirm} 
              onChange={(e)=>setConfirm(e.target.value)} 
              className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
              placeholder="Digite a senha novamente"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processando..." : isInvite ? "Criar conta e entrar" : "Definir senha"}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('sucesso') || message.includes('conta') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}


