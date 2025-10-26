"use client";

// Dados mockados removidos - usando dados reais do Supabase
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
// import Card from "@/components/ui/Card";
import ModernCard from "@/components/ui/ModernCard";
import MetricCard from "@/components/ui/MetricCard";
import ProgressCard from "@/components/ui/ProgressCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { BookOpen, Calendar, TrendingUp, CheckCircle, Clock, Eye, Download, Play } from "lucide-react";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import ContentCarousel from "@/components/ui/ContentCarousel";
import Card from "@/components/ui/Card";
import { CardVideoAula, CardLivro } from "@/components/ui/CardModels";
import CardComMarcos from "@/components/ui/CardComMarcos";
import { MagicCard } from "@/components/ui/animations/MagicCard";
import { BorderBeam } from "@/components/ui/animations/BorderBeam";
import { Particles } from "@/components/ui/animations/Particles";
import { useRouter } from "next/navigation";

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
  const [latestContents, setLatestContents] = useState<any[]>([]);
  const [loadingLatest, setLoadingLatest] = useState<boolean>(true);
  const [continueContents, setContinueContents] = useState<any[]>([]);
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

      // parceiro(a): busca primeiro membro de família com relationship típico
      const { data: fams } = await (supabase
        .from("family_members")
        .select("name, relationship, avatar_url")
        .eq("user_id", uid)
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
        const supabase = createClient();
        
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
          .order('updated_at', { ascending: false })
          .limit(8);

        if (progressError) {
          console.error('Erro ao carregar progresso:', progressError);
          setContinueContents([]);
          return;
        }

        const mapped = (progressData || [])
          .filter((item: any) => item.content) // Filtrar apenas conteúdos válidos
          .map((item: any) => {
            const content = item.content;
            const page = content?.modules?.trails?.pages || content?.trails?.pages;
            const pageSlug: string | undefined = page?.slug;
            const pageTitle: string | undefined = page?.title || content?.modules?.trails?.title || content?.trails?.title;
            const badgeCfg = (pageSlug && PAGE_BADGE[pageSlug]) ? PAGE_BADGE[pageSlug] : { label: pageTitle || 'Conteúdo', variant: 'outline' as const };
            const image = content.image_url || '/logo_full.png';
            
            // Garantir que trail_id está disponível (pode vir de modules.trail_id ou trail_id direto)
            const trailId = content.modules?.trail_id || content.trail_id;
            
            return {
              ...content,
              trail_id: trailId, // Adicionar explicitamente para o CardComMarcos
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
        const supabase = createClient();
        const { data, error } = await supabase
          .from('contents')
          .select(`
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
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Erro ao carregar últimos conteúdos:', error);
          setLatestContents([]);
          return;
        }

        const PAGE_BADGE: Record<string, { label: string; variant: "info"|"success"|"warning"|"error"|"brand"|"outline"|"default" }> = {
          'montanha-do-amanha': { label: 'Montanha do Amanhã', variant: 'brand' },
          'rodas-de-conversa': { label: 'Rodas de Conversa', variant: 'success' },
          'plantao-de-duvidas': { label: 'Plantão de Dúvidas', variant: 'warning' },
          'acervo-digital': { label: 'Acervo Digital', variant: 'info' }
        };

        const mapped = (data || []).map((c: any) => {
          const page = (c as any)?.modules?.trails?.pages || (c as any)?.trails?.pages;
          const pageSlug: string | undefined = page?.slug;
          const pageTitle: string | undefined = page?.title || (c as any)?.modules?.trails?.title || (c as any)?.trails?.title;
          const badgeCfg = (pageSlug && PAGE_BADGE[pageSlug]) ? PAGE_BADGE[pageSlug] : { label: pageTitle || 'Conteúdo', variant: 'outline' as const };
          const image = c.image_url || '/logo_full.png';
          
          // Garantir que trail_id está disponível (pode vir de modules.trail_id ou trail_id direto)
          const trailId = c.modules?.trail_id || c.trail_id;
          
          console.log(`[Dashboard] Mapeando conteúdo: ${c.title}`);
          console.log(`  - module_id: ${c.module_id}`);
          console.log(`  - trail_id direto: ${c.trail_id}`);
          console.log(`  - modules?.trail_id: ${c.modules?.trail_id}`);
          console.log(`  - trailId final: ${trailId}`);
          
          return {
            ...c,
            trail_id: trailId, // Adicionar explicitamente para o CardComMarcos
            image,
            origin: {
              slug: pageSlug,
              title: pageTitle,
              badge: badgeCfg
            }
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
  
  // Dados de progresso mockados temporariamente
  const mockProgress = {
    completed: 12,
    totalLessons: 20
  };
  
  const progressPct = Math.round((mockProgress.completed / mockProgress.totalLessons) * 100);
  
  // Dados de eventos mockados temporariamente
  const mockEvents = [
    {
      title: "Workshop de AHSD",
      date: "25 de Outubro, 2024",
      time: "14:00"
    }
  ];
  
  // Dados de trilhas mockados temporariamente
  const mockTrails = [
    {
      title: "Montanha do Amanhã",
      description: "Trilha completa de desenvolvimento",
      progress: 75,
      lessons: 12,
      completed: 9,
      modules: [
        { title: "Fundamentos", completed: true, lessons: [{ title: "Aula 1" }, { title: "Aula 2" }] },
        { title: "Desenvolvimento", completed: true, lessons: [{ title: "Aula 3" }, { title: "Aula 4" }] },
        { title: "Avançado", completed: false, lessons: [{ title: "Aula 5" }] }
      ]
    },
    {
      title: "Acervo Digital",
      description: "Biblioteca de recursos educacionais",
      progress: 40,
      lessons: 8,
      completed: 3,
      modules: [
        { title: "Livros", completed: true, lessons: [{ title: "Livro 1" }, { title: "Livro 2" }] },
        { title: "Vídeos", completed: false, lessons: [{ title: "Vídeo 1" }] }
      ]
    }
  ];

  // Funções determinísticas para evitar hydration mismatch (sem Math.random no render)
  function hashStringToInt(input: string, seed = 0): number {
    let hash = 2166136261 ^ seed;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      // FNV-1a like
      hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
    }
    return hash >>> 0;
  }

  function deterministicPercent(label: string, index: number): number {
    const h = hashStringToInt(`${label}#${index}`, 1337);
    return h % 101; // 0..100
  }
  const avgAnamnese = children.length ? Math.round(children.reduce((a,c)=> a + (c.anamnese ?? 0), 0) / children.length * 100) : 0;
  const avgRoutine = children.length ? Math.round(children.reduce((a,c)=> a + ((c.routineToday?.done ?? 0) / Math.max(1,(c.routineToday?.total ?? 1))), 0) / children.length * 100) : 0;
  const diariesThisWeek = 5; // mock

  const openChildDetails = (child: Kid) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChild(null);
  };
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
              {latestContents.map((content: any) => (
                <CardComMarcos
                  key={content.id}
                  content={content}
                  showMarcos={true}
                  className="w-full"
                />
              ))}
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
                    <CardComMarcos
                      key={content.id}
                      content={content}
                      showMarcos={true}
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


