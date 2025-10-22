'use client';

import { useState } from 'react';
import ModernCard from '@/components/ui/ModernCard';
import MetricCard from '@/components/ui/MetricCard';
import ProgressCard from '@/components/ui/ProgressCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Carousel from '@/components/ui/Carousel';
import { AuthTest } from '@/components/AuthTest';
import { 
  Star, 
  BookOpen, 
  Clock, 
  Users, 
  MessageCircle, 
  Download, 
  Play, 
  ChevronRight,
  Mountain,
  Archive,
  RotateCcw,
  HelpCircle,
  TrendingUp,
  Award,
  Target,
  Zap,
  Heart,
  ThumbsUp,
  Share2,
  Bookmark,
  Filter,
  Search,
  Settings,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { 
  CardVideoAula, 
  CardAulaAoVivo, 
  CardLivro, 
  CardPDF 
} from '@/components/ui/CardModels';

// Componentes inspirados no shadcn-ui
const Card = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-dark-border py-6 shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 ${className}`}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`leading-none font-semibold text-gray-900 dark:text-dark-text ${className}`}
    {...props}
  />
);

const CardDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`text-gray-600 dark:text-dark-muted text-sm ${className}`}
    {...props}
  />
);

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`px-6 ${className}`}
    {...props}
  />
);

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`flex items-center px-6 ${className}`}
    {...props}
  />
);

const Progress = ({ className, value, ...props }: { className?: string; value: number; [key: string]: any }) => (
  <div
    className={`bg-gray-200 dark:bg-dark-border relative h-2 w-full overflow-hidden rounded-full ${className}`}
    {...props}
  >
    <div
      className="bg-brand-accent h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);

const Avatar = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`relative flex size-8 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
);

const AvatarImage = ({ className, src, alt, ...props }: { className?: string; src: string; alt: string; [key: string]: any }) => (
  <img
    className={`aspect-square size-full ${className}`}
    src={src}
    alt={alt}
    {...props}
  />
);

