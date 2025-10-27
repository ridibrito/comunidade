"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import { CardVideoAula } from "@/components/ui/CardModels";
import { ModuleBanner } from "@/components/ModuleBanner";
import { ArrowLeft, Play, Clock, CheckCircle, Lock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number; // em minutos
  video_url?: string;
  position: number;
  is_completed?: boolean;
  is_locked?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  slug: string;
  trail_id: string;
  cover_url?: string;
  lessons: Lesson[];
  total_duration: string;
  progress: number;
}

export default function ModulePage() {
  const params = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailTitle, setTrailTitle] = useState("");
  // Armazena o slug da página mãe (ex.: montanha-do-amanha, acervo-digital)
  const [parentPageSlug, setParentPageSlug] = useState("");
  const [lessonsProgress, setLessonsProgress] = useState<{[key: string]: {percentage: number, completed: boolean}}>({});

  useEffect(() => {
    const loadModule = async () => {
      setLoading(true);
      
      try {
        const supabase = createClient();
        
        // Buscar módulo pelo slug
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('slug', params.slug)
          .single();
        
        if (moduleError) {
          console.error('Erro ao carregar módulo:', moduleError);
          setLoading(false);
          return;
        }

        // Buscar trilha para obter o título e a página mãe
        if (moduleData) {
          const module = moduleData as any;
          if (module.trail_id) {
            const { data: trailData } = await supabase
              .from('trails')
              .select('title, slug, page_id')
              .eq('id', module.trail_id)
              .single();

            if (trailData) {
              const trail = trailData as any;
              setTrailTitle(trail.title);
              // Buscar a página mãe para obter o slug correto da rota de volta
              if (trail.page_id) {
                const { data: pageData } = await supabase
                  .from('pages')
                  .select('slug')
                  .eq('id', trail.page_id)
                  .single();
                if (pageData) {
                  setParentPageSlug((pageData as any).slug || '');
                }
              }
            }
          }
        }

        // Buscar aulas do módulo
        if (moduleData) {
          const module = moduleData as any;
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('contents')
            .select('*')
            .eq('module_id', module.id)
            .order('position');

          if (lessonsError) {
            console.error('Erro ao carregar aulas:', lessonsError);
          } else {
            console.log('✅ Aulas carregadas:', lessonsData);
            lessonsData?.forEach((lesson: any) => {
              console.log(`📚 Aula: ${lesson.title}, image_url: ${lesson.image_url}`);
            });
          }

          // Calcular duração total
          const totalMinutes = lessonsData?.reduce((total: number, lesson: any) => {
            const minutes = lesson.duration || 0;
            return total + minutes;
          }, 0) || 0;
          
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const totalDuration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

          // Carregar progresso das aulas primeiro
          let calculatedProgress = 0;
          if (lessonsData && lessonsData.length > 0) {
            const lessonIds = lessonsData.map((lesson: any) => lesson.id);
            calculatedProgress = await loadLessonsProgress(lessonIds, supabase, lessonsData.length);
          }

          setModule({
            ...module,
            lessons: lessonsData || [],
            total_duration: totalDuration,
            progress: calculatedProgress
          });
        }

      } catch (error) {
        console.error('Erro geral:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadModule();
    }
  }, [params.slug]);

  // Função para carregar progresso de todas as aulas
  const loadLessonsProgress = async (lessonIds: string[], supabase: any, totalLessons: number): Promise<number> => {
    try {
      console.log('🔍 Carregando progresso para aulas:', lessonIds);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ Usuário não autenticado');
        return 0;
      }

      console.log('👤 Usuário:', user.id);

      const { data, error } = await supabase
        .from('user_progress')
        .select('content_id, completion_percentage, is_completed')
        .eq('user_id', user.id)
        .in('content_id', lessonIds);
      
      if (error) {
        console.error('❌ Erro na query:', error);
        return 0;
      }

      console.log('📊 Dados recebidos:', data);
      
      if (data && data.length > 0) {
        const progressMap: {[key: string]: {percentage: number, completed: boolean}} = {};
        let totalProgress = 0;
        
        data.forEach((item: any) => {
          progressMap[item.content_id] = {
            percentage: item.completion_percentage,
            completed: item.is_completed
          };
          totalProgress += item.completion_percentage;
        });
        
        setLessonsProgress(progressMap);
        
        // Calcular progresso médio do módulo
        const averageProgress = Math.round(totalProgress / totalLessons);
        console.log('✅ Progresso das aulas carregado (página módulo):', progressMap);
        console.log('📊 Progresso médio do módulo:', averageProgress + '%');
        
        return averageProgress;
      } else {
        console.log('ℹ️ Nenhum progresso encontrado');
        return 0;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <Container fullWidth>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
            <p className="text-light-muted dark:text-dark-muted">Carregando módulo...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!module) {
    return (
      <Container fullWidth>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Módulo não encontrado</h1>
            <Link 
              href="/catalog/montanha-do-amanha" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar à Montanha do Amanhã
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      {/* Banner do Módulo */}
      <ModuleBanner
        title={module.title}
        description={module.description}
        coverUrl={(module as any).banner_url || module.cover_url}
        lessonsCount={module.lessons.length}
        totalDuration={module.total_duration}
        progress={module.progress}
        trailTitle={trailTitle}
        trailSlug={parentPageSlug || 'montanha-do-amanha'}
        onPlayClick={() => window.location.href = `/catalog/modulo/${module.slug}/assistir`}
      />

      <Section>

        {/* Lista de aulas com carrossel */}
        <div className="mb-8">
          <h2 className="section-title text-light-text dark:text-dark-text mb-6">Aulas</h2>
          
          <div className="relative">
            <Carousel cardWidth={320} gap={24}>
              {module.lessons.map((lesson, index) => {
                const progress = lessonsProgress[lesson.id];
                return (
                  <div key={lesson.id}>
                    <CardVideoAula
                      title={lesson.title}
                      description={lesson.description || ''}
                      instructor=""
                      duration={lesson.duration ? `${lesson.duration}min` : 'Sem duração'}
                      lessons={1}
                      progress={progress?.percentage || 0}
                      rating={undefined}
                      isNew={false}
                      difficulty="Básico"
                      image={(lesson as any).image_url || (lesson as any).cover_url || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"}
                      slug={`${module.slug}/assistir`}
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      </Section>
    </Container>
  );
}
