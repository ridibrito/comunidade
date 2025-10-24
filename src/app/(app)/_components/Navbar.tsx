"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Calendar } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationSystem";
import { cn } from "@/lib/utils";
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-light-surface dark:bg-dark-bg/95 backdrop-blur shadow-sm">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center pl-1 cursor-pointer">
            <img src="/logo.png" alt="Singulari" width={200} height={28} style={{ width: 200, height: "auto" }} />
          </Link>
        </div>
        <nav className="flex items-center gap-3 pr-1">
          {/* Ícone de Calendário */}
          <Link 
            href="/calendar" 
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer hover-brand-subtle text-light-muted dark:text-dark-muted"
            title="Calendário de Eventos"
          >
            <Calendar size={18} />
          </Link>
          
          {/* Sistema de Notificações */}
          <NotificationBell />
          
          <ThemeToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}


