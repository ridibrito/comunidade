"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ContentCarousel from "@/components/ui/ContentCarousel";
import Card from "@/components/ui/Card";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeading, SectionTitle } from "@/components/ui/SectionHeading";
import { Mic } from "lucide-react";
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

export default function RodasDeConversaPage() {
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
        .eq('slug', 'rodas-de-conversa')
        .single();

      if (pageError || !pageData) {
        console.error('Erro ao carregar página:', pageError);
        return;
      }

      setPageData(pageData);

      // Buscar trilhas da página
      if (pageData) {
        const page = pageData as any;
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
        const { data: allModulesData, error: modulesError } = await supabase
          .from('modules')
          .select('id, title, description, slug, position, trail_id, image_url')
          .in('trail_id', trailIds)
          .order('position');

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
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleModuleClick = (moduleSlug: string) => {
    router.push(`/catalog/modulo/${moduleSlug}`);
  };

  if (loading) {
    return (
      <Container fullWidth>
        <Section>
          <div className="pt-0 px-0">
            <SectionTitle title="Rodas de Conversa" icon={Mic} className="mb-2" />
            <p className="text-light-muted dark:text-dark-muted text-lg mb-6">Carregando...</p>
          </div>
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
          <SectionTitle title="Rodas de Conversa" icon={Mic} className="mb-2" />
          <p className="text-light-muted dark:text-dark-muted text-lg">Página não encontrada</p>
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      {/* Hero Carousel - Banner dinâmico */}
      <HeroCarousel pageSlug="rodas-de-conversa" />
      
      <Section>
        <SectionTitle title={pageData.title} icon={Mic} className="mb-2" />
        <p className="text-light-muted dark:text-dark-muted text-lg mb-6">{pageData.description}</p>
        
        {trails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-dark-muted">
              <h3 className="text-lg font-medium mb-2">Nenhum evento disponível</h3>
              <p className="text-sm">As rodas de conversa serão agendadas em breve.</p>
            </div>
          </div>
        ) : (
        <div className="space-y-12">
            {trails.map((trail) => (
              <div key={trail.id} className="space-y-6">
                <div className="text-left">
                  <SectionHeading title={trail.title} />
                  <p className="text-light-muted dark:text-dark-muted">
                    {trail.description}
                  </p>
            </div>
            
                {trail.modules.length > 0 && (
                  <ContentCarousel>
                    {trail.modules.map((module) => (
                      <Card
                        key={module.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 h-96 flex flex-col"
                        onClick={() => handleModuleClick(module.slug)}
                      >
                        <div className="flex-1 bg-gradient-to-br from-green-500 to-green-600 rounded-t-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-semibold text-lg leading-tight">
                              {module.title}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div 
                            className="text-sm text-light-muted dark:text-dark-muted line-clamp-2
                              [&_p]:mb-0 [&_p:last-child]:mb-0
                              [&_strong]:font-semibold
                              [&_em]:italic
                              [&_br]:block"
                            style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                            dangerouslySetInnerHTML={{ __html: module.description }}
                          />
                          <div className="mt-2 text-xs text-light-muted dark:text-dark-muted">
                            {module.contents.length} {module.contents.length === 1 ? 'sessão' : 'sessões'}
                          </div>
                        </div>
                      </Card>
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
