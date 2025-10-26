"use client";

// Usando dados reais do Supabase
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { Play } from "lucide-react";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import ContentCarousel from "@/components/ui/ContentCarousel";
import { CardVideoAula, CardLivro } from "@/components/ui/CardModels";

import { useRouter } from "next/navigation";

// Tipos para o conteúdo
interface Content {
  id: string;
  title: string;
  description: string;
  duration: number;
  slug: string;
  video_url: string;
  materials_url?: string;
  created_at: string;
  module_id: string;
  image_url?: string;
  image?: string;
  content_type: 'video' | 'livro' | 'artigo';
  progress?: number;
  lastWatched?: string;
  trail_id?: string;
  modules?: {
    id: string;
    slug: string;
    title: string;
    trail_id?: string;
    trails?: {
      id: string;
      slug: string;
      title: string;
      pages?: {
        id: string;
        slug: string;
        title: string;
      };
    };
  };
}

// Configuração de badges por página
const PAGE_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'brand' | 'success' | 'warning' | 'error' }> = {
  'montanha-do-amanha': { label: 'Montanha do Amanhã', variant: 'brand' },
  'acervo-digital': { label: 'Acervo Digital', variant: 'success' },
  'plantao-de-duvidas': { label: 'Plantão de Dúvidas', variant: 'warning' },
  'rodas-de-conversa': { label: 'Rodas de Conversa', variant: 'error' }
};

