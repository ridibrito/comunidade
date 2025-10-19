'use client';

import { useRef, ReactNode } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Container do carrossel com scroll horizontal */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          gap: `${gap}px`,
          paddingLeft: '0',
          paddingRight: '0'
        }}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mb-8"
            style={{ width: `${cardWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Botão esquerdo - encostado na borda externa para não sobrepor o card */}
      <button 
        onClick={scrollLeft}
        className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center z-20 hover:bg-gray-50"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      {/* Botão direito - encostado na borda externa para não sobrepor o card */}
      <button 
        onClick={scrollRight}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center z-20 hover:bg-gray-50"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
