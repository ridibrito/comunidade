"use client";

import React from "react";
import { MarcosConquistados, ProgressoMarcos } from "./MarcosConquistados";
import { useMarcos } from "@/hooks/useMarcos";
import { CardVideoAula, CardLivro } from "./CardModels";
import { cn } from "@/lib/utils";

interface CardComMarcosProps {
  content: any;
  showMarcos?: boolean;
  className?: string;
}

export function CardComMarcos({ content, showMarcos = true, className }: CardComMarcosProps) {
  const { marcos, conquistados, total } = useMarcos(content.trail_id);
  
  // Debug: log para verificar se os marcos estão sendo carregados
  React.useEffect(() => {
    if (showMarcos && content.trail_id) {
      console.log(`[CardComMarcos] trail_id: ${content.trail_id}, marcos: ${marcos.length}, conquistados: ${conquistados}/${total}`);
    }
  }, [marcos, conquistados, total, content.trail_id, showMarcos]);

  const renderCard = () => {
    if (content.content_type === 'book') {
      return (
        <CardLivro
          title={content.title}
          author="Autor"
          description={content.description || ""}
          pages={content.duration || 0}
          image={content.image}
          fileUrl={content.file_url || "#"}
          id={content.id}
          className={className}
        />
      );
    }

    return (
      <CardVideoAula
        title={content.title}
        description={content.description || ""}
        instructor="Instrutor"
        duration={`${content.duration || 0}min`}
        lessons={1}
        progress={content.progress}
        image={content.image}
        slug={content.slug}
        className={className}
      />
    );
  };

  if (!showMarcos || marcos.length === 0) {
    return renderCard();
  }

  return (
    <div className={cn("relative", className)}>
      {renderCard()}
      
      {/* Overlay com marcos */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/80">Marcos</span>
            <span className="text-xs text-white/80">{conquistados}/{total}</span>
          </div>
          <MarcosConquistados 
            marcos={marcos} 
            size="sm"
            className="justify-center"
          />
        </div>
      </div>
    </div>
  );
}

export default CardComMarcos;
