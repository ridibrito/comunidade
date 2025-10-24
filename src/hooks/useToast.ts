"use client";

import { useState, useCallback } from "react";
import { ToastProps } from "@/components/ui/ToastModern";

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: "success" });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: "error" });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: "warning" });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: "info" });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };
}
