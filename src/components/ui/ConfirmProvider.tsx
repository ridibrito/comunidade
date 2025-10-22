"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ConfirmState = { open: boolean; title?: string; message?: string; confirmText?: string; cancelText?: string; resolve?: (v: boolean) => void };

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

  return (
    <ConfirmCtx.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => close(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-5 shadow-xl">
            {state.title && <div className="text-lg font-semibold mb-1 text-light-text dark:text-dark-text">{state.title}</div>}
            {state.message && <div className="text-sm opacity-90 mb-4 text-light-muted dark:text-dark-muted">{state.message}</div>}
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => close(false)} className="h-10 px-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text transition-colors">
                {state.cancelText ?? "Cancelar"}
              </button>
              <button onClick={() => close(true)} className="h-10 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                {state.confirmText ?? "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}


