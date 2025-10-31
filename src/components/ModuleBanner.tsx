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
    <div className="relative w-full overflow-hidden md:aspect-[16/6] md:min-h-[400px] max-h-[600px]">
      {/* Imagem de Fundo */}
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-auto md:h-full object-cover object-center"
          decoding="async"
          loading="eager"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-purple-900 via-purple-700 to-orange-500" />
      )}

      {/* Overlay com gradiente escuro */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/30" />

      {/* Conteúdo */}
      <div className="absolute inset-0 flex items-start md:items-center">
        <div className="w-full px-4 md:px-8 py-6 md:py-0">
          <div className="flex flex-col items-start max-w-4xl">
            {/* Botão voltar */}
            <div className="mb-4 md:mb-6 self-start">
              {trailSlug ? (
                <Link 
                  href={`/catalog/${trailSlug}`}
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm md:text-base"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar à {trailTitle}</span>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-white/90 text-sm md:text-base">
                  <ArrowLeft size={20} />
                  <span>{trailTitle}</span>
                </div>
              )}
            </div>

            {/* Título e Metadados */}
            <div className="hidden md:block mb-3 md:mb-4 w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg leading-tight">
                {title}
              </h1>
               
              <div className="hidden md:flex items-center flex-wrap gap-3 md:gap-6 text-white/90 mb-3 md:mb-4">
                {category && (
                  <div className="flex items-center gap-2 bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Tag size={16} />
                    <span className="text-xs md:text-sm">{category}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span className="text-xs md:text-sm">{lessonsCount} {lessonsCount === 1 ? 'aula' : 'aulas'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-xs md:text-sm">{totalDuration}</span>
                </div>
              </div>
            </div>

                         {/* Descrição */}
            {description && (
              <p className="hidden md:block text-white/90 text-base md:text-lg mb-4 md:mb-6 max-w-3xl drop-shadow-md">
                {description}
              </p>
            )}

            {/* Barra de Progresso */}
            <div className="hidden md:block mb-4 md:mb-6 w-full max-w-sm md:max-w-md">
              <div className="flex justify-between text-xs md:text-sm text-white/90 mb-1.5 md:mb-2">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 md:h-2 overflow-hidden">
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
                className="hidden md:inline-flex items-center justify-start gap-2 w-auto px-4 md:px-8 py-2 md:py-3 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs md:text-base font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
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
