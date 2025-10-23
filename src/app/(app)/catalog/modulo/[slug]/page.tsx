"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
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
  lessons: Lesson[];
  total_duration: string;
  progress: number;
}

export default function ModulePage() {
  const params = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailTitle, setTrailTitle] = useState("");
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

        // Buscar trilha para obter o título
        const { data: trailData } = await supabase
          .from('trails')
          .select('title')
          .eq('id', moduleData.trail_id)
          .single();

        if (trailData) {
          setTrailTitle(trailData.title);
        }

        // Buscar aulas do módulo
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('contents')
          .select('*')
          .eq('module_id', moduleData.id)
          .order('position');

        if (lessonsError) {
          console.error('Erro ao carregar aulas:', lessonsError);
        }

        // Calcular duração total
        const totalMinutes = lessonsData?.reduce((total, lesson) => {
          const minutes = lesson.duration || 0;
          return total + minutes;
        }, 0) || 0;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalDuration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

        // Carregar progresso das aulas primeiro
        let calculatedProgress = 0;
        if (lessonsData && lessonsData.length > 0) {
          const lessonIds = lessonsData.map(lesson => lesson.id);
          calculatedProgress = await loadLessonsProgress(lessonIds, supabase, lessonsData.length);
        }

        setModule({
          ...moduleData,
          lessons: lessonsData || [],
          total_duration: totalDuration,
          progress: calculatedProgress
        });

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
      <Container>
        <Section>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
              <p className="text-light-muted dark:text-dark-muted">Carregando módulo...</p>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (!module) {
    return (
      <Container>
        <Section>
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
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        {/* Header com navegação */}
        <div className="mb-8">
          <Link 
            href="/catalog/montanha-do-amanha"
            className="flex items-center gap-2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar à {trailTitle}</span>
          </Link>
        </div>

        {/* Cabeçalho do módulo */}
        <div className="mb-8">
          <PageHeader 
            title={module.title} 
            subtitle={module.description}
          />
          
          {/* Informações do módulo */}
          <div className="flex items-center gap-6 text-sm text-light-muted dark:text-dark-muted mb-6">
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{module.total_duration}</span>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="max-w-md">
            <div className="flex justify-between text-sm text-light-muted dark:text-dark-muted mb-2">
              <span>Progresso</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
              <div 
                className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Lista de aulas */}
        <div className="mb-8">
          <h2 className="section-title text-light-text dark:text-dark-text">Aulas</h2>
          
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => (
              <ModernCard key={lesson.id} className="hover:shadow-g4-hover dark:hover:shadow-g4-dark-hover transition-all duration-300">
                <div className="flex items-start gap-4 p-6">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-20 bg-light-border dark:bg-dark-border rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-light-border to-light-surface dark:from-dark-border dark:to-dark-surface flex items-center justify-center">
                        <Play size={24} className="text-light-muted dark:text-dark-muted" />
                      </div>
                    </div>
                    {lesson.is_completed && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                    {lesson.is_locked && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Lock size={20} className="text-white/70" />
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-light-muted dark:text-dark-muted text-sm mb-3">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-light-muted dark:text-dark-muted">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{lesson.duration !== null && lesson.duration !== undefined ? `${lesson.duration}min` : 'Sem duração'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-light-muted dark:bg-dark-muted"></div>
                            <span>Aula {lesson.position + 1}</span>
                          </div>
                          {lessonsProgress[lesson.id]?.completed && (
                            <div className="flex items-center gap-1 text-green-500">
                              <CheckCircle size={14} />
                              <span className="text-xs">Concluída</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Barra de progresso */}
                        {(() => {
                          const progress = lessonsProgress[lesson.id];
                          console.log(`🔍 Verificando progresso para ${lesson.title} (${lesson.id}):`, progress);
                          return progress && progress.percentage > 0 ? (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-light-muted dark:text-dark-muted mb-1">
                                <span>Progresso</span>
                                <span>{progress.percentage}%</span>
                              </div>
                              <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-brand-accent h-full transition-all duration-300"
                                  style={{ width: `${progress.percentage}%` }}
                                />
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>

                      {/* Botão de ação */}
                      <div className="flex-shrink-0 ml-4">
                        {lesson.is_locked ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled
                            className="cursor-not-allowed"
                          >
                            <Lock size={16} className="mr-2" />
                            Bloqueada
                          </Button>
                        ) : (
                          <Link href={`/catalog/modulo/${module.slug}/assistir`}>
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-brand-accent hover:bg-brand-accent/90 text-white"
                            >
                              <Play size={16} className="mr-2" />
                              {lesson.is_completed ? 'Reassistir' : 'Assistir'}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      </Section>
    </Container>
  );
}
