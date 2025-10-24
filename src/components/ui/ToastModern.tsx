"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  duration?: number;
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({ id, title, description, type = "info", duration = 5000, onClose, action }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0 && type !== "loading") {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 200);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-300" />,
    error: <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-300" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />,
    info: <Info className="w-5 h-5 text-blue-700 dark:text-blue-300" />,
    loading: <Loader2 className="w-5 h-5 text-blue-700 dark:text-blue-300 animate-spin" />,
  };

  const typeStyles = {
    success: "border-green-500 dark:border-green-400 bg-green-200 dark:bg-green-800/60",
    error: "border-red-500 dark:border-red-400 bg-red-200 dark:bg-red-800/60",
    warning: "border-yellow-500 dark:border-yellow-400 bg-yellow-200 dark:bg-yellow-800/60",
    info: "border-blue-500 dark:border-blue-400 bg-blue-200 dark:bg-blue-800/60",
    loading: "border-blue-500 dark:border-blue-400 bg-blue-200 dark:bg-blue-800/60",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border-2 p-6 pr-8 shadow-xl transition-all",
        typeStyles[type],
        isLeaving 
          ? "animate-out slide-out-to-right-full duration-200" 
          : "animate-in slide-in-from-right-full duration-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        
        <div className="flex-1 space-y-1">
        {title && (
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {description}
          </div>
        )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-4 hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-700 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 dark:text-gray-200 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
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
    <div className="fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2">
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
