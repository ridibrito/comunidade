'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Hero {
  id: string;
  title: string;
  subtitle?: string;
  hero_image_url?: string;
  background_gradient: string;
  title_position?: string;
  subtitle_position?: string;
  cta_buttons?: Array<{
    text: string;
    link?: string;
    variant?: string;
    color?: string;
  }>;
}

interface HeroCarouselProps {
  heroes?: Hero[];
  pageSlug?: string;
}

export function HeroCarousel({ heroes: initialHeroes, pageSlug = 'dashboard' }: HeroCarouselProps) {
  const [heroes, setHeroes] = useState<Hero[]>(initialHeroes || []);
  
  useEffect(() => {
    if (initialHeroes) {
      setHeroes(initialHeroes);
      return;
    }

    // Buscar heroes do backend se não foram fornecidos
    async function fetchHeroes() {
      try {
        const response = await fetch(`/api/heroes?page_slug=${pageSlug}`);
        const data = await response.json();
        setHeroes(data.heroes || []);
      } catch (error) {
        console.error('Erro ao buscar heroes:', error);
        setHeroes([]);
      }
    }

    fetchHeroes();
  }, [pageSlug, initialHeroes]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || heroes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [autoPlay, heroes.length]);

  if (heroes.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const currentHero = heroes[currentIndex];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 1', minHeight: '400px', maxHeight: '900px' }}>
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroes.map((hero, index) => (
          <div
            key={hero.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Imagem de Fundo */}
            {hero.hero_image_url ? (
              <img
                src={hero.hero_image_url}
                alt={hero.title || 'Hero image'}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-r ${hero.background_gradient}`} />
            )}

            {/* Overlay com conteúdo */}
            {(hero.title || hero.subtitle || (hero.cta_buttons && hero.cta_buttons.length > 0)) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className={`px-6 flex flex-col ${
                  hero.title_position === 'left' ? 'items-start text-left' : 
                  hero.title_position === 'right' ? 'items-end text-right' : 
                  'items-center text-center'
                }`}>
                  {hero.title && (
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                      {hero.title}
                    </h2>
                  )}
                  {hero.subtitle && (
                    <p className={`text-xl md:text-2xl text-white/90 mb-6 drop-shadow-md ${
                      hero.subtitle_position === 'left' ? 'self-start' : 
                      hero.subtitle_position === 'right' ? 'self-end' : 
                      'self-center'
                    }`}>
                      {hero.subtitle}
                    </p>
                  )}
                  {hero.cta_buttons && hero.cta_buttons.length > 0 && hero.cta_buttons[0].link && (
                    <a
                      href={hero.cta_buttons[0].link}
                      className={`inline-block px-8 py-3 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                        hero.cta_buttons[0].color === 'brand-accent' 
                          ? 'bg-brand-accent text-white hover:bg-brand-accent/90'
                          : `${hero.cta_buttons[0].color || 'bg-brand-accent'} text-white hover:opacity-90`
                      }`}
                    >
                      {hero.cta_buttons[0].text}
                    </a>
                  )}
                </div>
              </div>
                                                   )}
            </div>
         ))}
        </div>



             {/* Botões de Navegação */}
       {heroes.length > 1 && (
         <>
           <button
             onClick={prevSlide}
             className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center z-50"
             aria-label="Slide anterior"
           >
             <ChevronLeft className="w-6 h-6 text-white" />
           </button>

           <button
             onClick={nextSlide}
             className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center z-50"
             aria-label="Próximo slide"
           >
             <ChevronRight className="w-6 h-6 text-white" />
           </button>

           {/* Indicadores */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
             {heroes.map((_, index) => (
               <button
                 key={index}
                 onClick={() => goToSlide(index)}
                 className={`w-2 h-2 rounded-full transition-all ${
                   index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                 }`}
                 aria-label={`Ir para slide ${index + 1}`}
               />
             ))}
           </div>
         </>
       )}
    </div>
  );
}
