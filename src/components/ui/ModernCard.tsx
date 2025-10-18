import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "outline" | "elevated";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
}

export default function ModernCard({ 
  children, 
  className = "", 
  variant = "default",
  size = "md",
  hover = true
}: ModernCardProps) {
  const baseClasses = "rounded-xl transition-all duration-200 border border-light-border dark:border-dark-border";
  
  const variantClasses = {
    default: "bg-light-surface dark:bg-dark-surface shadow-g4 dark:shadow-g4-dark",
    gradient: "bg-gradient-to-br from-light-surface to-light-bg dark:from-dark-surface dark:to-dark-bg shadow-g4 dark:shadow-g4-dark",
    outline: "bg-transparent",
    elevated: "bg-light-surface dark:bg-dark-surface shadow-g4-hover dark:shadow-g4-dark-hover"
  };
  
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  const hoverClasses = hover ? "hover:shadow-g4-hover dark:hover:shadow-g4-dark-hover hover:-translate-y-0.5" : "";

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}
