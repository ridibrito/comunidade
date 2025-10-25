"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  User,
  BarChart3,
  Shield,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleSignOut = async () => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/catalog", label: "Catálogo", icon: BookOpen },
    { href: "/events", label: "Eventos", icon: Calendar },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  const adminItems = [
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const MenuItem = ({ href, label, icon: Icon, onClick }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        "hover:bg-light-surface dark:hover:bg-dark-surface",
        isActive(href) 
          ? "bg-brand-subtle text-brand-accent" 
          : "text-light-text dark:text-dark-text"
      )}
    >
      <Icon size={20} className={cn(
        isActive(href) 
          ? "text-brand-accent" 
          : "text-light-muted dark:text-dark-muted"
      )} />
      {label}
    </Link>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Singulari" width={120} height={20} />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            >
              <X size={20} className="text-light-muted dark:text-dark-muted" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <MenuItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                onClick={onClose}
              />
            ))}

            {/* Admin Section */}
            {!loading && isAdmin && (
              <div className="pt-4 mt-4 border-t border-light-border dark:border-dark-border">
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider">
                    Administração
                  </h3>
                </div>
                {adminItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    onClick={onClose}
                  />
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-light-border dark:border-dark-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
