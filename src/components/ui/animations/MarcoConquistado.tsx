"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MarcoConquistadoProps {
  isVisible: boolean;
  onComplete?: () => void;
  title?: string;
  className?: string;
}

export function MarcoConquistado({ 
  isVisible, 
  onComplete, 
  title = "Marco Conquistado!",
  className 
}: MarcoConquistadoProps) {
  const [show, setShow] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      // Mostrar texto após a animação da bandeira
      setTimeout(() => {
        setShowText(true);
      }, 500);

      // Completar animação após 3 segundos
      setTimeout(() => {
        setShow(false);
        setShowText(false);
        onComplete?.();
      }, 3000);
    }
  }, [isVisible, onComplete]);

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
      className
    )}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Animação da Bandeira */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Bandeira animada */}
        <div className="relative mb-4">
          <div className="w-16 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm border-2 border-yellow-500 shadow-2xl animate-bounce">
            {/* Mastro */}
            <div className="absolute left-0 top-0 w-1 h-full bg-yellow-800" />
            
            {/* Ponta da bandeira */}
            <div 
              className="absolute -right-1 top-0 w-0 h-0"
              style={{
                borderLeft: "0",
                borderRight: "8px solid #D97706",
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent"
              }}
            />
            
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-yellow-300/30 rounded-sm animate-pulse" />
          </div>
          
          {/* Partículas douradas */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Texto de conquista */}
        {showText && (
          <div className="text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {title}
            </h3>
            <p className="text-yellow-200 text-sm drop-shadow-md">
              Você fincou sua bandeira neste marco!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para gerenciar animações de conquista
export function useMarcoConquistado() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationTitle, setAnimationTitle] = useState("");

  const triggerConquest = (title: string = "Marco Conquistado!") => {
    setAnimationTitle(title);
    setShowAnimation(true);
  };

  const handleComplete = () => {
    setShowAnimation(false);
    setAnimationTitle("");
  };

  return {
    showAnimation,
    animationTitle,
    triggerConquest,
    handleComplete
  };
}

// Componente para notificação toast de conquista
interface MarcoToastProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

export function MarcoToast({ title, isVisible, onClose }: MarcoToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg border border-yellow-500">
        <div className="flex items-center gap-3">
          {/* Ícone da bandeira */}
          <div className="w-6 h-4 bg-white rounded-sm relative">
            <div className="absolute left-0 top-0 w-0.5 h-full bg-yellow-800" />
            <div 
              className="absolute -right-0.5 top-0 w-0 h-0"
              style={{
                borderLeft: "0",
                borderRight: "4px solid #D97706",
                borderTop: "2px solid transparent",
                borderBottom: "2px solid transparent"
              }}
            />
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Marco Conquistado!</h4>
            <p className="text-xs text-yellow-100">{title}</p>
          </div>
          
          <button
            onClick={onClose}
            className="ml-2 text-white/80 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
