"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface WatchPageProps { params: { lessonId: string } }

export default function WatchPage({ params }: WatchPageProps) {
  const supabase = getBrowserSupabaseClient();
  const [title, setTitle] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [lessons, setLessons] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase.from("lessons").select("title, video_url, module_id").eq("id", params.lessonId).maybeSingle();
      setTitle(data?.title ?? "Aula");
      setVideoUrl(data?.video_url ?? null);
      if (data?.module_id) {
        const { data: mod } = await supabase.from("modules").select("title").eq("id", data.module_id).maybeSingle();
        setModuleTitle(mod?.title ?? "");
        const { data: list } = await supabase.from("lessons").select("id, title").eq("module_id", data.module_id).order("position");
        setLessons(list ?? []);
      }
    })();
  }, [supabase, params.lessonId]);

  return (
    <Container>
      <Section>
        <div className="grid gap-6 xl:grid-cols-[1fr_360px] items-start">
          <div>
            <PageHeader title={title || "Assistir Aula"} />
            {videoUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border)]">
                <iframe
                  src={videoUrl.replace("vimeo.com/", "player.vimeo.com/video/")}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-[var(--foreground)]/60">Vídeo não disponível.</div>
            )}
          </div>
          <aside className="rounded-xl border border-[var(--border)] p-4">
            <div className="text-sm font-semibold mb-2">{moduleTitle || "Aulas do módulo"}</div>
            <div className="space-y-1">
              {lessons.map((l) => (
                <Link key={l.id} href={`/watch/${l.id}`} className={`block px-3 py-2 rounded-lg hover:bg-[var(--hover)] ${l.id===params.lessonId?"bg-[var(--hover)]":""}`}>{l.title}</Link>
              ))}
              {lessons.length===0 && <div className="text-[var(--foreground)]/60 text-sm">Sem aulas listadas.</div>}
            </div>
          </aside>
        </div>
      </Section>
    </Container>
  );
}


