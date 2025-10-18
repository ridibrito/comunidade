import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ModernCard from "./ModernCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "info";
}

export default function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  className = "",
  variant = "default"
}: MetricCardProps) {
  const variantClasses = {
    default: "",
    success: "",
    warning: "", 
    info: ""
  };

  const trendClasses = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400"
  };

  return (
    <ModernCard 
      className={cn("relative overflow-hidden", variantClasses[variant], className)}
      variant="default"
    >
      {icon && (
        <div className="absolute top-4 right-4 opacity-10">
          {icon}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-light-muted dark:text-dark-muted">
            {title}
          </p>
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center gap-1",
              trend.positive ? trendClasses.positive : trendClasses.negative
            )}>
              {trend.positive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-light-muted dark:text-dark-muted">
              {description}
            </p>
          )}
          {trend && (
            <p className="text-xs text-light-muted dark:text-dark-muted">
              {trend.label}
            </p>
          )}
        </div>
      </div>
    </ModernCard>
  );
}
