"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export default function WatchSingleClient({ id }: { id: string }) {
  const supabase = getBrowserSupabaseClient();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase
        .from("contents")
        .select("title, video_url, duration")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setTitle(data.title);
        setVideoUrl(data.video_url);
        setDuration(data.duration);
      }
    })();
  }, [supabase, id]);

  const embedUrl = videoUrl
    ? videoUrl
        .replace("vimeo.com/", "player.vimeo.com/video/")
        .replace("www.vimeo.com/", "player.vimeo.com/video/") +
      "?autoplay=0&title=0&byline=0&portrait=0&responsive=1"
    : null;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="sticky top-0 z-10 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted mb-2">
            <Link href="/catalog/acervo-digital" className="hover:text-light-text dark:hover:text-dark-text transition-colors">
              Acervo Digital
            </Link>
            <span>›</span>
            <span className="text-light-text dark:text-dark-text">{title || "Conteúdo"}</span>
          </div>
          <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">{title || "Conteúdo"}</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-video bg-black">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-light-muted dark:text-dark-muted">
                Vídeo indisponível
              </div>
            )}
          </div>
          {duration !== null && (
            <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">{duration} min</p>
          )}
        </div>
      </div>
    </div>
  );
}


