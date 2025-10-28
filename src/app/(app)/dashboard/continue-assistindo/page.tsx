"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContentCarousel from "@/components/ui/ContentCarousel";
import { CardVideoAula, CardLivro } from "@/components/ui/CardModels";
import { ArrowLeft, Play, Mountain, HelpCircle, Mic, Library } from "lucide-react";

// Configuração de badges por página
const PAGE_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'brand' | 'success' | 'warning' | 'error' }> = {
  'montanha-do-amanha': { label: 'Montanha do Amanhã', variant: 'brand' },
  'acervo-digital': { label: 'Acervo Digital', variant: 'success' },
  'plantao-de-duvidas': { label: 'Plantão de Dúvidas', variant: 'warning' },
  'rodas-de-conversa': { label: 'Rodas de Conversa', variant: 'error' }
};

// Ordem fixa das categorias conforme solicitado
const CATEGORY_ORDER = [
  'montanha-do-amanha',
  'plantao-de-duvidas', 
  'rodas-de-conversa',
  'acervo-digital'
];

// Ícones específicos para cada categoria (mesmos do menu)
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'montanha-do-amanha': Mountain,
  'plantao-de-duvidas': HelpCircle,
  'rodas-de-conversa': Mic,
  'acervo-digital': Library
};

interface ContentWithProgress {
  id: string;
  title: string;
  description: string;
  duration: number;
  content_type: string;
  slug: string;
  image_url: string;
  file_url: string;
  progress: number;
  lastWatched: string;
  origin: {
    slug: string;
    label: string;
    badge: { label: string; variant: string };
  };
}

interface GroupedContents {
  [key: string]: ContentWithProgress[];
}

export default function ContinueAssistindoPage() {
  const router = useRouter();
  const [groupedContents, setGroupedContents] = useState<GroupedContents>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContinueContents = async () => {
      try {
        const supabase = createClient();
        
        // Buscar progresso real do usuário
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setGroupedContents({});
          return;
        }

        // Buscar conteúdos com progresso iniciado (entre 1% e 99%)
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            content_id,
            completion_percentage,
            is_completed,
            updated_at,
            content:contents!content_id (
              id,
              title,
              description,
              duration,
              content_type,
              slug,
              image_url,
              file_url,
              created_at,
              module_id,
              trail_id,
              modules:modules (
                id,
                slug,
                title,
                trails:trails (
                  id,
                  slug,
                  title,
                  pages:pages (
                    id,
                    slug,
                    title
                  )
                )
              ),
              trails:trails (
                id,
                slug,
                title,
                pages:pages (
                  id,
                  slug,
                  title
                )
              )
            )
          `)
          .eq('user_id', user.id)
          .gt('completion_percentage', 0)
          .lt('completion_percentage', 100)
          .order('updated_at', { ascending: false });

        if (progressError) {
          console.error('Erro ao carregar progresso:', progressError);
          setGroupedContents({});
          return;
        }

        const mapped = (progressData || [])
          .filter((item: any) => item.content)
          .map((item: any) => {
            const content = item.content;
            const page = content?.modules?.trails?.pages || content?.trails?.pages;
            const pageSlug: string | undefined = page?.slug;
            const pageTitle: string | undefined = page?.title || content?.modules?.trails?.title || content?.trails?.title;
            const badgeCfg = (pageSlug && PAGE_BADGE[pageSlug]) ? PAGE_BADGE[pageSlug] : { label: pageTitle || 'Conteúdo', variant: 'outline' as const };
            const image = content.image_url || '/logo_full.png';
            
            return {
              ...content,
              image,
              progress: item.completion_percentage,
              lastWatched: item.updated_at,
              origin: {
                slug: pageSlug,
                label: badgeCfg.label,
                badge: badgeCfg
              }
            };
          });

        // Agrupar por categoria/trilha
        const grouped: GroupedContents = {};
        mapped.forEach((content: ContentWithProgress) => {
          const category = content.origin.slug || 'outros';
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(content);
        });

        setGroupedContents(grouped);
      } catch (error) {
        console.error('Erro ao carregar conteúdos para continuar:', error);
        setGroupedContents({});
      } finally {
        setLoading(false);
      }
    };

    loadContinueContents();
  }, []);

  const getCategoryTitle = (categorySlug: string) => {
    return PAGE_BADGE[categorySlug]?.label || categorySlug;
  };

  const getCategoryIcon = (categorySlug: string) => {
    const IconComponent = CATEGORY_ICONS[categorySlug] || Play;
    return <IconComponent className="w-5 h-5 text-brand-accent" />;
  };

  const totalContents = Object.values(groupedContents).reduce((sum, contents) => sum + contents.length, 0);

  if (loading) {
    return (
      <Container fullWidth>
        <Section>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-dark-muted">Carregando conteúdos...</p>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (totalContents === 0) {
    return (
      <Container fullWidth>
        <Section>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Nenhum conteúdo iniciado
            </h3>
            <p className="text-light-muted dark:text-dark-muted mb-6">
              Você ainda não começou a assistir nenhum conteúdo. Explore nossa plataforma e comece seus estudos!
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors"
            >
              <Play className="w-4 h-4" />
              Explorar Conteúdos
            </button>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      <Section>
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-light-text dark:text-dark-text" />
            </button>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
              Continue Assistindo
            </h1>
          </div>
          <p className="text-light-muted dark:text-dark-muted">
            {totalContents} conteúdo{totalContents !== 1 ? 's' : ''} iniciado{totalContents !== 1 ? 's' : ''} em {Object.keys(groupedContents).length} categoria{Object.keys(groupedContents).length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Conteúdos agrupados por categoria */}
        <div className="space-y-8">
          {CATEGORY_ORDER.filter(categorySlug => groupedContents[categorySlug] && groupedContents[categorySlug].length > 0).map((categorySlug) => {
            const contents = groupedContents[categorySlug];
            return (
            <div key={categorySlug}>
              <div className="flex items-center gap-3 mb-6">
                {getCategoryIcon(categorySlug)}
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {getCategoryTitle(categorySlug)}
                </h2>
                <span className="text-sm text-light-muted dark:text-dark-muted">
                  ({contents.length} conteúdo{contents.length !== 1 ? 's' : ''})
                </span>
              </div>

              <ContentCarousel>
                {contents.map((content: ContentWithProgress) => {
                  // Card para livros usando componente existente
                  if (content.content_type === 'book') {
                    return (
                      <CardLivro
                        key={content.id}
                        title={content.title}
                        author="Autor"
                        description={content.description || ""}
                        pages={content.duration || 0}
                        image={content.image_url || "/logo_full.png"}
                        fileUrl={content.file_url || "#"}
                        id={content.id}
                        className="w-full"
                      />
                    );
                  }

                  // Card para vídeos/aulas usando componente existente
                  return (
                    <CardVideoAula
                      key={content.id}
                      title={content.title}
                      description={content.description || ""}
                      instructor="Instrutor"
                      duration={`${content.duration || 0}min`}
                      lessons={1}
                      progress={content.progress}
                      image={content.image_url || "/logo_full.png"}
                      slug={content.slug}
                      className="w-full"
                    />
                  );
                })}
              </ContentCarousel>
            </div>
            );
          })}
        </div>
      </Section>
    </Container>
  );
}
