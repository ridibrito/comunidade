"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { CardVideoAula } from "@/components/ui/CardModels";
import HeroSection from "@/components/ui/HeroSection";
import ContentCarousel from "@/components/ui/ContentCarousel";
import Card from "@/components/ui/Card";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Play, Clock, Users, BookOpen, Mountain } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { SectionHeading, SectionTitle } from "@/components/ui/SectionHeading";

interface Page {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
}

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  page_id: string;
  position: number;
}

interface Module {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
  position: number;
}

interface Content {
  id: string;
  module_id: string;
  title: string;
  description: string;
  slug: string;
  content_type: string;
  duration: number;
  position: number;
}

interface TrailWithModules {
  id: string;
  title: string;
  description: string;
  slug: string;
  page_id: string;
  position: number;
  modules: ModuleWithContents[];
  badge: string;
  badgeVariant: "info" | "success" | "warning" | "error";
}

interface ModuleWithContents {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
  image_url?: string;
  position: number;
  contents: Content[];
  contentsCount: number;
  totalDuration: number;
  duration: string;
  image: string;
  progress: number;
  difficulty: "Básico" | "Intermediário" | "Avançado";
  rating: number;
}

export default function MontanhaAmanhaPage() {
  const [trails, setTrails] = useState<TrailWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const [modulesProgress, setModulesProgress] = useState<{[key: string]: {percentage: number, completed: number, total: number}}>({});
  const router = useRouter();

  async function loadPageData() {
      try {
        const supabase = createClient();
        
      console.log('🔄 Carregando dados da página Montanha do Amanhã...');
        
      // Buscar a página específica - apenas campos necessários
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id, title, description, slug')
        .eq('slug', 'montanha-do-amanha')
        .single() as { data: Page | null; error: any };
        
      if (pageError || !pageData) {
        console.error('Erro ao carregar página:', pageError);
        return;
      }
        
      // Buscar trilhas da página - apenas campos necessários
        const { data: trailsData, error: trailsError } = await supabase
          .from('trails')
        .select('id, title, description, slug, position, image_url')
        .eq('page_id', pageData.id)
        .order('position') as { data: Trail[] | null; error: any };
        
        if (trailsError) {
          console.error('Erro ao carregar trilhas:', trailsError);
          return;
        }

        if (!trailsData || trailsData.length === 0) {
          setTrails([]);
          return;
        }
        
        // Otimização: buscar todos os módulos de uma vez
        const trailIds = trailsData.map(t => t.id);
        
        if (trailIds.length === 0) {
          setTrails([]);
          return;
        }
        
        // Query com tratamento robusto: usar select('*') para pegar todos os campos disponíveis
        // Isso evita erros se algum campo não existir em produção
        let modulesQuery = supabase
          .from('modules')
          .select('*');
        
        if (trailIds.length === 1) {
          modulesQuery = modulesQuery.eq('trail_id', trailIds[0]);
        } else {
          modulesQuery = modulesQuery.in('trail_id', trailIds);
        }
        
        const { data: allModulesData, error: modulesError } = await modulesQuery.order('position');
            
            if (modulesError) {
              console.error('Erro ao carregar módulos:', modulesError);
              console.error('Detalhes do erro:', JSON.stringify(modulesError, null, 2));
              // Continuar mesmo com erro para não quebrar a página
            }

            // Agrupar módulos por trilha
            const modulesByTrail: { [trailId: string]: any[] } = {};
            (allModulesData || []).forEach((module) => {
              if (!modulesByTrail[module.trail_id]) {
                modulesByTrail[module.trail_id] = [];
              }
              modulesByTrail[module.trail_id].push(module);
            });

            // Otimização: buscar todos os conteúdos de uma vez
            const moduleIds = (allModulesData || []).map(m => m.id);
            let allContentsData: any[] = [];

            if (moduleIds.length > 0) {
              const { data: contentsData, error: contentsError } = await supabase
                .from('contents')
                .select('id, title, description, content_type, duration, slug, video_url, module_id, trail_id, image_url, file_url, position')
                .in('module_id', moduleIds)
                .order('position');

              if (contentsError) {
                console.error('Erro ao carregar conteúdos:', contentsError);
              } else {
                allContentsData = contentsData || [];
              }
            }

            // Agrupar conteúdos por módulo
            const contentsByModule: { [moduleId: string]: any[] } = {};
            allContentsData.forEach((content) => {
              if (content.module_id) {
                if (!contentsByModule[content.module_id]) {
                  contentsByModule[content.module_id] = [];
                }
                contentsByModule[content.module_id].push(content);
              }
            });
        
        // Montar estrutura final
        const trailsWithModules = await Promise.all(
        (trailsData || []).map(async (trail: Trail) => {
            const modulesData = modulesByTrail[trail.id] || [];

          // Para cada módulo, calcular informações
          const modulesWithContents = await Promise.all(
            (modulesData || []).map(async (module: Module) => {
              const contentsData = contentsByModule[module.id] || [];
              
              // Calcular duração total do módulo
              const totalDuration = (contentsData || []).reduce((acc: number, content: Content) => acc + (content.duration || 0), 0);
              const durationHours = Math.floor(totalDuration / 60);
              const durationMinutes = totalDuration % 60;
              const durationString = durationHours > 0 
                ? `${durationHours}h ${durationMinutes}min`
                : `${durationMinutes}min`;
                
                return {
                  ...module,
                contents: contentsData || [], 
                contentsCount: (contentsData || []).length,
                totalDuration,
                duration: durationString,
                  image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=1600&auto=format&fit=crop`,
                  progress: Math.floor(Math.random() * 100),
                difficulty: ["Básico", "Intermediário", "Avançado"][Math.floor(Math.random() * 3)] as "Básico" | "Intermediário" | "Avançado",
                rating: Math.floor(Math.random() * 5) + 1
                };
              })
            );
            
            return {
              ...trail,
            modules: modulesWithContents,
            badge: `${modulesWithContents.length} módulos`,
            badgeVariant: (modulesWithContents.length > 0 ? "success" : "warning") as "info" | "success" | "warning" | "error"
            };
          })
        );
        
        setTrails(trailsWithModules);
        console.log('✅ Dados carregados:', trailsWithModules.length, 'trilhas');

      // Carregar progresso de todos os módulos
      await loadModulesProgress(trailsWithModules, supabase);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    
  // Função para carregar progresso de todos os módulos
  async function loadModulesProgress(trails: TrailWithModules[], supabase: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Coletar todos os IDs de conteúdos de todos os módulos
      const allContentIds: string[] = [];
      const moduleContentsMap: {[moduleId: string]: string[]} = {};

      trails.forEach(trail => {
        trail.modules.forEach(module => {
          const contentIds = module.contents.map(c => c.id);
          moduleContentsMap[module.id] = contentIds;
          allContentIds.push(...contentIds);
        });
      });

      if (allContentIds.length === 0) return;

      // Buscar progresso de todos os conteúdos de uma vez
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('content_id, completion_percentage, is_completed')
        .eq('user_id', user.id)
        .in('content_id', allContentIds);

      if (progressData && progressData.length > 0) {
        const progressMap: {[key: string]: {percentage: number, completed: number, total: number}} = {};

        // Calcular progresso por módulo
        Object.entries(moduleContentsMap).forEach(([moduleId, contentIds]) => {
          const moduleProgress = progressData.filter((p: any) => contentIds.includes(p.content_id));
          const completed = moduleProgress.filter((p: any) => p.is_completed).length;
          const total = contentIds.length;
          const avgPercentage = total > 0 
            ? Math.floor(moduleProgress.reduce((sum: number, p: any) => sum + p.completion_percentage, 0) / total)
            : 0;

          progressMap[moduleId] = {
            percentage: avgPercentage,
            completed,
            total
          };
        });

        setModulesProgress(progressMap);
        console.log('✅ Progresso dos módulos carregado:', progressMap);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso dos módulos:', error);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  // Recarregar dados quando a página ganha foco (volta do admin)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Página ganhou foco, recarregando dados...');
      loadPageData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Função para recarregar dados manualmente
  const reloadData = () => {
    setLoading(true);
    setTrails([]);
    loadPageData();
  };

  // Função para navegar para o módulo
  const handleModuleClick = (moduleSlug: string) => {
    router.push(`/catalog/modulo/${moduleSlug}`);
  };

  if (loading) {
    return (
      <Container fullWidth>
        <HeroCarousel pageSlug="montanha-do-amanha" />
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
      {/* Hero Carousel - Banner dinâmico */}
      <HeroCarousel pageSlug="montanha-do-amanha" />

      <Section>
        <div className="pt-0 px-0">
          <SectionTitle title="Montanha do Amanhã" icon={Mountain} className="mb-2" />
          <p className="text-light-muted dark:text-dark-muted text-lg mb-6">Trilhas educacionais para desenvolvimento integral</p>
        </div>
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
                  Atualizar Dados
                </button>
              </div>
            </div>
          ) : (
            trails.map((trail) => (
              <div key={trail.id} className="space-y-6">
                {/* Título da Trilha */}
                <div className="text-left">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 space-y-2">
                      <SectionHeading title={trail.title} />
                      <p className="text-light-muted dark:text-dark-muted">
                        {trail.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-white border-light-border dark:border-dark-border">
                      {trail.badge}
                    </Badge>
                </div>
              </div>
              
                {/* Carrossel de Módulos */}
                {trail.modules.length > 0 && (
                  <ContentCarousel>
                    {trail.modules.map((module: ModuleWithContents, moduleIndex: number) => (
                      <div 
                        key={module.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden rounded-lg"
                        onClick={() => handleModuleClick(module.slug)}
                      >
                        {/* Imagem de fundo - CARD VERTICAL RESPONSIVO */}
                        <div className="relative w-full h-96 bg-gradient-to-br from-orange-500 to-orange-600">
                          <img 
                            src={module.image_url || module.image} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay escuro para legibilidade do texto */}
                          <div className="absolute inset-0 bg-black/40"></div>
                          
                          {/* Título do módulo e progresso no overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-semibold text-lg leading-tight mb-2">
                              {module.title}
                            </h3>
                            
                            {/* Barra de progresso do módulo */}
                            {modulesProgress[module.id] && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-white/90 mb-1">
                                  <span>{modulesProgress[module.id].completed}/{modulesProgress[module.id].total} concluídas</span>
                                  <span>{modulesProgress[module.id].percentage}%</span>
                                </div>
                                <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-white h-full transition-all duration-300 shadow-lg"
                                    style={{ width: `${modulesProgress[module.id].percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ContentCarousel>
                )}
            </div>
            ))
          )}
        </div>
      </Section>
    </Container>
  );
}
