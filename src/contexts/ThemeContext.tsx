'use client';

import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Remove o dark class do documento
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    // Remove do localStorage também
    localStorage.removeItem('theme');
  }, []);

  const theme: Theme = 'light';

  const toggleTheme = () => {
    // Não faz nada, sempre light
  };

  const setTheme = () => {
    // Não faz nada, sempre light
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Retorna um fallback sempre com light
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }
  return context;
}
