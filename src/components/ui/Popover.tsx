"use client";

import { useState, useRef, useEffect, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  trigger?: "click" | "hover";
}

export function Popover({ 
  children, 
  content, 
  side = "bottom", 
  align = "center",
  className,
  trigger = "click"
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (trigger === "click") {
      setIsOpen(prev => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsOpen(false);
    }
  };

  const getPositionClasses = () => {
    const sideClasses = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    };

    const alignClasses = {
      start: side === "top" || side === "bottom" ? "left-0" : "top-0",
      center: side === "top" || side === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
      end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
    };

    // Para mobile, ajustar posicionamento para evitar corte
    const mobileClasses = side === "top" || side === "bottom" 
      ? "sm:left-1/2 sm:-translate-x-1/2 left-4 right-4 sm:left-auto sm:right-auto" 
      : "";

    return `${sideClasses[side]} ${alignClasses[align]} ${mobileClasses}`;
  };

  // Clonar o elemento filho para injetar o handler de clique diretamente
  const triggerElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          handleTriggerClick(e);
          // Preservar o onClick original se existir
          const originalOnClick = (children as any).props?.onClick;
          if (originalOnClick) {
            originalOnClick(e);
          }
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node as HTMLDivElement;
          // Preservar o ref original se existir
          const originalRef = (children as any).ref;
          if (typeof originalRef === 'function') {
            originalRef(node);
          } else if (originalRef) {
            originalRef.current = node;
          }
        },
      })
    : (
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer inline-block"
      >
        {children}
      </div>
    );

  return (
    <div className="relative inline-block">
      {triggerElement}

      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute z-50 w-[calc(100vw-2rem)] sm:w-80 bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg",
            getPositionClasses(),
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
