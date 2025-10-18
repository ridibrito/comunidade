"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; title?: string; message: string; variant?: "success" | "error" | "info" };

const ToastCtx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed z-[60] bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`min-w-[260px] max-w-[360px] rounded-xl border p-3 shadow-soft bg-[var(--surface)] border-[var(--border)]`}> 
            {t.title && <div className="text-sm font-medium mb-0.5">{t.title}</div>}
            <div className="text-sm opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}


