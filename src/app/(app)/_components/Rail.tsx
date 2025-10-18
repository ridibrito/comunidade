"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessagesSquare, CalendarDays, ShieldCheck } from "lucide-react";
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
          "hover:bg-[var(--hover)]",
          isActive(href) && "bg-[var(--hover)] text-[var(--accent-purple)]"
        )}
      >
        {icon}
      </Link>
    </Tooltip>
  );

  return (
    <nav className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-2 py-3 border-r border-[color:var(--border)] bg-[color:var(--surface)]">
      {item("/dashboard", "Início", <Home size={18} />)}
      {item("/catalog/montanha-do-amanha", "Conteúdos", <BookOpen size={18} />)}
      {item("/community", "Comunidade", <MessagesSquare size={18} />)}
      {item("/events", "Agenda", <CalendarDays size={18} />)}
      <Tooltip label="Corujinha (IA)">
        <Link
          href="/ai"
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
            "bg-[var(--hover)] text-[var(--foreground)] shadow-sm border border-[var(--border)]",
            isActive("/ai") ? "ring-2 ring-[var(--accent-purple)]/25" : "hover:brightness-110"
          )}
        >
          <img src="/coruja.svg" alt="Corujinha" width={18} height={18} style={{ width: 18, height: 'auto' }} />
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30">IA</span>
        </Link>
      </Tooltip>
      <div className="flex-1" />
      <div className="w-full pt-2 mt-2 border-t border-[color:var(--border)] flex flex-col items-center">
        {item("/admin", "Admin", <ShieldCheck size={18} />)}
      </div>
    </nav>
  );
}


