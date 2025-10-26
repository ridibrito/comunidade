"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

interface Marco {
  id: string;
  title: string;
  conquered: boolean;
  conqueredAt?: string;
  position: number;
  moduleId?: string;
  trailId?: string;
}

interface UseMarcosReturn {
  marcos: Marco[];
  loading: boolean;
  error: string | null;
  conquistados: number;
  total: number;
  conquistarMarco: (moduleId: string) => Promise<void>;
  refreshMarcos: () => Promise<void>;
}

export function useMarcos(trailId?: string): UseMarcosReturn {
  const [marcos, setMarcos] = useState<Marco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMarcos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMarcos([]);
        return;
      }

      if (!trailId) {
        setMarcos([]);
        return;
      }

      // Verificar se trailId é um UUID válido (não é um ID mock)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(trailId)) {
        console.log(`[useMarcos] trailId não é um UUID válido: ${trailId}, usando dados mock`);
        // Dados mock para demonstração
        const mockMarcos: Marco[] = [
          {
            id: 'mock-1',
            title: 'Primeiro Módulo',
            conquered: false,
            position: 1,
            moduleId: 'mock-1',
            trailId: trailId
          },
          {
            id: 'mock-2',
            title: 'Segundo Módulo',
            conquered: false,
            position: 2,
            moduleId: 'mock-2',
            trailId: trailId
          }
        ];
        setMarcos(mockMarcos);
        return;
      }

      // Usar a função do banco para buscar marcos da trilha
      const { data: marcosData, error } = await supabase
        .rpc('get_marcos_trilha', {
          p_user_id: user.id,
          p_trail_id: trailId
        });

      if (error) {
        throw error;
      }

      // Mapear dados para o formato esperado
      const marcos: Marco[] = (marcosData || []).map((marco: any) => ({
        id: marco.module_id,
        title: marco.module_title,
        conquered: marco.conquered,
        conqueredAt: marco.conquered_at,
        position: marco.module_position,
        moduleId: marco.module_id,
        trailId: trailId
      }));

      console.log(`[useMarcos] trailId: ${trailId}, marcos carregados:`, marcos.length, marcos);
      setMarcos(marcos);
    } catch (err) {
      console.error('Erro ao carregar marcos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [trailId]);

  const conquistarMarco = useCallback(async (moduleId: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Atualizar progresso do módulo para 100%
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_id: moduleId,
          completion_percentage: 100,
          is_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Recarregar marcos
      await loadMarcos();
    } catch (err) {
      console.error('Erro ao conquistar marco:', err);
      setError(err instanceof Error ? err.message : 'Erro ao conquistar marco');
    }
  }, [loadMarcos]);

  const refreshMarcos = useCallback(async () => {
    await loadMarcos();
  }, [loadMarcos]);

  useEffect(() => {
    loadMarcos();
  }, [loadMarcos]);

  const conquistados = marcos.filter(m => m.conquered).length;
  const total = marcos.length;

  return {
    marcos,
    loading,
    error,
    conquistados,
    total,
    conquistarMarco,
    refreshMarcos
  };
}
