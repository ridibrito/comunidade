"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export function AuthTest() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testAuth() {
      try {
        const supabase = getBrowserSupabaseClient();
        if (!supabase) {
          setError("Supabase client não disponível");
          setLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError(`Erro de auth: ${error.message}`);
        } else {
          setUser(user);
        }
      } catch (err) {
        setError(`Erro geral: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    testAuth();
  }, []);

  if (loading) {
    return <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">Testando autenticação...</div>;
  }

  return (
    <div className="p-4 border border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
        🔐 Teste de Autenticação
      </h3>
      
      {error && (
        <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-red-700 dark:text-red-400 text-sm">
          ❌ {error}
        </div>
      )}
      
      {user ? (
        <div className="text-blue-600 dark:text-blue-300">
          ✅ Usuário logado: {user.email}
        </div>
      ) : (
        <div className="text-blue-600 dark:text-blue-300">
          ❌ Nenhum usuário logado
        </div>
      )}
    </div>
  );
}
