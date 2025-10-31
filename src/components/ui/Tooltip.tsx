"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
}

export function Tooltip({ label, children, side = "right" }: TooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

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

    // Ajustar para não sair da tela
    const margin = 8;
    if (left < margin) left = margin;
    if (left + tooltipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tooltipRect.width - margin;
    }
    if (top < margin) top = margin;
    if (top + tooltipRect.height > window.innerHeight + scrollY - margin) {
      top = window.innerHeight + scrollY - tooltipRect.height - margin;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Aguardar o próximo frame para garantir que o tooltip foi renderizado
      requestAnimationFrame(() => {
        updatePosition();
      });
      
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible, side]);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex items-center group"
        onMouseEnter={() => {
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-[999999] transition-opacity duration-150"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className={`max-w-xs md:max-w-sm lg:max-w-md rounded-lg bg-[#0A2540] text-white text-xs px-4 py-3 shadow-xl shadow-black/20 leading-relaxed break-words ${
            side === 'top' || side === 'bottom' ? 'text-center' : ''
          }`}>
            {label}
          </div>
        </div>
      )}
    </>
  );
}


