"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked = false, onCheckedChange, disabled = false, className }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked 
          ? "bg-blue-600" 
          : "bg-gray-200 dark:bg-gray-700",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          isChecked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
