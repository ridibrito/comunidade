"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Route, BookOpen, Users, HelpCircle } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const item = (
    href: string,
    label: string,
    active: boolean,
    Icon: React.ComponentType<{ size?: number; className?: string }>
  ) => (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-xl transition-colors px-4 py-3",
          "hover:bg-[var(--hover)]",
          active && "bg-[var(--hover)] text-[var(--accent-purple)]"
        )}
      >
        <Icon size={18} className={cn(active ? "text-[var(--accent-purple)]" : "text-[var(--foreground)]/80")} />
        <span className="text-[var(--foreground)]">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="hidden md:block w-[240px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-4 min-h-[calc(100vh-64px)]">
      <div className="text-xs uppercase tracking-wide text-[var(--foreground)]/60 mb-2">Admin</div>
      <ul className="text-sm space-y-2">
        {item("/admin/trails", "Trilhas", pathname.startsWith("/admin/trails"), Route)}
        {item("/admin/acervo", "Acervo digital", pathname.startsWith("/admin/acervo"), BookOpen)}
        {item("/admin/rodas", "Rodas de conversa", pathname.startsWith("/admin/rodas"), Users)}
        {item("/admin/plantao", "Plantão de dúvidas", pathname.startsWith("/admin/plantao"), HelpCircle)}
        {item("/admin/usuarios", "Usuários", pathname.startsWith("/admin/usuarios"), Users)}
      </ul>
    </aside>
  );
}


