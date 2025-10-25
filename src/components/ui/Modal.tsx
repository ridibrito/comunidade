import { ReactNode, useEffect } from "react";

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode; }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent){ if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} aria-hidden />
      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative w-full max-w-lg rounded-lg border-0 bg-light-surface dark:bg-dark-surface shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}


