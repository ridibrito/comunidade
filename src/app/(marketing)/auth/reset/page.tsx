"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        setEmail(user.email || "");
      } else {
        setError("Você precisa estar logado para redefinir sua senha. Verifique o link do email.");
      }
      setCheckingAuth(false);
    };
    
    checkAuth();
  }, [supabase.auth]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Atualizar senha usando o método correto do Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Atualizar status do convite no perfil
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            invite_status: 'accepted',
            last_login_at: new Date().toISOString(),
            login_count: 1
          })
          .eq('id', user.id);

        // Confirma via endpoint server-side (service role) para garantir consistência
        try {
          await fetch('/api/profile', { method: 'POST' });
        } catch {}
      }

      setSuccess(true);
      
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-4">
        <div className="bg-dark-surface shadow-lg rounded-lg p-8 max-w-md text-center">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-dark-text">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-4">
        <div className="bg-dark-surface shadow-lg rounded-lg p-8 max-w-md text-center">
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
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dark-text mb-4">
            Acesso Negado
          </h1>
          <p className="text-dark-muted mb-6">
            {error || "Você precisa estar logado para redefinir sua senha. Verifique o link do email."}
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-accent hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-4">
        <div className="bg-dark-surface shadow-lg rounded-lg p-8 max-w-md text-center">
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
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900">
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dark-text mb-4">
            Senha Redefinida com Sucesso!
          </h1>
          <p className="text-dark-muted mb-6">
            Sua senha foi redefinida com sucesso. Você será redirecionado para o dashboard em instantes.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-4">
      <div className="bg-dark-surface shadow-lg rounded-lg p-8 max-w-md w-full">
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark-text mb-2">
            Definir Nova Senha
          </h1>
          <p className="text-dark-muted">
            {email ? `Para ${email}` : "Digite sua nova senha"}
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-dark-border rounded-xl bg-transparent text-dark-text placeholder-dark-muted focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Digite sua nova senha"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-dark-border rounded-xl bg-transparent text-dark-text placeholder-dark-muted focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Confirme sua nova senha"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-brand-accent hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Redefinindo...
              </div>
            ) : (
              "Redefinir Senha"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-dark-muted">
            Lembrou da senha?{" "}
            <a href="/auth/login" className="font-medium text-brand-accent hover:underline">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}