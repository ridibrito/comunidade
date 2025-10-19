"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessagesSquare, ShieldCheck } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
// using plain img for small svg to avoid Next Image aspect warnings

export function Rail() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  const item = (
    href: string,
    label: string,
    icon: React.ReactNode,
  ) => (
    <Tooltip label={label}>
      <Link
        href={href}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer",
          "hover:bg-purple-50 dark:hover:bg-purple-900/20",
          "text-light-muted dark:text-dark-muted",
          isActive(href) && "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        )}
      >
        {icon}
      </Link>
    </Tooltip>
  );

  return (
    <nav className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-2 py-3 bg-light-surface dark:bg-dark-surface shadow-sm">
      {item("/dashboard", "Início", <Home size={18} />)}
      {item("/community", "Comunidade", <MessagesSquare size={18} />)}
      {item("/catalog/montanha-do-amanha", "Conteúdos", <BookOpen size={18} />)}
      <Tooltip label="Corujinha (IA)">
        <Link
          href="/ai"
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer",
            "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 text-white shadow-lg",
            isActive("/ai") ? "ring-2 ring-white/30 scale-105" : "ring-0"
          )}
          style={{ 
            boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4), 0 4px 12px rgba(147, 51, 234, 0.2)",
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)"
          }}
        >
          <img 
            src="/coruja.svg" 
            alt="Corujinha" 
            width={20} 
            height={20} 
            style={{ 
              width: 20, 
              height: 'auto', 
              filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' 
            }} 
          />
        </Link>
      </Tooltip>
      <div className="flex-1" />
      <div className="w-full pt-2 mt-2 flex flex-col items-center">
        {item("/admin", "Admin", <ShieldCheck size={18} />)}
      </div>
    </nav>
  );
}


