// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function WatchSingleClient({ id }: { id: string }) {
  const supabase = getBrowserSupabaseClient();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [moduleSlug, setModuleSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      // Buscar conteúdo e módulo
      const { data: contentData } = await supabase
        .from("contents")
        .select("title, video_url, duration, module_id")
        .eq("id", id)
        .maybeSingle();
      
      if (contentData) {
        setTitle(contentData.title);
        setVideoUrl(contentData.video_url);
        setDuration(contentData.duration);
        
        // Se tiver module_id, buscar o slug do módulo
        if (contentData.module_id) {
          const { data: moduleData } = await supabase
            .from("modules")
            .select("slug")
            .eq("id", contentData.module_id)
            .maybeSingle();
          
          if (moduleData) {
            setModuleSlug(moduleData.slug);
          }
        }
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
      {/* Header padronizado - com botão voltar e não fixo */}
      <div className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Botão voltar */}
          {moduleSlug && (
            <Link 
              href={`/catalog/modulo/${moduleSlug}`}
              className="inline-flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors mb-3"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </Link>
          )}
          
          <h1 className="text-lg sm:text-xl font-semibold text-light-text dark:text-dark-text">
            {title || "Conteúdo"}
          </h1>
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


