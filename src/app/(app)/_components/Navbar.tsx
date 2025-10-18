"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur shadow-sm">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center pl-1">
            <img src="/logo.png" alt="Singulari" width={200} height={28} style={{ width: 200, height: "auto" }} />
          </Link>
        </div>
        <nav className="flex items-center gap-3 pr-1">
          {/* Ícone de Calendário com Notificações */}
          <Link 
            href="/calendar" 
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-light-surface dark:hover:bg-dark-border/50 transition-colors group"
            title="Calendário de Eventos"
          >
            <Calendar className="w-5 h-5 text-light-text dark:text-dark-text" />
            {/* Badge de Notificação */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
              3
            </span>
          </Link>
          
          <ThemeToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}


