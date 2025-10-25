'use client';

import { ArrowLeft, Play, Clock, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';

interface ModuleBannerProps {
  title: string;
  description: string;
  coverUrl?: string;
  lessonsCount: number;
  totalDuration: string;
  progress: number;
  category?: string;
  trailTitle: string;
  trailSlug?: string;
  onPlayClick?: () => void;
}

export function ModuleBanner({
  title,
  description,
  coverUrl,
  lessonsCount,
  totalDuration,
  progress,
  category,
  trailTitle,
  trailSlug,
  onPlayClick
}: ModuleBannerProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 6', minHeight: '400px', maxHeight: '600px' }}>
      {/* Imagem de Fundo */}
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-purple-900 via-purple-700 to-orange-500" />
      )}

      {/* Overlay com gradiente escuro */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/30" />

      {/* Conteúdo */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-8">
          <div className="flex flex-col items-start max-w-4xl">
            {/* Botão voltar */}
            <div className="mb-6 self-start">
              {trailSlug ? (
                <Link 
                  href={`/catalog/${trailSlug}`}
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar à {trailTitle}</span>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-white/90">
                  <ArrowLeft size={20} />
                  <span>{trailTitle}</span>
                </div>
              )}
            </div>

                         {/* Título e Metadados */}
             <div className="mb-4 w-full">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                 {title}
               </h1>
               
               <div className="flex items-center gap-6 text-white/90 mb-4">
                {category && (
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <Tag size={16} />
                    <span className="text-sm">{category}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span className="text-sm">{lessonsCount} {lessonsCount === 1 ? 'aula' : 'aulas'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">{totalDuration}</span>
                </div>
              </div>
            </div>

                         {/* Descrição */}
             {description && (
               <p className="text-white/90 text-lg mb-6 max-w-3xl drop-shadow-md">
                 {description}
               </p>
             )}

            {/* Barra de Progresso */}
            <div className="mb-6 w-full max-w-md">
              <div className="flex justify-between text-sm text-white/90 mb-2">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-brand-accent h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Botão de Ação */}
            {onPlayClick && (
              <button
                onClick={onPlayClick}
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Play size={20} />
                Continuar assistindo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
