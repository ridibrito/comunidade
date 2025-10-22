"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { ArrowLeft, Play, Clock, CheckCircle, Lock, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
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
          .from('lessons')
          .select('*')
          .eq('module_id', moduleData.id)
          .order('position');

        if (lessonsError) {
          console.error('Erro ao carregar aulas:', lessonsError);
        }

        // Calcular progresso
        const completedLessons = lessonsData?.filter(lesson => lesson.is_completed) || [];
        const progress = lessonsData ? (completedLessons.length / lessonsData.length) * 100 : 0;

        // Calcular duração total
        const totalMinutes = lessonsData?.reduce((total, lesson) => {
          const duration = lesson.duration || '0min';
          const minutes = parseInt(duration.replace('min', '')) || 0;
          return total + minutes;
        }, 0) || 0;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalDuration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

        setModule({
          ...moduleData,
          lessons: lessonsData || [],
          total_duration: totalDuration,
          progress: Math.round(progress)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/70">Carregando módulo...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Módulo não encontrado</h1>
          <Link 
            href="/catalog/montanha-do-amanha" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar à Montanha do Amanhã
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <Container fullWidth>
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/catalog/montanha-do-amanha"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Voltar à {trailTitle}</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/70">
                {module.progress}% concluído
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Module Title Section */}
      <div className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <Container fullWidth>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {module.title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {module.description}
            </p>
            
            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Progresso</span>
                <span>{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Lessons Section */}
      <Container fullWidth>
        <Section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Aulas</h2>
            
            <div className="space-y-4">
              {module.lessons.map((lesson, index) => (
                <ModernCard key={lesson.id} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-start gap-4 p-6">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-20 bg-gray-700 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                          <Play size={24} className="text-white/50" />
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {lesson.title}
                          </h3>
                          {lesson.description && (
                            <p className="text-gray-300 text-sm mb-3">
                              {lesson.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{lesson.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                              <span>Aula {lesson.position}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0 ml-4">
                          {lesson.is_locked ? (
                            <button 
                              disabled
                              className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
                            >
                              <Lock size={16} className="mr-2" />
                              Bloqueada
                            </button>
                          ) : (
                            <Link 
                              href={`/catalog/modulo/${module.slug}/assistir`}
                              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Play size={16} />
                              {lesson.is_completed ? 'Reassistir' : 'Assistir'}
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
    </div>
  );
}
