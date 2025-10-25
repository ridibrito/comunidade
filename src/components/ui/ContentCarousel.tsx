"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/CarouselNew";

interface ContentCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function ContentCarousel({ 
  children, 
  className = "w-full",
  itemClassName = "pl-4 basis-[280px] sm:basis-[300px] lg:basis-[350px]"
}: ContentCarouselProps) {
  return (
    <div className="relative overflow-visible">
      <Carousel className={className}>
        <CarouselContent className="-ml-4 overflow-visible">
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index} className={`${itemClassName} overflow-visible`}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}

export default ContentCarousel;
