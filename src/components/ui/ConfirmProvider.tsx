"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

type ConfirmState = { 
  open: boolean; 
  title?: string; 
  message?: string; 
  confirmText?: string; 
  cancelText?: string; 
  resolve?: (v: boolean) => void;
  variant?: "destructive" | "warning" | "success" | "default";
};

const ConfirmCtx = createContext<{ confirm: (opts: Omit<ConfirmState, "open" | "resolve">) => Promise<boolean> } | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({ open: false });

  const confirm = useCallback((opts: Omit<ConfirmState, "open" | "resolve">) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, ...opts, resolve });
    });
  }, []);

  function close(v: boolean) {
    state.resolve?.(v);
    setState({ open: false });
  }

  const getVariantStyles = (variant: string = "default") => {
    const variants = {
      destructive: {
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        iconBg: "bg-red-50",
        confirmButton: "bg-red-600 hover:bg-red-700 text-white"
      },
      warning: {
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        iconBg: "bg-yellow-50",
        confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white"
      },
      success: {
        icon: <AlertTriangle className="w-6 h-6 text-green-600" />,
        iconBg: "bg-green-50",
        confirmButton: "bg-green-600 hover:bg-green-700 text-white"
      },
      default: {
        icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
        iconBg: "bg-blue-50",
        confirmButton: "bg-blue-600 hover:bg-blue-700 text-white"
      }
    };
    return variants[variant as keyof typeof variants] || variants.default;
  };

  const styles = getVariantStyles(state.variant);

  return (
    <ConfirmCtx.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => close(false)} />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-start gap-4 p-6">
              <div className={`flex-shrink-0 p-2 rounded-full ${styles.iconBg}`}>
                {styles.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {state.title || "Confirmar Ação"}
                </h3>
                {state.message && (
                  <p className="mt-2 text-sm text-gray-600">
                    {state.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => close(false)}
                className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 px-6 pb-6 sm:flex-row sm:justify-end">
              <button
                onClick={() => close(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-colors"
              >
                {state.cancelText || "Cancelar"}
              </button>
              <button
                onClick={() => close(true)}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${styles.confirmButton}`}
              >
                {state.confirmText || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}