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
    default: "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm",
    success: "bg-green-700 text-white dark:bg-green-600 dark:text-white shadow-sm",
    warning: "bg-yellow-700 text-white dark:bg-yellow-600 dark:text-white shadow-sm",
    error: "bg-red-700 text-white dark:bg-red-600 dark:text-white shadow-sm",
    info: "bg-blue-700 text-white dark:bg-blue-600 dark:text-white shadow-sm",
    brand: "bg-purple-700 text-white dark:bg-brand-accent dark:text-white shadow-sm",
    outline: "border border-gray-400 text-gray-900 dark:border-gray-600 dark:text-gray-100 shadow-sm"
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
