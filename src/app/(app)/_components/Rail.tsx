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
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          "hover:bg-light-surface dark:hover:bg-dark-border/50",
          isActive(href) && "bg-light-surface dark:bg-dark-border/50 text-brand-accent"
        )}
      >
        {icon}
      </Link>
    </Tooltip>
  );

  return (
    <nav className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-2 py-3 bg-light-surface dark:bg-dark-surface shadow-sm">
      {item("/dashboard", "Início", <Home size={18} />)}
      <Tooltip label="Comunidade">
        <Link
          href="/community"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
            "text-brand-accent bg-brand-accent/10 hover:bg-brand-accent/15 ring-1 ring-brand-accent/20",
            isActive("/community") && "ring-2 ring-brand-accent/40"
          )}
        >
          <MessagesSquare size={18} />
        </Link>
      </Tooltip>
      {item("/catalog/montanha-do-amanha", "Conteúdos", <BookOpen size={18} />)}
      <Tooltip label="Corujinha (IA)">
        <Link
          href="/ai"
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
            "bg-[#43085E] hover:brightness-110 text-white shadow-sm",
            isActive("/ai") ? "ring-2 ring-white/30" : "ring-0"
          )}
          style={{ boxShadow: "0 8px 20px rgba(67,8,94,0.32)" }}
        >
          <img src="/coruja.svg" alt="Corujinha" width={18} height={18} style={{ width: 18, height: 'auto', filter: 'brightness(0) invert(1)' }} />
        </Link>
      </Tooltip>
      <div className="flex-1" />
      <div className="w-full pt-2 mt-2 flex flex-col items-center">
        {item("/admin", "Admin", <ShieldCheck size={18} />)}
      </div>
    </nav>
  );
}


