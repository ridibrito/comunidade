"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

import { Calendar, Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationSystem";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, role")
          .eq("id", user.id)
          .single();

        const userIsAdmin = Boolean(profile?.is_admin) || (profile?.role === "admin");
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

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
                className="hidden lg:block"
              />
              <img 
                src="/logo.png" 
                alt="Singulari" 
                width={160} 
                height={24} 
                style={{ width: 160, height: "auto" }}
                className="block lg:hidden"
              />
            </Link>
          </div>
          
          <nav className="flex items-center gap-3 pr-1">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Ícone de Calendário - apenas para admins */}
              {!loading && isAdmin && (
                <Link 
                  href="/events/calendar" 
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer hover-brand-subtle text-light-muted dark:text-dark-muted"
                  title="Calendário de Eventos"
                >
                  <Calendar size={18} />
                </Link>
              )}
              
              {/* Sistema de Notificações */}
              <NotificationBell />
              
              <UserMenu />
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <NotificationBell />
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


