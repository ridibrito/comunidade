"use client";

import React from "react";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
}

export function Tooltip({ label, children, side = "right" }: TooltipProps) {
  const sideClasses: Record<string, string> = {
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  };
  return (
    <div className="relative inline-flex items-center group">
      {children}
      <div
        className={`pointer-events-none absolute whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999] ${sideClasses[side]}`}
      >
        <div className="rounded-full bg-[#0A2540] text-white text-xs px-3 py-1 shadow-lg shadow-black/10">
          {label}
        </div>
      </div>
    </div>
  );
}


