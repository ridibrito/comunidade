import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "brand";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = ""
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variantClasses = {
    default: "bg-light-border/50 text-light-text dark:bg-dark-border/50 dark:text-dark-text shadow-sm",
    success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 shadow-sm",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 shadow-sm",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 shadow-sm",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm",
    brand: "bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20 dark:text-brand-accent shadow-sm",
    outline: "border border-light-border text-light-text dark:border-dark-border dark:text-dark-text shadow-sm"
  };
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}
