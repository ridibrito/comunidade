// @ts-nocheck
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LivroPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      const { id } = await params;
      const supabase = createClient();
      
      // Buscar o conteúdo do livro
      const { data: content, error } = await supabase
        .from('contents')
        .select('title, file_url')
        .eq('id', id)
        .eq('content_type', 'book')
        .single();

      if (error || !content?.file_url) {
        router.push('/catalog/acervo-digital');
        return;
      }

      // Redirecionar diretamente para o PDF
      window.location.href = content.file_url;
    };

    fetchAndRedirect();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando livro...</p>
      </div>
    </div>
  );
}
