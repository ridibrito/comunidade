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
  const baseClasses = "rounded-xl transition-all duration-200";
  
  const variantClasses = {
    default: "bg-light-surface dark:bg-dark-surface shadow-lg dark:shadow-xl",
    gradient: "bg-light-surface dark:bg-dark-surface shadow-lg dark:shadow-xl",
    outline: "bg-transparent",
    elevated: "bg-light-surface dark:bg-dark-surface shadow-xl dark:shadow-2xl"
  };
  
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  const hoverClasses = ""; // Removido efeito hover cansativo

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
