"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Marco {
  id: string;
  title: string;
  conquered: boolean;
  conqueredAt?: string;
  position: number;
}

interface MarcosConquistadosProps {
  marcos: Marco[];
  totalMarcos?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

export function MarcosConquistados({
  marcos,
  totalMarcos,
  className = "",
  size = "md",
  showLabels = false
}: MarcosConquistadosProps) {
  const sizeClasses = {
    sm: "w-3 h-2",
    md: "w-4 h-3", 
    lg: "w-6 h-4"
  };

  const gapClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2"
  };

  // Se não temos marcos específicos, criar placeholders baseado no total
  const displayMarcos = marcos.length > 0 ? marcos : 
    Array.from({ length: totalMarcos || 5 }, (_, i) => ({
      id: `placeholder-${i}`,
      title: `Marco ${i + 1}`,
      conquered: false,
      position: i + 1
    }));

  return (
    <div className={cn("flex items-center", gapClasses[size], className)}>
      {displayMarcos.map((marco, index) => (
        <div
          key={marco.id}
          className={cn(
            "relative group",
            sizeClasses[size]
          )}
          title={showLabels ? marco.title : undefined}
        >
          {/* Bandeira */}
          <div
            className={cn(
              "w-full h-full rounded-sm border transition-all duration-300",
              "transform hover:scale-110",
              marco.conquered
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500 shadow-md shadow-yellow-500/30"
                : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            )}
          >
            {/* Mastro da bandeira */}
            <div
              className={cn(
                "absolute left-0 top-0 w-0.5 h-full",
                marco.conquered
                  ? "bg-yellow-800"
                  : "bg-gray-400 dark:bg-gray-500"
              )}
            />
            
            {/* Ponta da bandeira */}
            <div
              className={cn(
                "absolute -right-0.5 top-0 w-0 h-0 border-l-0 border-r-2 border-t-1 border-b-1",
                marco.conquered
                  ? "border-yellow-600"
                  : "border-gray-400 dark:border-gray-500"
              )}
              style={{
                borderLeft: "0",
                borderRight: marco.conquered ? "4px solid #D97706" : "4px solid #9CA3AF",
                borderTop: "2px solid transparent",
                borderBottom: "2px solid transparent"
              }}
            />
          </div>

          {/* Efeito de conquista */}
          {marco.conquered && (
            <div className="absolute inset-0 rounded-sm bg-yellow-400/20 animate-pulse" />
          )}

          {/* Tooltip com informações */}
          {showLabels && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {marco.title}
              {marco.conqueredAt && (
                <div className="text-yellow-300">
                  Conquistado em {new Date(marco.conqueredAt).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Componente para exibir progresso dos marcos
interface ProgressoMarcosProps {
  conquistados: number;
  total: number;
  className?: string;
}

export function ProgressoMarcos({ conquistados, total, className = "" }: ProgressoMarcosProps) {
  const porcentagem = total > 0 ? Math.round((conquistados / total) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {conquistados}/{total}
      </span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {porcentagem}%
      </span>
    </div>
  );
}

export default MarcosConquistados;
