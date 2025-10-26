// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContentCarousel from "@/components/ui/ContentCarousel";
import Card from "@/components/ui/Card";
import { CardLivro } from "@/components/ui/CardModels";
import { HeroCarousel } from "@/components/HeroCarousel";
import { createClient } from "@/lib/supabase";

interface Page {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  position: number;
  modules: Module[];
  directContents?: Content[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  slug: string;
  position: number;
  contents: Content[];
}

interface Content {
  id: string;
  title: string;
  description: string;
  content_type: string;
  duration: number;
  slug?: string;
  video_url?: string;
  module_id?: string | null;
  trail_id?: string | null;
}

export default function AcervoDigitalPage() {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [modulesProgress, setModulesProgress] = useState<{[key: string]: {percentage: number, completed: number, total: number}}>({});
  const router = useRouter();

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

  async function loadPageData() {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Buscar dados da página
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'acervo-digital')
        .single();

      if (pageError || !pageData) {
        console.error('Erro ao carregar página:', pageError);
        return;
      }

      setPageData(pageData);

      // Buscar trilhas da página
      const { data: trailsData, error: trailsError } = await supabase
        .from('trails')
        .select('*')
        .eq('page_id', pageData.id)
        .order('position');

      if (trailsError) {
        console.error('Erro ao carregar trilhas:', trailsError);
        return;
      }

      // Para cada trilha, buscar seus módulos e conteúdos diretos (sem módulo)
      const trailsWithModules = await Promise.all(
        (trailsData || []).map(async (trail) => {
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .eq('trail_id', trail.id)
            .order('position');

          if (modulesError) {
            console.error('Erro ao carregar módulos:', modulesError);
            return { ...trail, modules: [] };
          }

          // Para cada módulo, buscar seus conteúdos
          const modulesWithContents = await Promise.all(
            (modulesData || []).map(async (module) => {
              const { data: contentsData, error: contentsError } = await supabase
                .from('contents')
                .select('*')
                .eq('module_id', module.id)
                .eq('status', 'published')
                .order('position');

              if (contentsError) {
                console.error('Erro ao carregar conteúdos:', contentsError);
                return { ...module, contents: [] };
              }

              return { ...module, contents: contentsData || [] };
            })
          );

          // Buscar conteúdos diretos por trilha (sem módulo)
          const { data: directContents, error: directError } = await supabase
            .from('contents')
            .select('*')
            .eq('trail_id', trail.id)
            .is('module_id', null)
            .eq('status', 'published')
            .order('position');

          if (directError) {
            console.error('Erro ao carregar conteúdos diretos:', directError);
          }

          return { ...trail, modules: modulesWithContents, directContents: directContents || [] };
        })
      );

      setTrails(trailsWithModules);
      
      // Carregar progresso dos módulos
      await loadModulesProgress(trailsWithModules, supabase);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // Função para carregar progresso de todos os módulos
  async function loadModulesProgress(trails: Trail[], supabase: any) {
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

  const handleModuleClick = (moduleSlug: string) => {
    router.push(`/catalog/modulo/${moduleSlug}`);
  };

  if (loading) {
    return (
      <Container fullWidth>
        <Section>
          <PageHeader title="Acervo Digital" subtitle="Carregando..." />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </Section>
      </Container>
    );
  }

  if (!pageData) {
    return (
      <Container fullWidth>
        <Section>
          <PageHeader title="Acervo Digital" subtitle="Página não encontrada" />
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      {/* Hero Carousel - Banner dinâmico */}
      <HeroCarousel pageSlug="acervo-digital" />
      
      <Section>
        <PageHeader 
          title={pageData.title} 
          subtitle={pageData.description} 
        />
        
        {trails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-dark-muted">
              <h3 className="text-lg font-medium mb-2">Nenhum conteúdo disponível</h3>
              <p className="text-sm mb-4">O acervo digital será atualizado em breve.</p>
              <button 
                onClick={reloadData}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Atualizar Dados
              </button>
            </div>
          </div>
        ) : (
        <div className="space-y-12">
            {trails.map((trail) => (
              <div key={trail.id} className="space-y-6">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                    {trail.title}
                  </h2>
                  <p className="text-light-muted dark:text-dark-muted">
                    {trail.description}
                    </p>
              </div>
              
                {/* Conteúdos diretos por trilha (sem módulos) */}
                {trail.directContents && trail.directContents.length > 0 && (
                  <>
                    {/* Carrossel para livros */}
                    {trail.directContents.some((c) => c.content_type === 'book') && (
                      <ContentCarousel>
                        {trail.directContents.filter((c) => c.content_type === 'book').map((content) => (
                          <CardLivro
                            key={content.id}
                            title={content.title}
                            author={"Autor"}
                            description={content.description || ""}
                            pages={content.duration || 0}
                            image={content.image_url || "/logo_full.png"}
                            fileUrl={(content as any).file_url || "#"}
                            id={content.id}
                            className="w-full"
                          />
                        ))}
                      </ContentCarousel>
                    )}

                    {/* Cards padrão (vídeo/arquivo) com mesma largura das demais seções */}
                    {trail.directContents.some((c) => c.content_type !== 'book') && (
                      <ContentCarousel className="w-full mt-6">
                        {trail.directContents.filter((c) => c.content_type !== 'book').map((content) => (
                          <Card
                            key={content.id}
                            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 h-96 flex flex-col"
                            onClick={() => router.push(`/catalog/aula/${content.id}`)}
                          >
                            <div
                              className="flex-1 rounded-t-lg relative overflow-hidden"
                              style={{
                                backgroundImage: (content as any).image_url ? `url(${(content as any).image_url})` : (trail && (trail as any).image_url ? `url(${(trail as any).image_url})` : undefined),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="absolute inset-0 bg-black/20" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-semibold text-lg leading-tight">
                                  {content.title}
                                </h3>
                              </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <p className="text-sm text-light-muted dark:text-dark-muted line-clamp-2">
                                {content.description}
                              </p>
                              <div className="mt-2 text-xs text-light-muted dark:text-dark-muted">
                                {content.duration || 0} min • {content.content_type}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </ContentCarousel>
                    )}
                  </>
                )}

                {trail.modules.length > 0 && (
                  <ContentCarousel>
                    {trail.modules.map((module) => (
                      <div 
                        key={module.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden rounded-lg"
                        onClick={() => handleModuleClick(module.slug)}
                      >
                        {/* Imagem de fundo - CARD VERTICAL RESPONSIVO */}
                        <div className="relative w-full h-96 bg-gradient-to-br from-orange-500 to-orange-600">
                          <img 
                            src={module.image_url || "/logo_full.png"} 
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
          ))}
        </div>
        )}
      </Section>
    </Container>
  );
}
