"use client";

import React from "react";

interface ProgressProps {
  value: number; // 0..100
}

export function Progress({ value }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-1.5 rounded-full bg-[#1f2537] overflow-hidden">
      <div
        className="h-full rounded-full bg-[var(--accent-purple)] transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}


