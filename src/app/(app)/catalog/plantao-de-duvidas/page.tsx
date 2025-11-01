"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ContentCarousel from "@/components/ui/ContentCarousel";
import Card from "@/components/ui/Card";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeading, SectionTitle } from "@/components/ui/SectionHeading";
import { HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Helper para remover tags HTML e obter texto puro
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

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
}

export default function PlantaoDeDuvidasPage() {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function loadPageData() {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Buscar dados da página - apenas campos necessários
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id, title, description, slug')
        .eq('slug', 'plantao-de-duvidas')
        .single();

      if (pageError || !pageData) {
        console.error('Erro ao carregar página:', pageError);
        // Usar dados mockados se não encontrar a página
        setPageData({
          id: 'mock-page',
          title: 'Plantão de Dúvidas',
          description: 'Tire suas dúvidas com especialistas em AHSD',
          slug: 'plantao-de-duvidas'
        } as any);
      } else {
        setPageData(pageData);
      }

      // Buscar trilhas da página
      if (pageData) {
        const page = pageData as any;
        if (page.id) {
          const { data: trailsData, error: trailsError } = await supabase
            .from('trails')
            .select('id, title, description, slug, position, image_url')
            .eq('page_id', page.id)
            .order('position');

          if (trailsError) {
            console.error('Erro ao carregar trilhas:', trailsError);
            return;
          }

          if (!trailsData || trailsData.length === 0) {
            return;
          }

          // Otimização: buscar todos os módulos de uma vez
          const trailIds = trailsData.map(t => t.id);
          
          if (trailIds.length === 0) {
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
            return;
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
          const trailsWithModules = trailsData.map((trail: any) => {
            const modulesData = modulesByTrail[trail.id] || [];
            const modulesWithContents = modulesData.map((module: any) => ({
              ...module,
              contents: contentsByModule[module.id] || []
            }));
            
            return { ...trail, modules: modulesWithContents };
          });

          setTrails(trailsWithModules);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleModuleClick = (moduleSlug: string) => {
    router.push(`/catalog/modulo/${moduleSlug}`);
  };

  return (
    <Container fullWidth>
      {/* Banner */}
      <HeroCarousel pageSlug="plantao-de-duvidas" />

      <Section>
        <SectionTitle title="Plantão de Dúvidas" icon={HelpCircle} className="mb-2" />
        {pageData && <p className="text-light-muted dark:text-dark-muted text-lg mb-6">{pageData.description}</p>}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
            <p className="text-light-muted dark:text-dark-muted">Carregando...</p>
          </div>
        ) : trails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-dark-muted">
              <h3 className="text-lg font-medium mb-2">Nenhum plantão disponível</h3>
              <p className="text-sm">Os plantões de dúvidas serão agendados em breve.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {trails.map((trail) => (
              <div key={trail.id} className="space-y-6">
                <div className="text-left">
                  <SectionHeading title={trail.title} />
                  <p className="text-light-muted dark:text-dark-muted">{trail.description}</p>
                </div>

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
                          {(module as any).cover_url || (module as any).image_url ? (
                            <img 
                              src={(module as any).cover_url || (module as any).image_url} 
                              alt={module.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                          {/* Overlay escuro para legibilidade do texto */}
                          <div className="absolute inset-0 bg-black/40"></div>
                          
                          {/* Título do módulo no overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-semibold text-lg leading-tight">
                              {module.title}
                            </h3>
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
