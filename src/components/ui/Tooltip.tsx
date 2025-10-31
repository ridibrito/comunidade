"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
}

export function Tooltip({ label, children, side = "right" }: TooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 });
  const [shouldRender, setShouldRender] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  // Estimativa de tamanho do tooltip baseado no conteúdo
  const estimateTooltipSize = useCallback(() => {
    const avgCharWidth = 6; // largura média de um caractere
    const lineHeight = 18; // altura da linha
    const padding = 32; // px-4 py-3
    const maxWidth = 320; // max-w-xs
    
    const textLength = label.length;
    const lines = Math.ceil((textLength * avgCharWidth) / maxWidth) || 1;
    const height = (lines * lineHeight) + padding;
    const width = Math.min(textLength * avgCharWidth + padding, maxWidth);
    
    return { width, height };
  }, [label]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    let top = 0;
    let left = 0;

    // Se o tooltip já foi renderizado, usar seu tamanho real
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      switch (side) {
        case "top":
          top = triggerRect.top + scrollY - tooltipRect.height - 8;
          left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case "bottom":
          top = triggerRect.bottom + scrollY + 8;
          left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case "left":
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left + scrollX - tooltipRect.width - 8;
          break;
        case "right":
        default:
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + scrollX + 8;
          break;
      }

      // Ajustar para não sair da tela com tamanho real
      const margin = 8;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }
      if (top < scrollY + margin) top = scrollY + margin;
      if (top + tooltipRect.height > window.innerHeight + scrollY - margin) {
        top = window.innerHeight + scrollY - tooltipRect.height - margin;
      }
    } else {
      // Usar estimativa antes da primeira renderização
      const estimatedSize = estimateTooltipSize();

      switch (side) {
        case "top":
          top = triggerRect.top + scrollY - estimatedSize.height - 8;
          left = triggerRect.left + scrollX + (triggerRect.width / 2) - (estimatedSize.width / 2);
          break;
        case "bottom":
          top = triggerRect.bottom + scrollY + 8;
          left = triggerRect.left + scrollX + (triggerRect.width / 2) - (estimatedSize.width / 2);
          break;
        case "left":
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (estimatedSize.height / 2);
          left = triggerRect.left + scrollX - estimatedSize.width - 8;
          break;
        case "right":
        default:
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (estimatedSize.height / 2);
          left = triggerRect.right + scrollX + 8;
          break;
      }

      // Ajustar para não sair da tela com estimativa
      const margin = 8;
      if (left < margin) left = margin;
      if (left + estimatedSize.width > window.innerWidth - margin) {
        left = window.innerWidth - estimatedSize.width - margin;
      }
      if (top < scrollY + margin) top = scrollY + margin;
      if (top + estimatedSize.height > window.innerHeight + scrollY - margin) {
        top = window.innerHeight + scrollY - estimatedSize.height - margin;
      }
    }

    setPosition(prev => ({ ...prev, top, left }));
  }, [side, estimateTooltipSize]);

  const handleMouseEnter = useCallback(() => {
    // Limpar qualquer timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Renderizar o tooltip primeiro (invisível)
    setShouldRender(true);
    setPosition(prev => ({ ...prev, opacity: 0 }));
    
    // Calcular posição após renderização
    rafRef.current = requestAnimationFrame(() => {
      if (triggerRef.current) {
        updatePosition();
        // Mostrar após calcular posição
        rafRef.current = requestAnimationFrame(() => {
          setPosition(prev => ({ ...prev, opacity: 1 }));
        });
      }
    });
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    // Limpar timeouts e rafs
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Fade out antes de desmontar
    setPosition(prev => ({ ...prev, opacity: 0 }));
    
    timeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      setPosition({ top: 0, left: 0, opacity: 0 });
    }, 150); // Duração da transição
  }, []);

  useEffect(() => {
    if (shouldRender && tooltipRef.current) {
      // Atualizar posição quando necessário (scroll/resize)
      const handleScroll = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updatePosition);
      };

      const handleResize = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updatePosition);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize, { passive: true });

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [shouldRender, updatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipContent = shouldRender && mounted ? (
    createPortal(
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed transition-opacity duration-150"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          opacity: position.opacity,
          zIndex: 2147483647, // Máximo valor possível de z-index (2^31 - 1)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`max-w-xs md:max-w-sm lg:max-w-md rounded-lg bg-[#0A2540] text-white text-xs px-4 py-3 shadow-xl shadow-black/20 leading-relaxed break-words ${
          side === 'top' || side === 'bottom' ? 'text-center' : ''
        }`}>
          {label}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {tooltipContent}
    </>
  );
}


