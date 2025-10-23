"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/CarouselNew";
import Card from "@/components/ui/Card";
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
      
      // Buscar dados da página
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'rodas-de-conversa')
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

      // Para cada trilha, buscar seus módulos
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
                .order('position');

              if (contentsError) {
                console.error('Erro ao carregar conteúdos:', contentsError);
                return { ...module, contents: [] };
              }

              return { ...module, contents: contentsData || [] };
            })
          );

          return { ...trail, modules: modulesWithContents };
        })
      );

      setTrails(trailsWithModules);
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
          <PageHeader title="Rodas de Conversa" subtitle="Carregando..." />
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
          <PageHeader title="Rodas de Conversa" subtitle="Página não encontrada" />
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title={pageData.title} 
          subtitle={pageData.description} 
        />
        
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
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                    {trail.title}
                </h2>
                  <p className="text-light-muted dark:text-dark-muted">
                    {trail.description}
                </p>
            </div>
            
                {trail.modules.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                      {trail.modules.map((module) => (
                        <CarouselItem key={module.id} className="pl-4 basis-full sm:basis-[300px] lg:basis-[350px]">
                          <Card
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
                              <p className="text-sm text-light-muted dark:text-dark-muted line-clamp-2">
                                {module.description}
                              </p>
                              <div className="mt-2 text-xs text-light-muted dark:text-dark-muted">
                                {module.contents.length} {module.contents.length === 1 ? 'sessão' : 'sessões'}
              </div>
            </div>
                          </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
                )}
            </div>
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}
