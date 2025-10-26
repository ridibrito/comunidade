// components/ui/LoadingSpinner.tsx
"use client";

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-brand-accent",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Componente de skeleton para loading
export function Skeleton({ 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

// Componente de loading para páginas
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Carregando...
        </p>
      </div>
    </div>
  );
}

// Componente de loading para cards
export function CardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
