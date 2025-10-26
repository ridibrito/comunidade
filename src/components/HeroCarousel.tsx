'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarcosConquistados, ProgressoMarcos } from '@/components/ui/MarcosConquistados';
import { useMarcos } from '@/hooks/useMarcos';

interface Hero {
  id: string;
  title: string;
  subtitle?: string;
  hero_image_url?: string;
  background_gradient: string;
  title_position?: string;
  subtitle_position?: string;
  trail_id?: string;
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

  // IMPORTANTE: Hooks devem ser chamados SEMPRE, antes de qualquer return condicional
  const currentHero = heroes[currentIndex];
  const { marcos, conquistados, total } = useMarcos(currentHero?.trail_id);

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

  return (
    <div className="relative w-full overflow-hidden min-h-[120px] max-h-[250px] sm:min-h-[160px] sm:max-h-[350px] md:min-h-[200px] md:max-h-[400px]" style={{ aspectRatio: '3 / 1' }}>
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
                className="w-full h-full object-contain sm:object-cover object-center bg-gray-100 dark:bg-gray-800"
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
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                      {hero.title}
                    </h2>
                  )}
                  
                  {/* Marcos Conquistados */}
                  {index === currentIndex && marcos.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <MarcosConquistados 
                        marcos={marcos} 
                        size="md"
                        className="justify-start"
                      />
                    </div>
                  )}
                  {hero.subtitle && (
                    <p className={`text-sm sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-6 drop-shadow-md ${
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
                      className={`inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${
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
             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center z-50"
             aria-label="Slide anterior"
           >
             <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
           </button>

           <button
             onClick={nextSlide}
             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center z-50"
             aria-label="Próximo slide"
           >
             <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
           </button>

           {/* Indicadores */}
           <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-50">
             {heroes.map((_, index) => (
               <button
                 key={index}
                 onClick={() => goToSlide(index)}
                 className={`h-1.5 sm:h-2 rounded-full transition-all ${
                   index === currentIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/50 hover:bg-white/75 w-1.5 sm:w-2'
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
