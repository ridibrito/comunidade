'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="
          relative inline-flex items-center justify-center
          w-10 h-10 rounded-lg
          bg-light-surface hover:bg-light-border
          dark:bg-dark-surface dark:hover:bg-dark-border
          text-light-text dark:text-dark-text
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
          dark:focus:ring-offset-dark-bg
          group
        "
        aria-label="Alternar tema"
      >
        <div className="relative w-5 h-5">
          <Sun className="absolute inset-0 w-5 h-5" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        console.log('Toggle clicked, current theme:', theme);
        toggleTheme();
      }}
      className="
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-light-surface hover:bg-light-border
        dark:bg-dark-surface dark:hover:bg-dark-border
        text-light-text dark:text-dark-text
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
        dark:focus:ring-offset-dark-bg
        group
      "
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
            }
          `}
        />
        <Moon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
            }
          `}
        />
      </div>
    </button>
  );
}
