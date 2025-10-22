"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { CardVideoAula } from "@/components/ui/CardModels";
import HeroSection from "@/components/ui/HeroSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/CarouselNew";
import { createClient } from "@/lib/supabase";

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  mountain_id: string;
}

interface Module {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
}

export default function MontanhaAmanhaPage() {
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrailsData() {
      try {
        const supabase = createClient();
        
        // Forçar atualização sem cache
        console.log('🔄 Carregando dados das trilhas...');
        
        // Buscar trilhas
        const { data: trailsData, error: trailsError } = await supabase
          .from('trails')
          .select('*');
        
        if (trailsError) {
          console.error('Erro ao carregar trilhas:', trailsError);
          return;
        }
        
        // Para cada trilha, buscar seus módulos
        const trailsWithModules = await Promise.all(
          (trailsData || []).map(async (trail) => {
            const { data: modulesData, error: modulesError } = await supabase
              .from('modules')
              .select('*')
              .eq('trail_id', trail.id);
            
            if (modulesError) {
              console.error('Erro ao carregar módulos:', modulesError);
              return { ...trail, modules: [] };
            }
            
            // Para cada módulo, buscar suas aulas
            const modulesWithLessons = await Promise.all(
              (modulesData || []).map(async (module) => {
                const { data: lessonsData, error: lessonsError } = await supabase
                  .from('lessons')
                  .select('*')
                  .eq('module_id', module.id);
                
                if (lessonsError) {
                  console.error('Erro ao carregar aulas:', lessonsError);
                  return { ...module, lessons: [] };
                }
                
                return {
                  ...module,
                  lessons: lessonsData || [],
                  lessonsCount: (lessonsData || []).length,
                  slug: `/catalog/modulo/${module.slug}`,
                  image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=1600&auto=format&fit=crop`,
                  duration: "1h 30min", // Mock duration
                  progress: Math.floor(Math.random() * 100),
                  difficulty: ["Básico", "Intermediário", "Avançado"][Math.floor(Math.random() * 3)] as const,
                  rating: 4.5 + Math.random() * 0.5
                };
              })
            );
            
            return {
              ...trail,
              modules: modulesWithLessons,
              badge: `${modulesWithLessons.length} módulos`,
              badgeVariant: "info" as const
            };
          })
        );
        
        setTrails(trailsWithModules);
        console.log('✅ Dados carregados:', trailsWithModules.length, 'trilhas');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadTrailsData();
  }, []);

  // Função para recarregar dados manualmente
  const reloadData = () => {
    setLoading(true);
    setTrails([]);
    window.location.reload();
  };

  if (loading) {
    return (
      <Container fullWidth>
        <HeroSection 
          pageSlug="montanha-do-amanha"
          fallbackTitle="MONTANHA DO AMANHÃ"
          fallbackSubtitle="Desenvolva suas habilidades de identificação e compreensão das características AHSD através de uma jornada educativa completa e transformadora."
        />
        <Section>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-dark-muted">Carregando trilhas...</p>
            </div>
          </div>
        </Section>
      </Container>
    );
  }



  return (
    <Container fullWidth>
      {/* Hero Section - Agora dinâmico */}
      <HeroSection 
        pageSlug="montanha-do-amanha"
        fallbackTitle="MONTANHA DO AMANHÃ"
        fallbackSubtitle="Desenvolva suas habilidades de identificação e compreensão das características AHSD através de uma jornada educativa completa e transformadora."
      />

      <Section>
        <div className="space-y-12">
          {/* Verificar se há trilhas */}
          {trails.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-dark-muted">
                <h3 className="text-lg font-medium mb-2">Nenhuma trilha disponível</h3>
                <p className="text-sm mb-4">As trilhas serão adicionadas em breve pela equipe administrativa.</p>
                <button 
                  onClick={reloadData}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Atualizar Página
                </button>
              </div>
            </div>
          ) : (
            /* Renderização dinâmica de todas as trilhas */
            trails.map((trail, trailIndex) => (
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
                          instructor="Instrutor"
                          duration={module.duration}
                          lessons={module.lessonsCount}
                          progress={module.progress}
                          rating={module.rating}
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
            ))
          )}
        </div>
      </Section>
    </Container>
  );
}


