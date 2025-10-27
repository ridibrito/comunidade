"use client";

import { createContext, useContext, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useSonner } from "@/hooks/useSonner";

interface ToastContextType {
  success: (title: string, description?: string, action?: { label: string; onClick: () => void }) => string | number;
  error: (title: string, description?: string, action?: { label: string; onClick: () => void }) => string | number;
  warning: (title: string, description?: string, action?: { label: string; onClick: () => void }) => string | number;
  info: (title: string, description?: string, action?: { label: string; onClick: () => void }) => string | number;
  loading: (title: string, description?: string) => string | number;
  dismiss: (toastId?: string | number) => void;
  dismissAll: () => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => any;
  // Toasts específicos da aplicação
  lessonCompleted: (lessonTitle: string) => string | number;
  moduleCompleted: (moduleTitle: string) => string | number;
  trailCompleted: (trailTitle: string) => string | number;
  videoError: (error?: string) => string | number;
  contentBlocked: (reason?: string) => string | number;
  newUpdate: (details?: string) => string | number;
  saveProgress: () => string | number;
  ratingSaved: (rating: number) => string | number;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const sonner = useSonner();

  return (
    <ToastContext.Provider value={sonner}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
