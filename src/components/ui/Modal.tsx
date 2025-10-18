import { ReactNode, useEffect } from "react";

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode; }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent){ if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-soft">
        {children}
      </div>
    </div>
  );
}


