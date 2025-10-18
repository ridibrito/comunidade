"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function WatchClient({ slug }: { slug: string }) {
  const supabase = getBrowserSupabaseClient();
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessons, setLessons] = useState<Array<{ id: string; title: string; video_url: string | null }>>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: mod } = await supabase.from("modules").select("id, title").eq("slug", slug).maybeSingle();
      if (!mod?.id) return;
      setModuleTitle(mod.title);
      const { data: l } = await supabase.from("lessons").select("id, title, video_url").eq("module_id", mod.id).order("position");
      setLessons(l ?? []);
      if ((l ?? []).length) setCurrent((l ?? [])[0].id);
    })();
  }, [supabase, slug]);

  const currentLesson = lessons.find((x) => x.id === current);
  const embedUrl = currentLesson?.video_url ? currentLesson.video_url.replace("vimeo.com/", "player.vimeo.com/video/") : null;

  return (
    <Container>
      <Section>
        <div className="grid gap-6 xl:grid-cols-[1fr_360px] items-start">
          <div>
            <PageHeader title={moduleTitle} />
            {embedUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border)]">
                <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <div className="text-[var(--foreground)]/60">Selecione uma aula</div>
            )}
          </div>
          <aside className="rounded-xl border border-[var(--border)] p-4">
            <div className="text-sm font-semibold mb-2">Aulas</div>
            <div className="space-y-1">
              {lessons.map((l) => (
                <button key={l.id} onClick={() => setCurrent(l.id)} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--hover)] ${l.id===current?"bg-[var(--hover)]":""}`}>{l.title}</button>
              ))}
              {lessons.length===0 && <div className="text-[var(--foreground)]/60 text-sm">Nenhuma aula disponível.</div>}
            </div>
          </aside>
        </div>
        <div className="mt-4">
          <Link href={`/catalog/modulo/${slug}`} className="text-sm underline opacity-80 hover:opacity-100">Voltar para lista de aulas</Link>
        </div>
      </Section>
    </Container>
  );
}