export default function DashboardPage() {
  const { push } = useToast();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  type Kid = { id: string; name: string; avatar?: string | null; anamnese?: number; routineToday?: { done: number; total: number }; lessonsDone?: number; lastDiary?: string };
  const [children, setChildren] = useState<Kid[]>([]);
  const [selectedChild, setSelectedChild] = useState<Kid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestContents, setLatestContents] = useState<Content[]>([]);
  const [loadingLatest, setLoadingLatest] = useState<boolean>(true);
  const [continueContents, setContinueContents] = useState<Content[]>([]);
  const [loadingContinue, setLoadingContinue] = useState<boolean>(true);

  // Verificar se há erro de acesso negado
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'access_denied') {
      push({
        title: "Acesso Negado",
        message: "Você não tem permissão para acessar a área administrativa. Apenas administradores podem acessar essa área.",
        variant: "error"
      });
      // Limpar o parâmetro da URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [push]);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: profile } = await (supabase.from("profiles").select("full_name, avatar_url").eq("id", uid).maybeSingle() as unknown as { data: { full_name?: string; avatar_url?: string | null } | null });
      if (profile?.full_name) setDisplayName(profile.full_name);
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      else if (userData.user?.user_metadata?.avatar_url) setAvatarUrl(userData.user.user_metadata.avatar_url);

      // parceiro(a): busca primeiro membro de família com relationship 'Cônjuge'
      const { data: fams } = await (supabase
        .from("family_members")
        .select("name, relationship, avatar_url")
        .eq("user_id", uid)
        .eq("relationship", "Cônjuge") // Filtro para parceiro(a)
        .order("created_at", { ascending: true })
        .limit(1) as unknown as { data: Array<{ name?: string | null; avatar_url?: string | null }> | null });
      if (fams && fams.length > 0) {
        setPartnerName(fams[0].name ?? null);
        setPartnerAvatarUrl(fams[0].avatar_url ?? null);
      }

      // filhos dinâmicos
      const { data: kids } = await supabase
        .from("children")
        .select("id, name, birth_date, avatar_url")
        .eq("user_id", uid);
      if (kids) {
        const mapped = kids.map((k: { id: string; name: string; avatar_url?: string | null }) => ({ id: k.id, name: k.name, avatar: k.avatar_url ?? null }));
        setChildren(mapped);
      }
    })();
  }, []);

  // Conteúdos iniciados pelo usuário (para seção Continue de onde parou)
  useEffect(() => {
    const loadContinueContents = async () => {
      try {
        const supabase = getBrowserSupabaseClient();
        
        // Buscar progresso real do usuário
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setContinueContents([]);
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
              slug,
              video_url,
              materials_url,
              created_at,
              module_id,
              image_url,
              modules:modules (
                id,
                slug,
                title,
                trail_id,
                slug,
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
            )
          `)
          .eq('user_id', user.id)
          .gt('completion_percentage', 0)
          .lt('completion_percentage', 100)
          .order('updated_at', { ascending: false })
          .limit(8);

        if (progressError) {
          console.error('Erro ao carregar progresso do usuário:', progressError);
          setContinueContents([]);
          return;
        }

        const mapped = (progressData || [])
          .filter((item: any) => item.content) // Filtrar apenas conteúdos válidos
          .map((item: any): Content => {
            const content = item.content;
            const image = content.image_url || '/logo_full.png';
            
            return {
              ...content,
              trail_id: content.modules?.trail_id,
              image,
              content_type: content.content_type || 'video',
              progress: item.completion_percentage,
              lastWatched: item.updated_at
            };
          });

        setContinueContents(mapped);
      } catch (error) {
        console.error('Erro ao carregar conteúdos para continuar:', error);
        setContinueContents([]);
      } finally {
        setLoadingContinue(false);
      }
    };

    loadContinueContents();
  }, []);

  // Últimos conteúdos publicados (para seção Novidades)
  useEffect(() => {
    const loadLatestContents = async () => {
      try {
        const supabase = getBrowserSupabaseClient();
        const { data, error } = await supabase
          .from('contents')
          .select(`
            id,
            title,
            description,
            duration,
            slug,
            video_url,
            materials_url,
            file_url,
            content_type,
            created_at,
            module_id,
            image_url,
            modules:modules (
              id,
              slug,
              title,
              trail_id,
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
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Erro ao carregar últimos conteúdos:', error);
          setLatestContents([]);
          return;
        }

        const mapped = (data || []).map((c: any): Content => {
          const image = c.image_url || '/logo_full.png';
          
          return {
            ...c,
            trail_id: c.modules?.trail_id,
            image,
            content_type: c.content_type || 'video',
            progress: 0
          };
        });

        setLatestContents(mapped);
      } catch (err) {
        console.error('Erro inesperado ao carregar últimos conteúdos:', err);
      } finally {
        setLoadingLatest(false);
      }
    };

    loadLatestContents();
  }, []);
  



  return (
    <>
      {/* Hero Carousel - primeira seção */}
      <div>
        <HeroCarousel pageSlug="dashboard" />
      </div>
      
      <Container fullWidth className="p-0">
        <Section className="p-0">

        {/* Boas-vindas */}
        <div className="pt-8 pb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Bem-vindo, {displayName || 'Usuário'}!
          </h1>
          <p className="text-light-muted dark:text-dark-muted">
            Confira as últimas novidades da plataforma.
          </p>
        </div>

        {/* Novidades - últimos conteúdos publicados */}
        <div className="section-spacing">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-brand-accent rounded-full"></div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Novidades</h2>
          </div>
          {loadingLatest ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
              </div>
          ) : latestContents.length === 0 ? (
            <div className="text-center py-6 text-light-muted dark:text-dark-muted">Nenhum conteúdo recente</div>
          ) : (
            <ContentCarousel>
              {latestContents.map((content: any) => {
                if (content.content_type === 'book') {
                  return (
                    <CardLivro
                      key={content.id}
                      title={content.title}
                      author="Autor"
                      description={content.description || ""}
                      pages={76} // Valor padrão, pode ser ajustado conforme necessário
                      image={content.image}
                      fileUrl={content.file_url || "#"} // URL do arquivo PDF
                      className="w-full"
                    />
                  );
                }
                
                return (
                  <CardVideoAula
                    key={content.id}
                    title={content.title}
                    description={content.description || ""}
                    instructor="Instrutor"
                    duration={`${content.duration || 0}min`}
                    lessons={1}
                    progress={content.progress || 0}
                    image={content.image}
                    slug={content.id}
                    isLesson={true}
                    moduleSlug={content.modules?.slug}
                    className="w-full"
                  />
                );
              })}
            </ContentCarousel>
          )}
        </div>

        {/* Seção Continue de onde parou - só aparece se houver progresso */}
        {continueContents.length > 0 && (
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  Continue de onde parou
                </h2>
              </div>
              <button 
                onClick={() => router.push('/dashboard/continue-assistindo')}
                className="text-brand-accent hover:text-brand-accent/80 text-sm font-medium cursor-pointer"
              >
                ver todos
              </button>
            </div>

            <div className="relative">
              {loadingContinue ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ContentCarousel>
                  {continueContents.map((content: any) => (
                    <CardVideoAula
                      key={content.id}
                      title={content.title}
                      description={content.description || ""}
                      instructor="Instrutor"
                      duration={`${content.duration || 0}min`}
                      lessons={1}
                      progress={content.progress || 0}
                      image={content.image}
                      slug={content.id}
                      isLesson={true}
                      moduleSlug={content.modules?.slug}
                      className="w-full"
                    />
                  ))}
                </ContentCarousel>
              )}
            </div>
          </div>
      )}

        </Section>
      </Container>

    </>
  );
}


