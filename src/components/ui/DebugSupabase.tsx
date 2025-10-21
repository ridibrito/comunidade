"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

export default function DebugSupabase() {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setError(null);

    try {
      // Verificar variáveis de ambiente
      const env = {
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NÃO DEFINIDA',
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
        SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
      };
      setEnvVars(env);

      // Testar conexão
      const supabase = getBrowserSupabaseClient();
      
      // Testar query simples
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      setConnectionStatus('connected');

      // Listar tabelas disponíveis
      const { data: tablesData } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesData) {
        setTables(tablesData.map(t => t.table_name));
      }

    } catch (err) {
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Badge variant="outline" size="sm">Verificando...</Badge>;
      case 'connected':
        return <Badge variant="success" size="sm">Conectado</Badge>;
      case 'error':
        return <Badge variant="error" size="sm">Erro</Badge>;
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        Debug DB
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
              Debug Supabase
            </h2>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <Button variant="outline" size="sm" onClick={checkConnection}>
                Testar Conexão
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Variáveis de Ambiente */}
            <div>
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-3">
                Variáveis de Ambiente
              </h3>
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">SUPABASE_URL:</span>
                    <span className={`font-mono ${envVars.SUPABASE_URL === 'NÃO DEFINIDA' ? 'text-red-500' : 'text-green-500'}`}>
                      {envVars.SUPABASE_URL}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">SUPABASE_ANON_KEY:</span>
                    <span className={`font-mono ${envVars.SUPABASE_ANON_KEY === 'NÃO DEFINIDA' ? 'text-red-500' : 'text-green-500'}`}>
                      {envVars.SUPABASE_ANON_KEY}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">SERVICE_ROLE_KEY:</span>
                    <span className={`font-mono ${envVars.SERVICE_ROLE_KEY === 'NÃO DEFINIDA' ? 'text-red-500' : 'text-green-500'}`}>
                      {envVars.SERVICE_ROLE_KEY}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status da Conexão */}
            <div>
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-3">
                Status da Conexão
              </h3>
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
                {connectionStatus === 'connected' && (
                  <div className="text-green-600 dark:text-green-400">
                    ✅ Conexão com Supabase estabelecida com sucesso!
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="text-red-600 dark:text-red-400">
                    ❌ Erro na conexão: {error}
                  </div>
                )}
                {connectionStatus === 'checking' && (
                  <div className="text-blue-600 dark:text-blue-400">
                    🔄 Verificando conexão...
                  </div>
                )}
              </div>
            </div>

            {/* Tabelas Disponíveis */}
            {tables.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-3">
                  Tabelas Disponíveis ({tables.length})
                </h3>
                <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {tables.map((table) => (
                      <div key={table} className="flex items-center gap-2">
                        <Badge 
                          variant={table === 'profiles' ? 'success' : 'outline'} 
                          size="sm"
                        >
                          {table}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
