'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { CardLivro, CardPDF } from "@/components/ui/CardModels";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/CarouselNew";

export default function AcervoDigitalPage() {
  // ========================================
  // ACERVO DIGITAL - VISUALIZAÇÃO PARA ALUNOS
  // ========================================
  // As coleções e recursos são gerenciados pela área administrativa
  // ========================================
  
  const collections = [
    {
      id: "guias-fundamentais",
      title: "Guias Fundamentais",
      description: "Manuais essenciais sobre AHSD e desenvolvimento infantil",
      badge: "Essencial",
      badgeVariant: "brand" as const,
      order: 1,
      resources: [
        {
          title: "Guia Completo AHSD",
          description: "Manual abrangente sobre Altas Habilidades/Superdotação",
          type: "PDF",
          pages: 156,
          rating: 4.9,
          downloads: 1247,
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/guia-completo-ahsd.pdf",
          isFeatured: true,
          isNew: false
        },
        {
          title: "Estratégias Educacionais",
          description: "Métodos práticos para desenvolvimento cognitivo",
          type: "PDF",
          pages: 89,
          rating: 4.7,
          downloads: 892,
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/estrategias-educacionais.pdf"
        },
        {
          title: "Manual de Rotinas",
          description: "Organização e estruturação do dia a dia",
          type: "PDF",
          pages: 67,
          rating: 4.6,
          downloads: 743,
          image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/manual-rotinas.pdf"
        }
      ]
    },
    {
      id: "serie-desenvolvimento",
      title: "Série Desenvolvimento Infantil",
      description: "Coleção completa sobre aspectos do desenvolvimento",
      badge: "Série",
      badgeVariant: "info" as const,
      order: 2,
      resources: [
        {
          title: "Desenvolvimento Motor",
          description: "Exercícios para coordenação e habilidades físicas",
          type: "PDF",
          pages: 134,
          rating: 4.5,
          downloads: 634,
          image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/desenvolvimento-motor.pdf",
          series: "Desenvolvimento Infantil",
          seriesOrder: 1
        },
        {
          title: "Desenvolvimento Cognitivo",
          description: "Fundamentos do pensamento e raciocínio",
          type: "PDF",
          pages: 178,
          rating: 4.8,
          downloads: 892,
          image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/desenvolvimento-cognitivo.pdf",
          series: "Desenvolvimento Infantil",
          seriesOrder: 2
        },
        {
          title: "Desenvolvimento Socioemocional",
          description: "Inteligência emocional e relacionamentos",
          type: "PDF",
          pages: 145,
          rating: 4.7,
          downloads: 756,
          image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/desenvolvimento-socioemocional.pdf",
          series: "Desenvolvimento Infantil",
          seriesOrder: 3
        }
      ]
    },
    {
      id: "atividades-praticas",
      title: "Atividades Práticas",
      description: "Exercícios e atividades para aplicar em casa",
      badge: "Prático",
      badgeVariant: "success" as const,
      order: 3,
      resources: [
        {
          title: "Atividades Criativas",
          description: "Coleção de exercícios para estimular criatividade",
          type: "PDF",
          pages: 203,
          rating: 4.8,
          downloads: 1156,
          image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/atividades-criativas.pdf",
          isNew: true
        },
        {
          title: "Jogos Educativos",
          description: "Jogos e brincadeiras para desenvolvimento",
          type: "PDF",
          pages: 98,
          rating: 4.6,
          downloads: 567,
          image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=1600&auto=format&fit=crop",
          fileUrl: "/files/jogos-educativos.pdf"
        }
      ]
    }
  ];


  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Acervo digital" />
        
        <div className="space-y-12">
          {/* Renderização dinâmica de todas as coleções */}
          {collections
            .sort((a, b) => a.order - b.order)
            .map((collection, collectionIndex) => (
            <div key={collection.id} className="space-y-6">
              {/* Cabeçalho da coleção */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                      {collection.description}
                    </p>
                  )}
                </div>
                <Badge variant={collection.badgeVariant} size="md">{collection.badge}</Badge>
              </div>
              
              {/* Carrossel de recursos da coleção */}
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
                    {collection.resources
                      .sort((a, b) => ((a as any).seriesOrder || 0) - ((b as any).seriesOrder || 0))
                      .map((resource, resourceIndex) => (
                      <CarouselItem key={resourceIndex} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                        {resource.type === "Livro" ? (
                          <CardLivro
                            title={resource.title}
                            author={(resource as any).author || "Autor"}
                            description={resource.description}
                            pages={resource.pages}
                            rating={resource.rating}
                            downloads={resource.downloads}
                            isNew={(resource as any).isNew}
                            isFeatured={(resource as any).isFeatured}
                            image={resource.image}
                            fileUrl={resource.fileUrl}
                          />
                        ) : (
                          <CardPDF
                            title={resource.title}
                            description={resource.description}
                            pages={resource.pages}
                            rating={resource.rating}
                            downloads={resource.downloads}
                            isNew={(resource as any).isNew}
                            isFeatured={(resource as any).isFeatured}
                            series={(resource as any).series}
                            seriesOrder={(resource as any).seriesOrder}
                            image={resource.image}
                            fileUrl={resource.fileUrl}
                          />
                        )}
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


