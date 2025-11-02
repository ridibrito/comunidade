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
  variant?: "default" | "success" | "warning" | "info" | "brand";
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
    info: "",
    brand: ""
  };

  const trendClasses = {
    positive: "text-green-600",
    negative: "text-red-600"
  };
  
  const variantIconColors = {
    default: "text-purple-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
    brand: "text-purple-600"
  };
  
  const variantBorders = {
    default: "border-l-4 border-l-purple-500",
    success: "border-l-4 border-l-green-500",
    warning: "border-l-4 border-l-yellow-500",
    info: "border-l-4 border-l-blue-500",
    brand: "border-l-4 border-l-purple-600"
  };
  
  const variantHeaderColors = {
    default: "text-purple-700",
    success: "text-green-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
    brand: "text-purple-800"
  };

  return (
    <ModernCard 
      className={cn("relative overflow-hidden", variantBorders[variant], className)}
      variant="default"
    >
      {icon && (
        <div className={cn("absolute top-4 right-4 opacity-20", variantIconColors[variant])}>
          {icon}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", variantHeaderColors[variant])}>
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
          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-gray-600">
              {description}
            </p>
          )}
          {trend && (
            <p className="text-xs text-gray-500">
              {trend.label}
            </p>
          )}
        </div>
      </div>
    </ModernCard>
  );
}
