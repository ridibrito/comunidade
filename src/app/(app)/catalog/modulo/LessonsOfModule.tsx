"use client";

import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function LessonsOfModule({ slug }: { slug: string }) {
  const supabase = getBrowserSupabaseClient();
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessons, setLessons] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: mod } = await supabase.from("modules").select("id, title").eq("slug", slug).maybeSingle();
      if (!mod?.id) return;
      setModuleTitle(mod.title);
      const { data: l } = await supabase.from("lessons").select("id, title").eq("module_id", mod.id).order("position");
      setLessons(l ?? []);
    })();
  }, [supabase, slug]);

  return (
    <div>
      <div className="flex items-end justify-between">
        <PageHeader title={moduleTitle} subtitle="Lista de aulas" />
        {slug && (
          <Link href={`/catalog/modulo/${slug}/assistir`} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] text-sm">Assistir</Link>
        )}
      </div>
      <div className="rounded-xl border border-[var(--border)] p-4">
        <ul className="space-y-1 text-sm">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link href={`/watch/${l.id}`} className="block px-3 py-2 rounded-lg hover:bg-[var(--hover)]">{l.title}</Link>
            </li>
          ))}
          {lessons.length===0 && <li className="text-[var(--foreground)]/60">Nenhuma aula disponível.</li>}
        </ul>
      </div>
    </div>
  );
}


