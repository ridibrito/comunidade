"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export default function LivroViewerClient({ id }: { id: string }) {
  const supabase = getBrowserSupabaseClient();
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase
        .from("contents")
        .select("title, file_url")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        const bookData = data as { title: string; file_url: string };
        setTitle(bookData.title);
        setFileUrl(bookData.file_url);
      }
    })();
  }, [supabase, id]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="sticky top-0 z-10 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-light-muted dark:text-dark-muted">
            <Link href="/catalog/acervo-digital" className="hover:text-light-text dark:hover:text-dark-text">Acervo Digital</Link>
            <span className="mx-2">›</span>
            <span className="text-light-text dark:text-dark-text">{title || "Livro"}</span>
          </div>
          {fileUrl && (
            <a href={fileUrl} download className="px-3 py-1.5 rounded-md bg-brand-accent text-white text-sm hover:bg-brand-accent/90">Baixar PDF</a>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {fileUrl ? (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Abrir Livro</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Clique no botão abaixo para abrir o livro em uma nova aba.
              </p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-accent text-white font-medium hover:bg-brand-accent/90 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Abrir Livro
              </a>
            </div>
          ) : (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Arquivo não disponível</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                O arquivo PDF deste livro ainda não foi carregado.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Entre em contato com o administrador para mais informações.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


