import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ModernCard from "./ModernCard";

interface ProgressCardProps {
  title: string;
  progress: number;
  total?: number;
  description?: string;
  icon?: ReactNode;
  color?: "default" | "success" | "warning" | "info" | "brand";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressCard({
  title,
  progress,
  total,
  description,
  icon,
  color = "brand",
  size = "md",
  showPercentage = true,
  className = ""
}: ProgressCardProps) {
  const percentage = total ? Math.round((progress / total) * 100) : progress;
  
  const colorClasses = {
    default: "bg-gray-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    brand: "bg-brand-accent"
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <ModernCard className={cn("space-y-3", className)} variant="default">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-light-muted dark:text-dark-muted">
              {icon}
            </div>
          )}
          <h4 className="font-medium text-light-text dark:text-dark-text">
            {title}
          </h4>
        </div>
        {showPercentage && (
          <span className="text-sm font-semibold text-light-text dark:text-dark-text">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className={cn(
          "w-full rounded-full bg-light-border/20 dark:bg-dark-border/20",
          sizeClasses[size]
        )}>
          <div
            className={cn(
              "rounded-full transition-all duration-500 ease-out",
              sizeClasses[size],
              colorClasses[color]
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {total && (
          <div className="flex justify-between text-xs text-light-muted dark:text-dark-muted">
            <span>{progress} de {total}</span>
            <span>{percentage}% concluído</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-light-muted dark:text-dark-muted">
            {description}
          </p>
        )}
      </div>
    </ModernCard>
  );
}
