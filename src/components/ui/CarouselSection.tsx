import { ReactNode } from "react";

interface CarouselSectionProps {
  children: ReactNode;
  className?: string;
}

export default function CarouselSection({ children, className = "" }: CarouselSectionProps) {
  return (
    <div 
      className={`relative px-8 ${className}`}
      style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      {children}
    </div>
  );
}
