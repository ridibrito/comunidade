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
    default: "bg-white border border-gray-200 shadow-md",
    gradient: "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100",
    outline: "bg-transparent border-2 border-gray-300",
    elevated: "bg-white border border-gray-200 shadow-lg"
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
