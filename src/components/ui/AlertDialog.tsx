"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "success";
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
  children,
}: AlertDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const variantStyles = {
    default: {
      icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    destructive: {
      icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      confirmButton: "bg-green-600 hover:bg-green-700 text-white",
    },
  };

  const currentVariant = variantStyles[variant];

  if (!open || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
      
      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md mx-4">
        <div
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={cn("flex-shrink-0 p-2 rounded-full", currentVariant.iconBg)}>
                {currentVariant.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              </div>
              
              <button
                onClick={handleCancel}
                className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Children content */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={cn("w-full sm:w-auto", currentVariant.confirmButton)}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
