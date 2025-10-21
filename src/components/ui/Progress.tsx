"use client";

import React from "react";

interface ProgressProps {
  value: number; // 0..100
}

export function Progress({ value }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div
        className="h-full rounded-full bg-brand-accent transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}


