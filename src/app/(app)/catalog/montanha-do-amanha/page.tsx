"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { CardVideoAula } from "@/components/ui/CardModels";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/CarouselNew";

export default function MontanhaAmanhaPage() {
  // ========================================
  // MONTANHA DO AMANHÃ - VISUALIZAÇÃO PARA ALUNOS
  // ========================================
  // As trilhas e módulos são gerenciados pela área administrativa
  // ========================================
  
  const trails = [
    {
      id: "identificacao",
      title: "Identificação - Treinando o seu olhar de Coruja",
      description: "Módulos fundamentais para identificação de características AHSD",
      badge: "6 módulos",
      badgeVariant: "info" as const,
      modules: [
        { 
          title: "Aspectos Cognitivos", 
          slug: "/catalog/modulo/aspectos-cognitivos", 
          image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
          description: "Desenvolvimento intelectual e habilidades mentais em crianças AHSD",
          instructor: "Dr. Maria Silva",
          lessons: 8,
          duration: "2h 30min",
          progress: 75,
          difficulty: "Intermediário" as const as const,
          rating: 4.8
        },
        { 
          title: "Aspectos Socioemocionais", 
          slug: "/catalog/modulo/aspectos-socioemocionais", 
          image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
          description: "Inteligência emocional e relacionamentos",
          instructor: "Psicóloga Ana Costa",
          lessons: 6,
          duration: "1h 45min",
          progress: 45,
          difficulty: "Básico" as const as const,
          rating: 4.7
        },
        { 
          title: "Rotina e Organização", 
          slug: "#", 
          image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
          description: "Estruturação do dia a dia",
          instructor: "Pedagoga Carla Santos",
          lessons: 5,
          duration: "1h 20min",
          progress: 0,
          difficulty: "Básico" as const,
          rating: 4.6
        },
        { 
          title: "Desenvolvimento Motor", 
          slug: "#", 
          image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
          description: "Coordenação e habilidades físicas",
          lessons: 7,
          duration: "2h 15min",
          progress: 20,
          difficulty: "Intermediário" as const
        },
        { 
          title: "Criatividade", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          description: "Expressão artística e inovação",
          lessons: 9,
          duration: "3h 00min",
          progress: 0,
          difficulty: "Avançado" as const
        },
        { 
          title: "Interesses Específicos", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
          description: "Aprofundamento em áreas de interesse",
          lessons: 12,
          duration: "4h 30min",
          progress: 0,
          difficulty: "Avançado" as const
        },
      ]
    },
    {
      id: "avaliacao",
      title: "Avaliação",
      description: "Ferramentas e testes para avaliação do desenvolvimento",
      badge: "Recomendado",
      badgeVariant: "warning" as const,
      modules: [
        {
          title: "Avaliação – Introdução",
          slug: "#",
          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
          description: "Teste inicial para identificar áreas de desenvolvimento",
          lessons: 1,
          duration: "30 min",
          progress: 0,
          difficulty: "Básico" as const,
          rating: 4.8,
          isNew: true
        },
        {
          title: "Avaliação Cognitiva Avançada",
          slug: "#",
          img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
          description: "Testes específicos para habilidades intelectuais",
          lessons: 3,
          duration: "1h 15min",
          progress: 0,
          difficulty: "Intermediário" as const,
          rating: 4.6
        },
        {
          title: "Avaliação Socioemocional",
          slug: "#",
          img: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
          description: "Instrumentos para avaliar desenvolvimento emocional",
          lessons: 2,
          duration: "45 min",
          progress: 0,
          difficulty: "Básico" as const,
          rating: 4.7
        }
      ]
    }
  ];



  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Montanha do amanhã" />
        
        <div className="space-y-12">
          {/* Renderização dinâmica de todas as trilhas */}
          {trails.map((trail, trailIndex) => (
            <div key={trail.id} className="space-y-2">
              {/* Cabeçalho da trilha */}
              <div className="flex items-center justify-between">
          <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                    {trail.title}
                  </h2>
                  {trail.description && (
                    <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                      {trail.description}
                    </p>
                  )}
                    </div>
                <Badge variant={trail.badgeVariant} size="md">{trail.badge}</Badge>
              </div>
              
              {/* Carrossel de módulos da trilha */}
              <div className="relative pt-8 pb-0">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                    slidesToScroll: 1,
                    dragFree: true,
                    containScroll: "trimSnaps",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 sm:-ml-4">
                    {trail.modules.map((module, moduleIndex) => (
                      <CarouselItem key={moduleIndex} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                        <CardVideoAula
                          title={module.title}
                          description={module.description}
                          instructor={(module as any).instructor || "Instrutor"}
                          duration={module.duration}
                          lessons={module.lessons}
                          progress={module.progress}
                          rating={(module as any).rating}
                          isNew={(module as any).isNew}
                          difficulty={module.difficulty}
                          image={module.image}
                          slug={module.slug}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}


