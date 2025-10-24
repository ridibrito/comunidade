"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Verificar se as variáveis de ambiente estão configuradas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setMessage("Configuração do Supabase não encontrada. Entre em contato com o administrador.");
        setMessageType("error");
        return;
      }

      const supabase = createClient();
      setLoading(true);
      setMessage(null);
      setMessageType("error");
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      
      if (error) {
        // Log do erro para debug
        console.error("Erro de login:", error);
        
        // Traduzir mensagens de erro para português
        let errorMessage = error.message;
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Usuário não encontrado. Verifique seu email.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email inválido. Verifique o formato do email.";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Senha muito curta. Use pelo menos 6 caracteres.";
        } else if (error.message.includes("Invalid credentials")) {
          errorMessage = "Credenciais inválidas. Verifique email e senha.";
        } else if (error.message.includes("Email rate limit exceeded")) {
          errorMessage = "Muitas tentativas de login. Aguarde alguns minutos.";
        } else if (error.message.includes("Signup is disabled")) {
          errorMessage = "Cadastro desabilitado. Entre em contato com o administrador.";
        } else if (error.status === 500) {
          errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos.";
        } else if (error.status === 400) {
          errorMessage = "Dados inválidos. Verifique email e senha.";
        } else if (error.status === 429) {
          errorMessage = "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
        } else {
          errorMessage = `Erro de autenticação: ${error.message}`;
        }
        
        setMessage(errorMessage);
        setMessageType("error");
      } else {
        setMessage("Login realizado com sucesso! Redirecionando...");
        setMessageType("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      setMessage("Erro de conexão com o servidor. Verifique sua internet e tente novamente.");
    }
  }

  return (
    <main className="min-h-screen flex bg-dark-bg">
      {/* Coluna esquerda: formulário */}
      <section className="w-full md:w-[30%] max-w-[400px] border-r border-dark-border bg-dark-surface p-6 flex flex-col justify-center relative">
        
        <div className="mb-6 flex justify-center">
          <Image 
            src="/logo_full.png" 
            alt="Aldeia Singular" 
            width={240} 
            height={48}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <h1 className="text-2xl font-semibold text-dark-text">Entrar</h1>
        <p className="text-dark-muted mt-1 text-sm">Acesse com e‑mail e senha. No primeiro acesso, use o link de definição de senha.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm text-dark-text">E‑mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl bg-transparent border border-dark-border px-3 text-dark-text placeholder-dark-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label className="text-sm text-dark-text">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl bg-transparent border border-dark-border px-3 pr-10 text-dark-text placeholder-dark-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                placeholder="Sua senha"
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
          <button disabled={loading} className="h-11 w-full rounded-lg bg-brand-accent text-white hover:brightness-110 disabled:opacity-50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {message && (
          <div className={`mt-3 p-3 rounded-lg border ${
            messageType === "error" 
              ? "bg-red-900/20 border-red-800" 
              : "bg-green-900/20 border-green-800"
          }`}>
            <div className={`text-sm font-medium ${
              messageType === "error" 
                ? "text-red-400" 
                : "text-green-400"
            }`}>
              {message}
            </div>
          </div>
        )}
        <div className="mt-4 text-xs text-dark-muted">
          Esqueceu a senha? <a href="/auth/recover" className="text-brand-accent hover:underline cursor-pointer">Recuperar acesso</a>
        </div>
        <div className="mt-8 text-center text-dark-muted text-xs">© {new Date().getFullYear()} Aldeia Singular</div>
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


