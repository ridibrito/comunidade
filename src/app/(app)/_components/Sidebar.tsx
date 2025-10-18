"use client";

import Link from "next/link";
import { CalendarDays, BookOpen, Library, UsersRound, PlayCircle, Mountain, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

export function Sidebar() {
  const pathname = usePathname();
  // Determine current section for dynamic internal menu
  const inCatalog = pathname.startsWith("/catalog");
  const inEvents = pathname.startsWith("/events");
  const show = (inCatalog || inEvents);

  const item = (href: string, label: string, active: boolean, Icon: React.ComponentType<{size?: number; className?: string}>) => (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-xl transition-colors px-4 py-3",
          "hover:bg-light-surface dark:hover:bg-dark-border/50",
          active && "bg-light-surface dark:bg-dark-border/50 text-brand-accent"
        )}
      >
        <Icon size={18} className={cn(active ? "text-brand-accent" : "text-light-muted dark:text-dark-muted")} />
        <span className="text-light-text dark:text-dark-text">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className={cn(
      "hidden md:block shrink-0 h-full bg-light-surface dark:bg-dark-surface transition-all duration-300 shadow-sm",
      show ? "w-[280px] xl:w-[340px] p-4" : "w-0 p-0 overflow-hidden"
    )}>
      {show && (
        <>
          <div className="mb-2" />
          <ul className="text-sm space-y-2">
            {inCatalog && (
              <>
                {item("/catalog/montanha-do-amanha", "Montanha do amanhã", pathname.startsWith("/catalog/montanha-do-amanha"), Mountain)}
                {item("/catalog/acervo-digital", "Acervo digital", pathname.startsWith("/catalog/acervo-digital"), Library)}
                {item("/catalog/rodas-de-conversa", "Rodas de conversa", pathname.startsWith("/catalog/rodas-de-conversa"), UsersRound)}
                {item("/catalog/plantao-de-duvidas", "Plantão de dúvidas", pathname.startsWith("/catalog/plantao-de-duvidas"), HelpCircle)}
              </>
            )}
            {inEvents && (
              <>
                {item("/events/history", "Lives realizadas", pathname.startsWith("/events/history"), PlayCircle)}
                {item("/events/calendar", "Calendário", pathname.startsWith("/events/calendar"), CalendarDays)}
              </>
            )}
          </ul>
        </>
      )}
    </aside>
  );
}


