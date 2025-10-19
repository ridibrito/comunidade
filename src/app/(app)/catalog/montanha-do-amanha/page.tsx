"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import ProgressCard from "@/components/ui/ProgressCard";
import Carousel from "@/components/ui/Carousel";
import CarouselSection from "@/components/ui/CarouselSection";
import { BookOpen, Play, Clock, Star } from "lucide-react";

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
          img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
          description: "Desenvolvimento intelectual e habilidades mentais",
          lessons: 8,
          duration: "2h 30min",
          progress: 75,
          difficulty: "Intermediário"
        },
        { 
          title: "Aspectos Socioemocionais", 
          slug: "/catalog/modulo/aspectos-socioemocionais", 
          img: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
          description: "Inteligência emocional e relacionamentos",
          lessons: 6,
          duration: "1h 45min",
          progress: 45,
          difficulty: "Básico"
        },
        { 
          title: "Rotina e Organização", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
          description: "Estruturação do dia a dia",
          lessons: 5,
          duration: "1h 20min",
          progress: 0,
          difficulty: "Básico"
        },
        { 
          title: "Desenvolvimento Motor", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
          description: "Coordenação e habilidades físicas",
          lessons: 7,
          duration: "2h 15min",
          progress: 20,
          difficulty: "Intermediário"
        },
        { 
          title: "Criatividade", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          description: "Expressão artística e inovação",
          lessons: 9,
          duration: "3h 00min",
          progress: 0,
          difficulty: "Avançado"
        },
        { 
          title: "Interesses Específicos", 
          slug: "#", 
          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
          description: "Aprofundamento em áreas de interesse",
          lessons: 12,
          duration: "4h 30min",
          progress: 0,
          difficulty: "Avançado"
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
          difficulty: "Básico",
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
          difficulty: "Intermediário",
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
          difficulty: "Básico",
          rating: 4.7
        }
      ]
    }
  ];


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico": return "success";
      case "Intermediário": return "warning";
      case "Avançado": return "error";
      default: return "default";
    }
  };

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
              <div 
                className="relative pt-8 pb-0 flex items-center" // Padding superior apenas
                style={{
                  width: '100vw', // Largura total da tela
                  marginLeft: '0', // Começar da esquerda
                  paddingLeft: '0', // Cards alinhados à esquerda da div azul
                  paddingRight: '0'
                }}
              >
                <Carousel cardWidth={320} gap={24}>
                {trail.modules.map((module, moduleIndex) => (
                  <ModernCard key={moduleIndex} variant="elevated" className="h-full space-y-4">
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                        <img src={module.img} alt={module.title} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Badges sobrepostos */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {(module as any).isNew && (
                          <Badge variant="warning" size="sm">Novo</Badge>
                        )}
              </div>
                      
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {module.progress > 0 && (
                          <Badge variant="success" size="sm">{module.progress}%</Badge>
                        )}
                        {(module as any).rating && (
                          <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-medium">{(module as any).rating}</span>
              </div>
                        )}
            </div>
          </div>

                    <div className="space-y-3 flex-1">
          <div>
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">{module.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {module.lessons} {module.lessons === 1 ? 'aula' : 'aulas'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </div>
                      </div>
                      
                      {module.progress > 0 && (
                        <ProgressCard
                          title="Progresso"
                          progress={module.progress}
                          color="brand"
                          size="sm"
                          showPercentage={true}
                        />
                      )}
                      
                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant={getDifficultyColor(module.difficulty) as any} size="sm">
                          {module.difficulty}
                        </Badge>
                        <Link 
                          href={module.slug}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
                        >
                          {module.progress > 0 ? "Continuar" : "Começar"}
                          <Play className="w-3 h-3" />
                        </Link>
                </div>
              </div>
                  </ModernCard>
                ))}
                </Carousel>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}


