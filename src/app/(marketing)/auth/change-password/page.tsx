"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      // Verificar se há token na URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Se há token, verificar e criar sessão
        console.log('Token found in URL:', token);
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });
        
        if (error) {
          console.error('Token verification error:', error);
          setError('Token inválido ou expirado');
          return;
        }
        
        if (data.user) {
          console.log('User verified:', data.user.email);
          setUser(data.user);
        }
      } else {
        // Verificar se usuário está logado
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setUser(user);
      }
    };
    getUser();
  }, [supabase.auth, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Atualizar senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Remover flag de senha temporária
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { temp_password: false }
      });

      if (metadataError) {
        console.error("Erro ao atualizar metadata:", metadataError);
      }

      // Atualizar perfil
      if (user) {
        await supabase
          .from('profiles')
          .update({
            last_login_at: new Date().toISOString(),
            login_count: 1
          })
          .eq('id', user.id);
      }

      setSuccess(true);

      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      setError("Erro ao alterar senha. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Senha Alterada com Sucesso!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o dashboard em instantes.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Alterar Senha
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Você precisa alterar sua senha temporária para continuar
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Digite sua nova senha"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Confirme sua nova senha"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Alterando...
              </div>
            ) : (
              "Alterar Senha"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta é uma medida de segurança para proteger sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}
