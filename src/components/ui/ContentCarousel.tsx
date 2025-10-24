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
  itemClassName = "pl-4 basis-full sm:basis-[300px] lg:basis-[350px]"
}: ContentCarouselProps) {
  return (
    <div className="relative">
      <Carousel className={className}>
        <CarouselContent className="-ml-4">
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index} className={itemClassName}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default ContentCarousel;
