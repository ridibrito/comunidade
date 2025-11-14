"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import { ArrowLeft, Play, Clock, CheckCircle, ChevronLeft, ChevronRight, Star, Download, FileText } from "lucide-react";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

interface LessonRating {
  id: string;
  lesson_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface ModuleData {
  id: string;
  title: string;
  trail_id: string;
  trails: {
    title: string;
  };
}

interface LessonData {
  id: string;
  title: string;
  video_url: string | null;
  position: number;
  description?: string;
  materials_url?: string;
  duration?: number;
}

interface ContentAsset {
  id: string;
  content_id: string;
  title: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export default function WatchClient({ slug }: { slug: string }) {
  const supabase = getBrowserSupabaseClient();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const [trailTitle, setTrailTitle] = useState("");
  const [parentPageSlug, setParentPageSlug] = useState("montanha-do-amanha");
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [lessonAssets, setLessonAssets] = useState<{[key: string]: ContentAsset[]}>({});
  
  // Função para carregar anexos de uma aula
  const loadLessonAssets = async (contentId: string) => {
    if (!supabase || !contentId) return;
    
    try {
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setLessonAssets(prev => ({
          ...prev,
          [contentId]: data as ContentAsset[]
        }));
      } else {
        setLessonAssets(prev => ({
          ...prev,
          [contentId]: []
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar anexos:', error);
      setLessonAssets(prev => ({
        ...prev,
        [contentId]: []
      }));
    }
  };

  // Função para fazer download de arquivo
  const handleFileDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, fileUrl: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Iniciando download:', { fileUrl, fileName });
      
      const response = await fetch(fileUrl, { 
        credentials: 'omit',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao baixar arquivo: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      // Preservar a extensão do arquivo original
      const safeFileName = fileName.replace(/[<>:"/\\|?*]+/g, '-').trim();
      link.download = safeFileName || 'arquivo';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar o URL do blob após um tempo
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      console.log('Download concluído:', safeFileName);
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
      // Fallback: tentar abrir em nova aba se o download falhar
      alert('Não foi possível baixar o arquivo automaticamente. Tentando abrir em nova aba...');
      window.open(fileUrl, '_blank');
    }
  };

  // Função para obter materiais da aula (agora usando anexos reais)
  const getLessonMaterials = (lesson: any) => {
    const assets = lessonAssets[lesson.id] || [];
    
    // Converter anexos para formato de materiais
    return assets.map((asset) => {
      const fileType = asset.file_type || 'application/octet-stream';
      const isPDF = fileType.includes('pdf');
      const isImage = fileType.startsWith('image/');
      const isVideo = fileType.startsWith('video/');
      const isWord = fileType.includes('word') || fileType.includes('document');
      const isExcel = fileType.includes('excel') || fileType.includes('spreadsheet');
      
      let type = 'Arquivo';
      if (isPDF) type = 'PDF';
      else if (isImage) type = 'Imagem';
      else if (isVideo) type = 'Vídeo';
      else if (isWord) type = 'Word';
      else if (isExcel) type = 'Excel';
      else if (fileType) {
        // Extrair tipo do MIME type
        const parts = fileType.split('/');
        if (parts.length > 1) {
          type = parts[1].toUpperCase();
        }
      }
      
      // Formatar tamanho do arquivo
      let size = 'Tamanho desconhecido';
      if (asset.file_size) {
        const sizeInMB = asset.file_size / (1024 * 1024);
        if (sizeInMB < 1) {
          const sizeInKB = asset.file_size / 1024;
          size = `${sizeInKB.toFixed(1)} KB`;
        } else {
          size = `${sizeInMB.toFixed(2)} MB`;
        }
      }
      
      // Extrair nome do arquivo e extensão da URL ou título
      let fileName = asset.title || 'arquivo';
      // Se o título não tiver extensão, tentar extrair da URL
      if (!fileName.includes('.')) {
        try {
          const urlPath = new URL(asset.file_url).pathname;
          const urlFileName = urlPath.split('/').pop() || '';
          if (urlFileName && urlFileName.includes('.')) {
            const ext = urlFileName.split('.').pop();
            fileName = `${fileName}.${ext}`;
          }
        } catch (e) {
          // Se não conseguir extrair, usar extensão baseada no tipo
          if (type === 'PDF') fileName = `${fileName}.pdf`;
          else if (type === 'Word') fileName = `${fileName}.docx`;
          else if (type === 'Excel') fileName = `${fileName}.xlsx`;
        }
      }

      return {
        id: asset.id,
        title: asset.title || 'Arquivo sem nome',
        type: type,
        url: asset.file_url,
        size: size,
        fileName: fileName
      };
    });
  };
  const [current, setCurrent] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<{[key: string]: number}>({});
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [lessonsProgress, setLessonsProgress] = useState<{[key: string]: {percentage: number, completed: boolean}}>({});

  // Função para buscar avaliações da aula atual
  const fetchRatings = async (lessonId: string) => {
    if (!supabase) return;
    
    try {
      // Buscar avaliação do usuário atual (simulando user_id)
      const { data: userRatingData } = await supabase
        .from('lesson_ratings')
        .select('rating')
        .eq('lesson_id', lessonId)
        .eq('user_id', '00000000-0000-0000-0000-000000000001') // Simulando usuário logado
        .maybeSingle() as { data: LessonRating | null };
      
      setUserRating(userRatingData?.rating || 0);
      
      // Buscar média das avaliações
      const { data: avgData } = await supabase
        .from('lesson_ratings')
        .select('rating')
        .eq('lesson_id', lessonId) as { data: LessonRating[] | null };
      
      if (avgData && avgData.length > 0) {
        const avg = avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length;
        setAverageRating(Math.round(avg * 10) / 10); // Arredondar para 1 casa decimal
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  // Função para salvar avaliação
  const saveRating = async (lessonId: string, rating: number) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('lesson_ratings')
        .upsert({
          lesson_id: lessonId,
          user_id: '00000000-0000-0000-0000-000000000001', // Simulando usuário logado
          rating: rating
        } as any, {
          onConflict: 'lesson_id,user_id'
        });
      
      if (error) {
        console.error('Erro ao salvar avaliação:', error);
      } else {
        setUserRating(rating);
        // Recarregar média
        fetchRatings(lessonId);
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  // Função para carregar progresso do vídeo
  const loadVideoProgress = async (contentId: string) => {
    if (!supabase) {
      console.log('❌ Supabase não disponível');
      return 0;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ Usuário não autenticado');
        return 0;
      }

      console.log('🔍 Carregando progresso para:', { user_id: user.id, content_id: contentId });

      const { data, error } = await supabase
        .from('user_progress')
        .select('last_position, completion_percentage, is_completed')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .maybeSingle() as { data: {last_position: number, completion_percentage: number, is_completed: boolean} | null, error: any };
      
      if (error) {
        console.error('❌ Erro na query:', error);
        return 0;
      }

      if (data) {
        console.log('✅ Progresso encontrado:', data);
        return data.last_position || 0;
      } else {
        console.log('ℹ️ Nenhum progresso encontrado para esta aula');
        return 0;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso:', error);
      return 0;
    }
  };

  // Função para carregar progresso de todas as aulas
  const loadAllLessonsProgress = async (lessonIds: string[]) => {
    if (!supabase || lessonIds.length === 0) {
      console.log('❌ Não pode carregar progresso:', { supabase: !!supabase, lessonIds });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ Usuário não autenticado para carregar progresso');
        return;
      }

      console.log('🔍 Carregando progresso para aulas:', lessonIds);

      const { data, error } = await supabase
        .from('user_progress')
        .select('content_id, completion_percentage, is_completed')
        .eq('user_id', user.id)
        .in('content_id', lessonIds) as { data: {content_id: string, completion_percentage: number, is_completed: boolean}[] | null, error: any };
      
      if (error) {
        console.error('❌ Erro ao buscar progresso:', error);
        return;
      }

      if (data && data.length > 0) {
        const progressMap: {[key: string]: {percentage: number, completed: boolean}} = {};
        data.forEach(item => {
          progressMap[item.content_id] = {
            percentage: item.completion_percentage,
            completed: item.is_completed
          };
        });
        setLessonsProgress(progressMap);
        console.log('✅ Progresso de todas as aulas carregado:', progressMap);
      } else {
        console.log('ℹ️ Nenhum progresso encontrado para nenhuma aula');
        setLessonsProgress({});
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso das aulas:', error);
    }
  };

  // Função para salvar progresso do vídeo
  const saveVideoProgress = async (contentId: string, currentTime: number, duration: number) => {
    if (!supabase) {
      console.log('❌ Supabase não disponível para salvar');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ Usuário não autenticado para salvar');
        return;
      }

      const progressPercentage = Math.floor((currentTime / duration) * 100);
      const isCompleted = progressPercentage >= 90; // Marca como concluído se assistir 90%+

      console.log('💾 Salvando progresso:', {
        user_id: user.id,
        content_id: contentId,
        last_position: Math.floor(currentTime),
        total_duration: Math.floor(duration),
        completion_percentage: progressPercentage,
        is_completed: isCompleted
      });

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          progress_type: isCompleted ? 'completed' : 'in_progress',
          last_position: Math.floor(currentTime),
          total_duration: Math.floor(duration),
          completion_percentage: progressPercentage,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString()
        } as any, {
          onConflict: 'user_id,content_id'
        });

      if (error) {
        console.error('❌ Erro ao salvar no banco:', error);
        return;
      }

      // Atualizar estado local
      setLessonsProgress(prev => ({
        ...prev,
        [contentId]: {
          percentage: progressPercentage,
          completed: isCompleted
        }
      }));

      console.log(`✅ Progresso salvo: ${progressPercentage}% (${Math.floor(currentTime)}s/${Math.floor(duration)}s)`);
    } catch (error) {
      console.error('❌ Erro ao salvar progresso:', error);
    }
  };

  // Effect para carregar progresso quando a aula mudar
  useEffect(() => {
    if (current && isVideoReady) {
      loadVideoProgress(current).then(position => {
        if (position > 0) {
          setVideoProgress(prev => ({ ...prev, [current]: position }));
          console.log(`⏱️ Retomando vídeo do segundo ${position}`);
        }
      });
    }
  }, [current, isVideoReady]);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: mod } = await supabase
        .from("modules")
        .select("id, title, trail_id, trails(title, page_id)")
        .eq("slug", slug)
        .maybeSingle() as { data: ModuleData | null };
      
      if (!mod?.id) return;
      
      setModuleTitle(mod.title);
      setTrailTitle(mod.trails?.title || "Montanha do Amanhã");
      // Buscar slug da página mãe para breadcrumb/link
      if ((mod as any)?.trails?.page_id) {
        const { data: pageData } = await supabase
          .from('pages')
          .select('slug')
          .eq('id', (mod as any).trails.page_id)
          .single();
        const pageSlug = (pageData as { slug?: string } | null)?.slug;
        if (pageSlug) {
          setParentPageSlug(pageSlug);
        }
      }
      
      const { data: l, error: lessonsError } = await supabase
        .from("contents")
        .select("id, title, video_url, position, description, materials_url, duration")
        .eq("module_id", mod.id)
        .order("position") as { data: LessonData[] | null; error: any };
      
      if (lessonsError) {
        console.error('Erro ao carregar aulas:', lessonsError);
      } else {
        console.log('✅ Aulas carregadas:', l);
      }
      
      setLessons(l ?? []);
      if ((l ?? []).length) {
        setCurrent(lessonId || (l ?? [])[0].id);
        // Carregar progresso de todas as aulas
        const lessonIds = (l ?? []).map(lesson => lesson.id);
        loadAllLessonsProgress(lessonIds);
      }
    })();
  }, [supabase, slug]);

  // Buscar avaliações quando a aula atual mudar
  useEffect(() => {
    if (current) {
      fetchRatings(current);
      // Carregar anexos da aula atual
      loadLessonAssets(current);
    }
  }, [current, supabase]);

  // Carregar anexos de todas as aulas quando forem carregadas
  useEffect(() => {
    if (lessons.length > 0 && supabase) {
      // Carregar anexos de todas as aulas de forma assíncrona
      const loadAllAssets = async () => {
        await Promise.all(lessons.map(lesson => loadLessonAssets(lesson.id)));
      };
      loadAllAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons.length]); // Usar apenas length para evitar recarregamentos desnecessários

  const currentLesson = lessons.find((x) => x.id === current);
  const embedUrl = currentLesson?.video_url ? 
    (() => {
      const url = new URL(currentLesson.video_url.replace("vimeo.com/", "player.vimeo.com/video/").replace("www.vimeo.com/", "player.vimeo.com/video/"));
      url.search = '?autoplay=0&title=0&byline=0&portrait=0&responsive=1';
      return url.toString();
    })() : null;
  
  const currentIndex = lessons.findIndex(lesson => lesson.id === current);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;
  
  const goToPrevious = () => {
    if (hasPrevious) {
      setCurrent(lessons[currentIndex - 1].id);
    }
  };
  
  const goToNext = () => {
    if (hasNext) {
      setCurrent(lessons[currentIndex + 1].id);
    }
  };

  // Effect para inicializar o Vimeo Player e rastrear progresso
  useEffect(() => {
    if (!current || !embedUrl) {
      console.log('❌ Player não inicializado:', { current, embedUrl });
      return;
    }

    console.log('🔄 Inicializando player para:', current);

    // Delay para garantir que o iframe foi montado no DOM
    const initTimeout = setTimeout(() => {
      // Carregar script do Vimeo Player se ainda não estiver carregado
      if (!(window as any).Vimeo) {
        console.log('📥 Carregando Vimeo Player API...');
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          console.log('✅ Vimeo Player API carregada');
          initializePlayer();
        };
        
        script.onerror = () => {
          console.error('❌ Erro ao carregar Vimeo Player API');
        };
      } else {
        console.log('✅ Vimeo Player API já está carregada');
        initializePlayer();
      }
    }, 500); // Delay de 500ms

    function initializePlayer() {
      const iframe = document.getElementById('vimeo-player');
      console.log('🔍 Procurando iframe:', iframe);
      
      if (!iframe) {
        console.error('❌ Iframe não encontrado no DOM');
        return;
      }
      
      if (!(window as any).Vimeo) {
        console.error('❌ Vimeo Player API não está disponível');
        return;
      }

      try {
        console.log('🎬 Criando nova instância do Vimeo Player...');
        const player = new (window as any).Vimeo.Player(iframe);
        
        // Player pronto
        player.ready().then(() => {
          setIsVideoReady(true);
          console.log('✅ Player do Vimeo carregado e pronto!');

          // Carregar e retomar do ponto salvo
          if (current) {
            loadVideoProgress(current).then(savedPosition => {
              if (savedPosition > 0) {
                player.setCurrentTime(savedPosition).then(() => {
                  console.log(`⏯️ Vídeo retomado do segundo ${savedPosition}`);
                }).catch((error: any) => {
                  console.error('❌ Erro ao retomar vídeo:', error);
                });
              } else {
                console.log('ℹ️ Nenhum progresso salvo para esta aula');
              }
            });
          }
        }).catch((error: any) => {
          console.error('❌ Erro ao inicializar player:', error);
        });

        // Salvar progresso a cada 5 segundos
        player.on('timeupdate', (data: any) => {
          if (current && data.seconds % 5 < 0.5) { // A cada ~5 segundos
            console.log(`⏱️ Atualizando progresso: ${Math.floor(data.seconds)}s / ${Math.floor(data.duration)}s`);
            saveVideoProgress(current, data.seconds, data.duration);
          }
        });

        // Salvar progresso ao pausar
        player.on('pause', (data: any) => {
          if (current) {
            console.log('⏸️ Vídeo pausado, salvando progresso...');
            saveVideoProgress(current, data.seconds, data.duration);
          }
        });

        // Marcar como concluído ao terminar
        player.on('ended', () => {
          if (current) {
            player.getDuration().then((duration: number) => {
              console.log('🎉 Vídeo finalizado!');
              saveVideoProgress(current, duration, duration);
            });
          }
        });
        
        console.log('✅ Event listeners do player configurados');
      } catch (error) {
        console.error('❌ Erro ao criar instância do Vimeo Player:', error);
      }
    }

    return () => {
      clearTimeout(initTimeout);
      setIsVideoReady(false);
      console.log('🧹 Limpando player');
    };
  }, [current, embedUrl]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header padronizado - com botão voltar e não fixo */}
      <div className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Botão voltar */}
          <Link 
            href={`/catalog/modulo/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </Link>
          
          {/* Título principal e controles */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-light-text dark:text-dark-text truncate">
                {currentLesson?.title || "Selecione uma aula"}
              </h1>
            </div>
            
            {/* Rating e navegação */}
            <div className="flex items-center gap-4 ml-6">
              {/* Rating stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => current && saveRating(current, star)}
                    className="transition-colors hover:scale-110"
                  >
                    <Star 
                      size={16} 
                      className={`${
                        star <= userRating 
                          ? "text-yellow-500 fill-yellow-500" 
                          : "text-yellow-500"
                      }`}
                      fill={star <= userRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  </button>
                ))}
                {averageRating > 0 && (
                  <span className="text-xs text-light-muted dark:text-dark-muted ml-2">
                    ({averageRating})
                  </span>
                )}
              </div>
              
              {/* Navegação em carrossel */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={!hasPrevious}
                  className="w-8 h-8 bg-light-border dark:bg-dark-border rounded-lg flex items-center justify-center text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={goToNext}
                  disabled={!hasNext}
                  className="w-8 h-8 bg-light-border dark:bg-dark-border rounded-lg flex items-center justify-center text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal otimizado */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Player de vídeo - área principal */}
        <div className="flex-1 flex flex-col">
          {/* Player de vídeo */}
          <div className="flex items-start justify-center bg-black">
            {embedUrl ? (
              <div className="w-full">
                <div className="relative w-full aspect-video">
                  <iframe 
                    id="vimeo-player"
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="relative w-full aspect-video bg-gradient-to-br from-light-surface to-light-border dark:from-dark-surface dark:to-dark-border flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                      <Play size={24} className="lg:w-8 lg:h-8 text-brand-accent" />
                    </div>
                    <p className="text-light-muted dark:text-dark-muted text-base lg:text-lg font-medium">Selecione uma aula para começar</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Informações da aula */}
          {currentLesson && (
            <div className="p-4 lg:p-6 shadow-sm">
              <div className="max-w-4xl">
                {/* Título e duração */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-light-muted dark:text-dark-muted">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span className="whitespace-nowrap">{currentLesson.duration !== null && currentLesson.duration !== undefined ? `${currentLesson.duration}min` : 'Sem duração definida'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={16} />
                      <span className="whitespace-nowrap">Aula {currentLesson.position + 1}</span>
                    </div>
                  </div>
                </div>
                
                {/* Descrição */}
                {currentLesson.description && (
                  <div className="mb-6">
                    <div 
                      className="text-light-muted dark:text-dark-muted leading-relaxed whitespace-pre-wrap
                        [&_p]:mb-2 [&_p:last-child]:mb-0
                        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-4 [&_h1]:text-light-text [&_h1]:dark:text-dark-text
                        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-3 [&_h2]:text-light-text [&_h2]:dark:text-dark-text
                        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2 [&_h3]:text-light-text [&_h3]:dark:text-dark-text
                        [&_strong]:font-bold [&_strong]:text-light-text [&_strong]:dark:text-dark-text
                        [&_em]:italic
                        [&_br]:block
                        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-2
                        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-2
                        [&_li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: currentLesson.description }}
                    />
                  </div>
                )}
                
                {/* Materiais complementares */}
                {(() => {
                  const materials = getLessonMaterials(currentLesson);
                  
                  if (materials.length === 0) {
                    return (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-light-border dark:bg-dark-border text-light-muted dark:text-dark-muted rounded-lg cursor-not-allowed">
                          <Download size={16} />
                          <span>Materiais não disponíveis</span>
                        </div>
                        <div className="text-xs text-light-muted dark:text-dark-muted">
                          Materiais complementares para esta aula
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-sm font-medium text-light-text dark:text-dark-text">
                          Materiais Complementares
                        </h3>
                        <div className="text-xs text-light-muted dark:text-dark-muted">
                          {materials.length} {materials.length === 1 ? 'arquivo' : 'arquivos'} disponível{materials.length > 1 ? 'is' : ''}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {materials.map((material) => {
                          // Determinar cor e ícone baseado no tipo de arquivo
                          const getFileIcon = () => {
                            const type = material.type.toLowerCase();
                            if (type === 'pdf') {
                              return { icon: FileText, color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' };
                            } else if (type.includes('image')) {
                              return { icon: FileText, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' };
                            } else if (type.includes('vídeo') || type.includes('video')) {
                              return { icon: FileText, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' };
                            } else if (type === 'word') {
                              return { icon: FileText, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' };
                            } else if (type === 'excel') {
                              return { icon: FileText, color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' };
                            }
                            return { icon: FileText, color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400' };
                          };
                          
                          const { icon: FileIcon, color } = getFileIcon();
                          
                          return (
                            <div key={material.id} className="border border-light-border dark:border-dark-border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <FileIcon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-light-text dark:text-dark-text mb-1 truncate">
                                    {material.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-light-muted dark:text-dark-muted">
                                    <span>{material.type}</span>
                                    <span>•</span>
                                    <span>{material.size}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => handleFileDownload(e, material.url, material.fileName || material.title)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md transition-colors cursor-pointer"
                                  >
                                    <Download size={14} />
                                    Baixar
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar de aulas - elegante */}
        <div className="w-full lg:w-80 bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm flex flex-col lg:max-h-full max-h-80">
          {/* Header da sidebar */}
          <div className="p-4 lg:p-6 shadow-sm">
            <h3 className="text-sm lg:text-base font-semibold text-light-text dark:text-dark-text">Aulas</h3>
            <p className="text-xs lg:text-sm text-light-muted dark:text-dark-muted mt-1">{lessons.length} aulas disponíveis</p>
            
          </div>

          {/* Lista de aulas com scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 lg:p-3">
              {lessons.map((lesson, index) => (
                <button 
                  key={lesson.id} 
                  onClick={() => setCurrent(lesson.id)} 
                  className={`w-full text-left p-3 lg:p-4 rounded-xl transition-all duration-200 mb-2 group ${
                    lesson.id === current 
                      ? "bg-brand-accent/10 text-brand-accent shadow-md border border-brand-accent/20" 
                      : "hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    {/* Thumbnail elegante */}
                    <div className="w-12 h-8 lg:w-14 lg:h-10 bg-gradient-to-br from-light-border to-light-surface dark:from-dark-border dark:to-dark-surface rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                      <Play size={12} className="lg:w-3.5 lg:h-3.5 text-light-muted dark:text-dark-muted" />
                    </div>
                    
                    {/* Conteúdo da aula */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 lg:gap-3 mb-2">
                        <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          lesson.id === current 
                            ? "bg-brand-accent text-white shadow-md" 
                            : "bg-light-border dark:bg-dark-border text-light-muted dark:text-dark-muted group-hover:bg-brand-accent/20"
                        }`}>
                          {index + 1}
                        </div>
                        {lesson.id === current && (
                          <CheckCircle size={14} className="lg:w-4 lg:h-4 text-brand-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs lg:text-sm font-medium leading-tight mb-2 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-xs text-light-muted dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="lg:w-3 lg:h-3" />
                          <span>{lesson.duration || 15}min</span>
                        </div>
                        {lessonsProgress[lesson.id]?.completed && (
                          <CheckCircle size={12} className="lg:w-3 lg:h-3 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      {/* Barra de progresso */}
                      {lessonsProgress[lesson.id] && lessonsProgress[lesson.id].percentage > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-1 overflow-hidden">
                            <div 
                              className="bg-brand-accent h-full transition-all duration-300"
                              style={{ width: `${lessonsProgress[lesson.id].percentage}%` }}
                            />
                          </div>
                        </div>
            )}
          </div>
                  </div>
                </button>
              ))}
              
              {lessons.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-light-border dark:bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={24} className="text-light-muted dark:text-dark-muted" />
                  </div>
                  <p className="text-light-muted dark:text-dark-muted text-sm">Nenhuma aula disponível.</p>
                </div>
              )}
            </div>
          </div>
            </div>
        </div>
        </div>
  );
}


