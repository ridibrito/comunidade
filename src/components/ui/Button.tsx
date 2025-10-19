import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Button({ 
  children, 
  variant = "default",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-brand-accent text-white hover:bg-brand-accent/90",
    outline: "border border-border bg-transparent hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text",
    ghost: "hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  };
  
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button 
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}