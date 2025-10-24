"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: (id: string) => void;
}

export function Toast({ id, title, description, type = "info", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const typeStyles = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:bg-blue-800",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300",
        typeStyles[type],
        isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      )}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}