const AvatarFallback = ({ className, children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) => (
  <div
    className={`bg-gray-100 dark:bg-dark-border flex size-full items-center justify-center rounded-full text-xs font-medium ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Separator = ({ className, orientation = "horizontal", ...props }: { className?: string; orientation?: "horizontal" | "vertical"; [key: string]: any }) => (
  <div
    className={`bg-gray-200 dark:bg-dark-border shrink-0 ${
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
    } ${className}`}
    {...props}
  />
);

const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={`bg-gray-200 dark:bg-dark-border animate-pulse rounded-md ${className}`}
    {...props}
  />
);

export default function TestElementsPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Dados de exemplo para diferentes tipos de conteúdo
  const sampleModules = [
    {
      title: "Aspectos Cognitivos",
      description: "Desenvolvimento intelectual e habilidades mentais",
      img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
      lessons: 8,
      duration: "2h 30min",
      progress: 75,
      level: "Intermediário",
      isNew: true,
      rating: 4.8
    },
    {
      title: "Aspectos Socioemocionais", 
      description: "Inteligência emocional e relacionamentos",
      img: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
      lessons: 6,
      duration: "1h 45min",
      progress: 45,
      level: "Básico"
    },
    {
      title: "Rotina e Organização",
      description: "Estruturação do dia a dia", 
      img: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      lessons: 5,
      duration: "1h 20min",
      progress: 0,
      level: "Básico"
    }
  ];

  const sampleResources = [
    {
      title: "Guia Completo AHSD",
      description: "Manual completo para identificação de características",
      type: "PDF",
      downloads: 1250,
      rating: 4.9,
      isNew: true
    },
    {
      title: "Vídeo: Primeiros Sinais",
      description: "Como identificar os primeiros sinais de AHSD",
      type: "Vídeo",
      duration: "15min",
      views: 3200,
      rating: 4.7
    },
    {
      title: "Checklist de Observação",
      description: "Lista prática para observação diária",
      type: "Checklist",
      downloads: 890,
      rating: 4.8
    }
  ];

  const sampleDiscussions = [
    {
      title: "Dúvidas sobre Desenvolvimento Motor",
      description: "Discussão sobre coordenação e habilidades físicas",
      participants: 23,
      messages: 45,
      lastActivity: "2h atrás",
      isActive: true
    },
    {
      title: "Compartilhando Experiências",
      description: "Como cada família lida com os desafios diários",
      participants: 18,
      messages: 67,
      lastActivity: "1d atrás",
      isActive: false
    }
  ];

  const sampleQuestions = [
    {
      title: "Como identificar hiperfoco?",
      description: "Meu filho fica muito focado em algumas atividades...",
      category: "Cognitivo",
      answers: 3,
      isResolved: false,
      urgency: "normal"
    },
    {
      title: "Melhor horário para atividades",
      description: "Qual o melhor momento do dia para trabalhar habilidades?",
      category: "Rotina",
      answers: 7,
      isResolved: true,
      urgency: "high"
    }
  ];

  // Dados de exemplo para os novos modelos de card
  const sampleVideoAulas = [
    {
      title: "Aspectos Cognitivos",
      description: "Desenvolvimento intelectual e habilidades mentais em crianças AHSD",
      instructor: "Dr. Maria Silva",
      duration: "2h 30min",
      lessons: 8,
      progress: 75,
      rating: 4.8,
      isNew: true,
      difficulty: "Intermediário" as const,
      image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
      slug: "/catalog/modulo/aspectos-cognitivos"
    },
    {
      title: "Desenvolvimento Socioemocional",
      description: "Inteligência emocional e relacionamentos",
      instructor: "Psicóloga Ana Costa",
      duration: "1h 45min",
      lessons: 6,
      progress: 45,
      difficulty: "Básico" as const,
      image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
      slug: "/catalog/modulo/desenvolvimento-socioemocional"
    }
  ];

  const sampleAulasAoVivo = [
    {
      title: "Desenvolvimento Motor",
      description: "Atividades físicas e coordenação motora para crianças AHSD",
      instructor: "Fisioterapeuta João Oliveira",
      originalDate: "2024-01-15",
      originalTime: "19:00",
      duration: "1h 30min",
      participants: 24,
      maxParticipants: 30,
      progress: 60,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/desenvolvimento-motor.mp4"
    },
    {
      title: "Rotinas e Organização",
      description: "Estratégias para estruturar o dia a dia com crianças superdotadas",
      instructor: "Pedagoga Carla Santos",
      originalDate: "2024-01-12",
      originalTime: "18:30",
      duration: "1h 20min",
      participants: 30,
      maxParticipants: 30,
      progress: 100,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/rotinas-organizacao.mp4"
    }
  ];

  const sampleLivros = [
    {
      title: "Guia Completo AHSD",
      author: "Dr. Carlos Mendes",
      description: "Manual abrangente sobre Altas Habilidades/Superdotação",
      pages: 156,
      rating: 4.9,
      downloads: 1247,
      isNew: true,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop",
      fileUrl: "/files/guia-completo-ahsd.pdf"
    },
    {
      title: "Estratégias Educacionais",
      author: "Prof. Roberto Lima",
      description: "Métodos práticos para desenvolvimento cognitivo",
      pages: 89,
      rating: 4.7,
      downloads: 892,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
      fileUrl: "/files/estrategias-educacionais.pdf"
    }
  ];

  const samplePDFs = [
    {
      title: "Manual de Rotinas",
      description: "Organização e estruturação do dia a dia",
      pages: 67,
      rating: 4.6,
      downloads: 743,
      isNew: false,
      isFeatured: false,
      image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      fileUrl: "/files/manual-rotinas.pdf"
    },
    {
      title: "Desenvolvimento Cognitivo",
      description: "Fundamentos do pensamento e raciocínio",
      pages: 178,
      rating: 4.8,
      downloads: 892,
      series: "Desenvolvimento Infantil",
      seriesOrder: 2,
      image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop",
      fileUrl: "/files/desenvolvimento-cognitivo.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-6 py-8">
        
        {/* Auth Test */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            🔐 Teste de Autenticação
          </h2>
          <AuthTest />
        </section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Playground de Elementos
          </h1>
          <p className="text-light-muted dark:text-dark-muted">
            Teste todos os componentes da aplicação
          </p>
        </div>

        {/* Seção: Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default" size="sm">Padrão</Badge>
            <Badge variant="success" size="sm">Sucesso</Badge>
            <Badge variant="warning" size="sm">Atenção</Badge>
            <Badge variant="error" size="sm">Erro</Badge>
            <Badge variant="info" size="sm">Info</Badge>
            <Badge variant="brand" size="sm">Marca</Badge>
            <Badge variant="default" size="md">Médio</Badge>
            <Badge variant="success" size="lg">Grande</Badge>
          </div>
        </section>

        {/* Seção: Avatars */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Avatars
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar className="size-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop" alt="User" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="size-16">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
          </div>
        </section>

        {/* Seção: Progress Bars */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Progress Bars
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso do Curso</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completude do Módulo</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Meta Semanal</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </section>

        {/* Seção: Cards com Estrutura shadcn-ui */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Cards - Estrutura shadcn-ui
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card com Header</CardTitle>
                <CardDescription>
                  Este é um exemplo de card usando a estrutura do shadcn-ui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-dark-muted">
                  Conteúdo do card aqui. Pode incluir qualquer elemento.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Ação</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Card com Avatar</CardTitle>
                    <CardDescription>Usuário ativo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card com Badges</CardTitle>
                <CardDescription>Múltiplos elementos visuais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="success" size="sm">Completo</Badge>
                  <Badge variant="warning" size="sm">Em Progresso</Badge>
                  <Badge variant="info" size="sm">Novo</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                  <Clock className="w-4 h-4" />
                  <span>2h 30min</span>
                  <BookOpen className="w-4 h-4 ml-2" />
                  <span>8 aulas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção: Skeletons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Skeletons (Loading States)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Separador */}
        <Separator className="my-12" />

        {/* Seção: Botões */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Botões
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Tamanhos</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">Pequeno</Button>
                <Button variant="primary" size="md">Médio</Button>
                <Button variant="primary" size="lg">Grande</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Variantes</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Padrão</Button>
                <Button variant="primary">Primário</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>Desabilitado</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Com Ícones</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">
                  <Play className="w-4 h-4" />
                  Reproduzir
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Baixar
                </Button>
                <Button variant="ghost">
                  <Heart className="w-4 h-4" />
                  Favoritar
                </Button>
                <Button variant="secondary">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Separador */}
        <Separator className="my-12" />

        {/* Seção: Cards da Montanha do Amanhã */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Cards - Montanha do Amanhã
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleModules.map((module, index) => (
              <ModernCard 
                key={index} 
                variant="elevated" 
                className={`h-full space-y-4 cursor-pointer transition-all ${
                  selectedCard === `module-${index}` ? 'ring-2 ring-brand-accent' : ''
                }`}
                onClick={() => setSelectedCard(`module-${index}`)}
              >
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                    <img src={module.img} alt={module.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Badges sobrepostos */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {module.isNew && <Badge variant="warning" size="sm">Novo</Badge>}
                  </div>
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {module.progress > 0 && <Badge variant="success" size="sm">{module.progress}%</Badge>}
                    {module.rating && (
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-medium">{module.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                      {module.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {module.lessons} aulas
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration}
                    </div>
                  </div>

                  {module.progress > 0 && (
                    <div className="rounded-xl transition-all duration-200 bg-light-surface dark:bg-dark-surface shadow-lg dark:shadow-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-light-text dark:text-dark-text">Progresso</h4>
                        </div>
                        <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                          {module.progress}%
                        </span>
                      </div>
                      <Progress value={module.progress} />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className={`inline-flex items-center font-medium rounded-full shadow-sm px-2 py-0.5 text-xs ${
                      module.level === 'Básico' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      module.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {module.level}
                    </span>
                    <Button variant="ghost" size="sm" className="text-brand-accent hover:text-brand-accent/80">
                      {module.progress > 0 ? 'Continuar' : 'Começar'}
                      <Play className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </section>

        {/* Seção: Cards do Acervo Digital */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Cards - Acervo Digital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleResources.map((resource, index) => (
              <ModernCard 
                key={index} 
                variant="default" 
                className="h-full space-y-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                      {resource.type === 'PDF' && <Archive className="w-5 h-5 text-brand-accent" />}
                      {resource.type === 'Vídeo' && <Play className="w-5 h-5 text-brand-accent" />}
                      {resource.type === 'Checklist' && <Target className="w-5 h-5 text-brand-accent" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  {resource.isNew && <Badge variant="warning" size="sm">Novo</Badge>}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-muted">
                  <div className="flex items-center gap-4">
                    {resource.downloads && (
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads}
                      </div>
                    )}
                    {resource.views && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {resource.views}
                      </div>
                    )}
                    {resource.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {resource.rating}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  {resource.type === 'PDF' ? 'Baixar' : resource.type === 'Vídeo' ? 'Assistir' : 'Acessar'}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </ModernCard>
            ))}
          </div>
        </section>

        {/* Seção: Cards das Rodas de Conversa */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Cards - Rodas de Conversa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleDiscussions.map((discussion, index) => (
              <ModernCard 
                key={index} 
                variant="default" 
                className="h-full space-y-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                        {discussion.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">
                        {discussion.description}
                      </p>
                    </div>
                  </div>
                  {discussion.isActive && <Badge variant="success" size="sm">Ativa</Badge>}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-muted">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {discussion.participants}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {discussion.messages}
                    </div>
                  </div>
                  <span>{discussion.lastActivity}</span>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Participar
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </ModernCard>
            ))}
          </div>
        </section>

        {/* Seção: Cards do Plantão de Dúvidas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Cards - Plantão de Dúvidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleQuestions.map((question, index) => (
              <ModernCard 
                key={index} 
                variant="default" 
                className="h-full space-y-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      question.urgency === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <HelpCircle className={`w-5 h-5 ${
                        question.urgency === 'high' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                        {question.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">
                        {question.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {question.isResolved && <Badge variant="success" size="sm">Resolvida</Badge>}
                    {question.urgency === 'high' && <Badge variant="error" size="sm">Urgente</Badge>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-muted">
                  <div className="flex items-center gap-4">
                    <Badge variant="info" size="sm">{question.category}</Badge>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {question.answers} respostas
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver respostas
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </ModernCard>
            ))}
          </div>
        </section>

        {/* Seção: Metric Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Metric Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Módulos Completados"
              value="12"
              description="De 24 módulos"
              trend={{ positive: true, value: 15, label: "vs mês passado" }}
              icon={<Award className="w-8 h-8 text-yellow-500" />}
              variant="brand"
            />
            <MetricCard
              title="Tempo de Estudo"
              value="45h"
              description="Este mês"
              trend={{ positive: true, value: 8, label: "vs mês passado" }}
              icon={<Clock className="w-8 h-8 text-blue-500" />}
              variant="info"
            />
            <MetricCard
              title="Recursos Baixados"
              value="28"
              description="Total de downloads"
              trend={{ positive: false, value: 5, label: "vs mês passado" }}
              icon={<Download className="w-8 h-8 text-green-500" />}
              variant="success"
            />
            <MetricCard
              title="Participações"
              value="156"
              description="Em discussões"
              trend={{ positive: true, value: 23, label: "vs mês passado" }}
              icon={<Users className="w-8 h-8 text-purple-500" />}
              variant="default"
            />
          </div>
        </section>

        {/* Seção: Carrossel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Carrossel
          </h2>
          <div 
            className="relative py-8 flex items-center"
            style={{
              width: '100vw',
              marginLeft: '0',
              paddingLeft: '0',
              paddingRight: '0'
            }}
          >
            <Carousel cardWidth={320} gap={24}>
              {sampleModules.map((module, index) => (
                <ModernCard key={index} variant="elevated" className="h-full space-y-4">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                      <img src={module.img} alt={module.title} className="w-full h-full object-cover" />
                    </div>
                    {module.isNew && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="warning" size="sm">Novo</Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-dark-muted">
                        {module.lessons} aulas • {module.duration}
                      </span>
                      <Badge variant={module.level === 'Básico' ? 'success' : module.level === 'Intermediário' ? 'warning' : 'error'} size="sm">
                        {module.level}
                      </Badge>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </Carousel>
          </div>
        </section>

        {/* Separador */}
        <Separator className="my-12" />

        {/* Seção: Exemplos Práticos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            Exemplos Práticos
          </h2>
          
          {/* Card de Perfil de Usuário */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Card de Perfil de Usuário</h3>
            <Card className="max-w-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>João Silva</CardTitle>
                    <CardDescription>Educador • 2 anos de experiência</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                    <Mail className="w-4 h-4" />
                    <span>joao.silva@email.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                    <MapPin className="w-4 h-4" />
                    <span>São Paulo, SP</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde Jan 2023</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4" />
                    Mensagem
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <User className="w-4 h-4" />
                    Perfil
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Card de Estatísticas */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Card de Estatísticas</h3>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Progresso Geral</CardTitle>
                <CardDescription>Seu desempenho neste mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Módulos Completados</span>
                      <span>12/24</span>
                    </div>
                    <Progress value={50} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tempo de Estudo</span>
                      <span>45h</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Participações</span>
                      <span>156</span>
                    </div>
                    <Progress value={90} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="w-4 h-4" />
                  Ver Relatório Completo
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Card de Notificação */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Card de Notificação</h3>
            <Card className="max-w-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Nova Atividade</CardTitle>
                    <CardDescription>Há 2 horas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-dark-muted">
                  Você tem uma nova discussão na "Roda de Conversa" sobre desenvolvimento cognitivo.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Eye className="w-4 h-4" />
                    Marcar como Lida
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4" />
                    Participar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Separador */}
        <Separator className="my-12" />

        {/* Seção: Novos Modelos de Card */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
            🎯 Novos Modelos de Card
          </h2>
          
          {/* Card para Aula em Vídeo Gravado (Curso) */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              📹 Aulas em Vídeo Gravado (Cursos)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleVideoAulas.map((aula, index) => (
                <CardVideoAula
                  key={index}
                  title={aula.title}
                  description={aula.description}
                  instructor={aula.instructor}
                  duration={aula.duration}
                  lessons={aula.lessons}
                  progress={aula.progress}
                  rating={aula.rating}
                  isNew={aula.isNew}
                  difficulty={aula.difficulty}
                  image={aula.image}
                  slug={aula.slug}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Características do Card de Aula em Vídeo:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>Botão Play centralizado</strong> indicando conteúdo de vídeo</li>
                <li>• <strong>Barra de progresso real</strong> para vídeos hospedados no Vimeo</li>
                <li>• <strong>Progresso visual</strong> com badge de porcentagem</li>
                <li>• <strong>Informações do instrutor</strong> destacadas</li>
                <li>• <strong>Badge de dificuldade</strong> com cores diferenciadas</li>
                <li>• <strong>Rating com estrelas</strong> para avaliação</li>
                <li>• <strong>Botão roxo acento</strong> "Continuar" ou "Começar" baseado no progresso</li>
              </ul>
            </div>
          </div>

          {/* Card para Aula ao Vivo (Agora Gravada) */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              🔴 Aulas ao Vivo (Agora em Replay)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleAulasAoVivo.map((aula, index) => (
                <CardAulaAoVivo
                  key={index}
                  title={aula.title}
                  description={aula.description}
                  instructor={aula.instructor}
                  originalDate={aula.originalDate}
                  originalTime={aula.originalTime}
                  {...aula}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">💡 Características do Card de Aula ao Vivo:</h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• <strong>Badge "Replay"</strong> indicando que é uma gravação</li>
                <li>• <strong>Ícone de replay</strong> no centro da imagem</li>
                <li>• <strong>Barra de progresso real</strong> para vídeos hospedados no Vimeo</li>
                <li>• <strong>Data e hora original</strong> da transmissão ao vivo</li>
                <li>• <strong>Contador de participantes</strong> que assistiram</li>
                <li>• <strong>Botão roxo acento "Assistir Replay"</strong> para acessar a gravação</li>
                <li>• <strong>Overlay escuro</strong> na imagem indicando conteúdo gravado</li>
              </ul>
            </div>
          </div>

          {/* Card para Livros */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              📚 Livros
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleLivros.map((livro, index) => (
                <CardLivro
                  key={index}
                  title={livro.title}
                  author={livro.author}
                  description={livro.description}
                  pages={livro.pages}
                  rating={livro.rating}
                  downloads={livro.downloads}
                  isNew={livro.isNew}
                  isFeatured={livro.isFeatured}
                  image={livro.image}
                  fileUrl={livro.fileUrl}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Características do Card de Livro:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• <strong>Badge "Livro"</strong> com ícone de livro</li>
                <li>• <strong>Proporção 3:4</strong> na imagem (formato de livro)</li>
                <li>• <strong>Nome do autor</strong> destacado em cor de marca</li>
                <li>• <strong>Contador de páginas</strong> e downloads</li>
                <li>• <strong>Botão "Baixar" roxo acento</strong> e "Ler" outline</li>
                <li>• <strong>Badges de "Novo" e "Destaque"</strong> para livros especiais</li>
              </ul>
            </div>
          </div>

          {/* Card para PDFs */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              📄 PDFs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {samplePDFs.map((pdf, index) => (
                <CardPDF
                  key={index}
                  title={pdf.title}
                  description={pdf.description}
                  pages={pdf.pages}
                  rating={pdf.rating}
                  downloads={pdf.downloads}
                  isNew={pdf.isNew}
                  isFeatured={pdf.isFeatured}
                  series={pdf.series}
                  seriesOrder={pdf.seriesOrder}
                  image={pdf.image}
                  fileUrl={pdf.fileUrl}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">💡 Características do Card de PDF:</h4>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>• <strong>Badge "PDF"</strong> com ícone de documento</li>
                <li>• <strong>Ícone de PDF</strong> sobreposto na imagem</li>
                <li>• <strong>Suporte a séries</strong> com numeração de volumes</li>
                <li>• <strong>Contador de páginas</strong> e downloads</li>
                <li>• <strong>Botão "Baixar" roxo acento</strong> e "Ler" outline</li>
                <li>• <strong>Indicação de série</strong> quando aplicável</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Separador */}
        <Separator className="my-12" />

        {/* Seção: Sugestões por Página */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-8">
            🎯 Sugestões de Componentes por Página
          </h2>

          {/* Dashboard */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              📊 Dashboard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Header do Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Header do Dashboard</CardTitle>
                  <CardDescription>Área superior com saudação e ações rápidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Bem-vindo, João!</h2>
                        <p className="text-gray-600 dark:text-dark-muted">Que tal continuar seus estudos hoje?</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cards de Métricas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cards de Métricas</CardTitle>
                  <CardDescription>Estatísticas principais do usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Módulos Completos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">45h</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Tempo de Estudo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso Geral */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso Geral</CardTitle>
                  <CardDescription>Visualização do progresso nas trilhas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Montanha do Amanhã</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Acervo Digital</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ações Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  <CardDescription>Botões para ações principais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full justify-start">
                      <Play className="w-4 h-4" />
                      Continuar Estudos
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="w-4 h-4" />
                      Explorar Acervo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4" />
                      Participar de Discussões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Sugestões para o Dashboard:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>Button variant="primary"</strong> para ações principais (Continuar Estudos)</li>
                <li>• <strong>Button variant="outline"</strong> para ações secundárias (Explorar, Participar)</li>
                <li>• <strong>Progress component</strong> para visualizar progresso das trilhas</li>
                <li>• <strong>MetricCard</strong> para estatísticas principais (módulos completos, tempo de estudo)</li>
                <li>• <strong>Badge variant="success"</strong> para indicar conquistas recentes</li>
              </ul>
            </div>
          </div>

          {/* Montanha do Amanhã */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              🏔️ Montanha do Amanhã
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Header da Trilha */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Header da Trilha</CardTitle>
                  <CardDescription>Cabeçalho com informações da trilha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Identificação - Treinando o seu olhar de Coruja</h2>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">Módulos fundamentais para identificação</p>
                    </div>
                    <Badge variant="info" size="md">6 módulos</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Módulo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card de Módulo</CardTitle>
                  <CardDescription>Card individual para cada módulo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 dark:bg-dark-border rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Imagem do Módulo</span>
                      </div>
                      <Badge variant="success" size="sm" className="absolute top-2 right-2">75%</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">Aspectos Cognitivos</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">Desenvolvimento intelectual</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">8 aulas • 2h 30min</span>
                      <Badge variant="warning" size="sm">Intermediário</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full">
                      Continuar <Play className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Sugestões para Montanha do Amanhã:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• <strong>ModernCard variant="elevated"</strong> para cards dos módulos (sombra destacada)</li>
                <li>• <strong>Badge variant="success"</strong> para progresso (75%)</li>
                <li>• <strong>Badge variant="warning"</strong> para nível Intermediário</li>
                <li>• <strong>Badge variant="info"</strong> para contador de módulos</li>
                <li>• <strong>Button variant="ghost"</strong> para ação "Continuar"</li>
                <li>• <strong>Progress component</strong> dentro dos cards para mostrar progresso detalhado</li>
              </ul>
            </div>
          </div>

          {/* Acervo Digital */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              📚 Acervo Digital
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card de Recurso */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card de Recurso</CardTitle>
                  <CardDescription>Card para PDFs, vídeos, checklists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center">
                        <Archive className="w-5 h-5 text-brand-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Guia Completo AHSD</h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">Manual completo para identificação</p>
                      </div>
                      <Badge variant="warning" size="sm">Novo</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          1.2k
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          4.9
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filtros</CardTitle>
                  <CardDescription>Controles para filtrar recursos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="default" size="sm">Todos</Badge>
                      <Badge variant="outline" size="sm">PDFs</Badge>
                      <Badge variant="outline" size="sm">Vídeos</Badge>
                      <Badge variant="outline" size="sm">Checklists</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                      Mais Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💡 Sugestões para Acervo Digital:</h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• <strong>ModernCard variant="default"</strong> para cards de recursos (mais sutil)</li>
                <li>• <strong>Button variant="outline"</strong> para ações de download</li>
                <li>• <strong>Badge variant="warning"</strong> para recursos novos</li>
                <li>• <strong>Badge variant="default"</strong> para filtro ativo</li>
                <li>• <strong>Badge variant="outline"</strong> para filtros inativos</li>
                <li>• <strong>Ícones específicos</strong> para tipos de arquivo (Archive, Play, Target)</li>
              </ul>
            </div>
          </div>

          {/* Rodas de Conversa */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              💬 Rodas de Conversa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card de Discussão */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card de Discussão</CardTitle>
                  <CardDescription>Card para discussões ativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Dúvidas sobre Desenvolvimento Motor</h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">Discussão sobre coordenação</p>
                      </div>
                      <Badge variant="success" size="sm">Ativa</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          23 participantes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          45 mensagens
                        </span>
                      </div>
                      <span>2h atrás</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4" />
                      Participar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nova Discussão */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Discussão</CardTitle>
                  <CardDescription>Formulário para criar nova discussão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-dark-muted">Iniciar nova discussão</p>
                    </div>
                    <Button variant="primary" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4" />
                      Criar Discussão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">💡 Sugestões para Rodas de Conversa:</h4>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>• <strong>ModernCard variant="default"</strong> para cards de discussão</li>
                <li>• <strong>Badge variant="success"</strong> para discussões ativas</li>
                <li>• <strong>Button variant="outline"</strong> para participar</li>
                <li>• <strong>Button variant="primary"</strong> para criar nova discussão</li>
                <li>• <strong>Ícone Users</strong> para representar discussões</li>
                <li>• <strong>Área de upload</strong> com border-dashed para nova discussão</li>
              </ul>
            </div>
          </div>

          {/* Plantão de Dúvidas */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
              ❓ Plantão de Dúvidas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card de Pergunta */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card de Pergunta</CardTitle>
                  <CardDescription>Card para perguntas e respostas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Como identificar hiperfoco?</h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">Meu filho fica muito focado...</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="error" size="sm">Urgente</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="info" size="sm">Cognitivo</Badge>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        3 respostas
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4" />
                      Ver Respostas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nova Pergunta */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Pergunta</CardTitle>
                  <CardDescription>Formulário para fazer nova pergunta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg text-center">
                      <HelpCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-dark-muted">Tem alguma dúvida?</p>
                    </div>
                    <Button variant="primary" size="sm" className="w-full">
                      <HelpCircle className="w-4 h-4" />
                      Fazer Pergunta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">💡 Sugestões para Plantão de Dúvidas:</h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• <strong>ModernCard variant="default"</strong> para cards de perguntas</li>
                <li>• <strong>Badge variant="error"</strong> para perguntas urgentes</li>
                <li>• <strong>Badge variant="success"</strong> para perguntas resolvidas</li>
                <li>• <strong>Badge variant="info"</strong> para categorias (Cognitivo, Rotina)</li>
                <li>• <strong>Button variant="ghost"</strong> para ver respostas</li>
                <li>• <strong>Button variant="primary"</strong> para fazer nova pergunta</li>
                <li>• <strong>Ícone HelpCircle</strong> para representar perguntas</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
