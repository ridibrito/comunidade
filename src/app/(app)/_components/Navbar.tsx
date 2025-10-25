"use client";

import { useState } from "react";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Calendar, Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationSystem";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-light-surface dark:bg-dark-bg/95 backdrop-blur shadow-sm">
        <div className="px-3 sm:px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            >
              <Menu size={20} className="text-light-muted dark:text-dark-muted" />
            </button>
            
            <Link href="/" className="flex items-center pl-1 cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Singulari" 
                width={200} 
                height={28} 
                style={{ width: 200, height: "auto" }}
                className="hidden sm:block"
              />
              <img 
                src="/logo.png" 
                alt="Singulari" 
                width={120} 
                height={20} 
                style={{ width: 120, height: "auto" }}
                className="block sm:hidden"
              />
            </Link>
          </div>
          
          <nav className="flex items-center gap-3 pr-1">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
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
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
              <UserMenu />
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}


