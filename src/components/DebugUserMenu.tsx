"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export function DebugUserMenu() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function debugUser() {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) {
        setError("Supabase client não disponível");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Debugando UserMenu...");
        
        // Verificar autenticação
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log("👤 Usuário autenticado:", authUser);
        console.log("❌ Erro de auth:", authError);
        
        if (authError) {
          setError(`Erro de auth: ${authError.message}`);
          setLoading(false);
          return;
        }

        setUser(authUser);

        if (authUser) {
          // Buscar perfil
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .maybeSingle();
            
          console.log("📋 Perfil encontrado:", profileData);
          console.log("❌ Erro de perfil:", profileError);
          
          if (profileError) {
            setError(`Erro de perfil: ${profileError.message}`);
          } else {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error("💥 Erro geral:", err);
        setError(`Erro geral: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    debugUser();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface">
        <div className="text-sm text-light-muted dark:text-dark-muted">Carregando debug...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        🔍 Debug UserMenu
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <div className="text-sm text-red-700 dark:text-red-400">
            <strong>Erro:</strong> {error}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <strong className="text-light-text dark:text-dark-text">Usuário Autenticado:</strong>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">
            {user ? JSON.stringify(user, null, 2) : "Nenhum usuário logado"}
          </pre>
        </div>

        <div>
          <strong className="text-light-text dark:text-dark-text">Perfil:</strong>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">
            {profile ? JSON.stringify(profile, null, 2) : "Nenhum perfil encontrado"}
          </pre>
        </div>

        <div>
          <strong className="text-light-text dark:text-dark-text">Status:</strong>
          <div className="text-sm text-light-muted dark:text-dark-muted">
            {user ? "✅ Usuário logado" : "❌ Usuário não logado"}
            {profile ? " | ✅ Perfil carregado" : " | ❌ Perfil não carregado"}
          </div>
        </div>
      </div>
    </div>
  );
}
