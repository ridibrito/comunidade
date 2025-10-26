"use client";

import React, { useState } from "react";
import { MarcosConquistados, ProgressoMarcos } from "./MarcosConquistados";
import { MarcoConquistado, useMarcoConquistado, MarcoToast } from "./animations/MarcoConquistado";
import { useMarcos } from "@/hooks/useMarcos";
import { cn } from "@/lib/utils";

interface TrilhaComMarcosProps {
  trailId: string;
  trailTitle: string;
  className?: string;
  showProgress?: boolean;
  showAnimation?: boolean;
}

export function TrilhaComMarcos({ 
  trailId, 
  trailTitle, 
  className,
  showProgress = true,
  showAnimation = true
}: TrilhaComMarcosProps) {
  const { marcos, conquistados, total, loading, error } = useMarcos(trailId);
  const { showAnimation: showConquestAnimation, animationTitle, triggerConquest, handleComplete } = useMarcoConquistado();
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("");

  // Simular conquista de um marco (para demonstração)
  const simularConquista = () => {
    const proximoMarco = marcos.find(m => !m.conquered);
    if (proximoMarco) {
      setToastTitle(proximoMarco.title);
      setShowToast(true);
      
      if (showAnimation) {
        triggerConquest(proximoMarco.title);
      }
    }
  };

  if (loading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="flex gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 text-red-500", className)}>
        Erro ao carregar marcos: {error}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Cabeçalho da Trilha */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {trailTitle}
        </h3>
        
        {/* Progresso dos Marcos */}
        {showProgress && (
          <ProgressoMarcos 
            conquistados={conquistados} 
            total={total}
            className="mb-3"
          />
        )}
      </div>

      {/* Marcos Conquistados */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Marcos Conquistados
        </h4>
        <MarcosConquistados 
          marcos={marcos}
          size="md"
          showLabels={true}
          className="justify-start"
        />
      </div>

      {/* Botão de demonstração (remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={simularConquista}
          className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors text-sm"
        >
          Simular Conquista de Marco
        </button>
      )}

      {/* Animações */}
      <MarcoConquistado 
        isVisible={showConquestAnimation}
        title={animationTitle}
        onComplete={handleComplete}
      />

      <MarcoToast 
        title={toastTitle}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default TrilhaComMarcos;
