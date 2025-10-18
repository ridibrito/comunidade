'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Carousel from "@/components/ui/Carousel";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { BookOpen, Download, Eye, Star, FileText, Book, File } from "lucide-react";

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
          isFeatured: true
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="w-4 h-4" />;
      case "Artigo": return <File className="w-4 h-4" />;
      case "Livro": return <Book className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PDF": return "error";
      case "Artigo": return "info";
      case "Livro": return "brand";
      default: return "default";
    }
  };

  return (
    <Container>
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
                  <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                    {collection.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={collection.badgeVariant} size="md">{collection.badge}</Badge>
                  <Badge variant="outline" size="sm">{collection.resources.length} itens</Badge>
                </div>
              </div>
              
              {/* Carrossel de recursos da coleção */}
              <Carousel cardWidth={300} gap={24}>
                {collection.resources
                  .sort((a, b) => ((a as any).seriesOrder || 0) - ((b as any).seriesOrder || 0))
                  .map((resource, resourceIndex) => (
                  <ModernCard key={resourceIndex} variant="elevated" className="h-full space-y-4">
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                        <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Badges sobrepostos */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge variant={getTypeColor(resource.type) as any} size="sm" className="flex items-center gap-1">
                          {getTypeIcon(resource.type)}
                          {resource.type}
                        </Badge>
                        {(resource as any).isNew && (
                          <Badge variant="warning" size="sm">Novo</Badge>
                        )}
                        {(resource as any).isFeatured && (
                          <Badge variant="brand" size="sm">Destaque</Badge>
                        )}
                        {(resource as any).series && (
                          <Badge variant="info" size="sm">Vol. {(resource as any).seriesOrder}</Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-medium">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{resource.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">{resource.description}</p>
                        {(resource as any).series && (
                          <p className="text-xs text-brand-accent mt-1 font-medium">{(resource as any).series}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {resource.pages} páginas
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloads.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant="success" size="sm">Disponível</Badge>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => window.open(resource.fileUrl, '_blank')}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Ler
                          </button>
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = resource.fileUrl;
                              link.download = resource.title;
                              link.click();
                            }}
                            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-gray-800 dark:hover:text-dark-text transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Baixar
                          </button>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </Carousel>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}


