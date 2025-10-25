"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/catalog", label: "Catálogo", icon: BookOpen },
    { href: "/events", label: "Eventos", icon: Calendar },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-light-surface dark:bg-dark-bg border-t border-light-border dark:border-dark-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                "hover:bg-light-surface dark:hover:bg-dark-surface",
                active && "bg-brand-subtle"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  active 
                    ? "text-brand-accent" 
                    : "text-light-muted dark:text-dark-muted"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium truncate",
                  active 
                    ? "text-brand-accent" 
                    : "text-light-muted dark:text-dark-muted"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
