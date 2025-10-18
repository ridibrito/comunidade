'use client';

import { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode[];
  cardWidth?: number;
  gap?: number;
  className?: string;
}

export default function Carousel({ 
  children, 
  cardWidth = 320, 
  gap = 24, 
  className = "" 
}: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function scrollByCards(cards: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollAmount = (cardWidth + gap) * cards;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex overflow-x-hidden" 
        ref={scrollerRef}
        style={{ gap: `${gap}px` }}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="flex-shrink-0"
            style={{ width: `${cardWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Botões de navegação */}
      <button 
        onClick={() => scrollByCards(-1)} 
        disabled={!canLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-lg flex items-center justify-center transition-all ${
          canLeft ? "hover:bg-gray-50 dark:hover:bg-dark-border/50" : "opacity-40 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-dark-text" />
      </button>
      
      <button 
        onClick={() => scrollByCards(1)} 
        disabled={!canRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-lg flex items-center justify-center transition-all ${
          canRight ? "hover:bg-gray-50 dark:hover:bg-dark-border/50" : "opacity-40 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-dark-text" />
      </button>
    </div>
  );
}
