"use client";

import { useEffect, useState } from "react";

export function SimpleDebug() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4 border border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">
      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
        🔍 Simple Debug - Funcionando!
      </h3>
      <div className="text-sm text-red-600 dark:text-red-300">
        Este componente está sendo renderizado corretamente.
        <br />
        Timestamp: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
