"use client";

import React from "react";
import Link from "next/link";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  Play, 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  Calendar,
  Video,
  Eye,
  Download,
  FileText,
  Book,
  MessageCircle,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Helper para cores de dificuldade com contraste melhorado
const getDifficultyColor = (difficulty: "Básico" | "Intermediário" | "Avançado") => {
  switch (difficulty) {
    case "Básico": return "success";
    case "Intermediário": return "warning";
    case "Avançado": return "error";
    default: return "default";
  }
};

// ========================================
// CARD PARA AULA EM VÍDEO GRAVADO (CURSO)
// ========================================
interface CardVideoAulaProps {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  progress?: number;
  rating?: number;
  isNew?: boolean;
  difficulty?: "Básico" | "Intermediário" | "Avançado";
  image: string;
  slug: string;
  className?: string;
}

export function CardVideoAula({
  title,
  description,
  instructor,
  duration,
  lessons,
  progress = 0,
  rating,
  isNew = false,
  difficulty = "Básico",
  image,
  slug,
  className = ""
}: CardVideoAulaProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico": return "success";
      case "Intermediário": return "warning";
      case "Avançado": return "error";
      default: return "default";
    }
  };

  return (
    <Link href={`/catalog/modulo/${slug}`} className="block h-full" onClick={() => console.log('🔗 Link clicado para:', `/catalog/modulo/${slug}`)}>
      <ModernCard variant="elevated" className={`h-full flex flex-col ${className} hover:shadow-lg transition-all duration-300 cursor-pointer`}>
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-brand-accent ml-1" />
              </div>
            </div>
          </div>
        
        {/* Badges sobrepostos */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge variant="warning" size="sm">Novo</Badge>}
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {progress > 0 && <Badge variant="success" size="sm">{progress}%</Badge>}
          {rating && (
            <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted mb-2 min-h-[2.5rem]">{description}</p>
          <p className="text-xs text-brand-accent font-medium">Instrutor: {instructor}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted mt-2">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {lessons} {lessons === 1 ? 'aula' : 'aulas'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
          </div>
          
          {/* Barra de progresso para vídeos do Vimeo */}
          {progress > 0 && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-dark-muted font-medium">Progresso</span>
                <span className="text-gray-500 dark:text-dark-muted">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-3">
          <Badge variant={getDifficultyColor(difficulty) as any} size="sm">
            {difficulty}
          </Badge>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-brand-accent hover:bg-brand-accent/90 text-white transition-colors"
          >
            {progress > 0 ? "Continuar" : "Começar"}
            <Play className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </ModernCard>
    </Link>
  );
}

// ========================================
// CARD PARA AULA AO VIVO (AGORA GRAVADA)
// ========================================
interface CardAulaAoVivoProps {
  title: string;
  description: string;
  instructor: string;
  originalDate: string;
  originalTime: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  progress?: number;
  rating?: number;
  image: string;
  recordingUrl: string;
  className?: string;
}

export function CardAulaAoVivo({
  title,
  description,
  instructor,
  originalDate,
  originalTime,
  duration,
  participants,
  maxParticipants,
  progress = 0,
  rating,
  image,
  recordingUrl,
  className = ""
}: CardAulaAoVivoProps) {
  return (
    <ModernCard variant="elevated" className={`h-full flex flex-col ${className}`}>
      <div className="relative">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {/* Replay indicator */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 dark:bg-dark-surface/90 rounded-full flex items-center justify-center shadow-lg">
              <RotateCcw className="w-8 h-8 text-brand-accent" />
            </div>
          </div>
        </div>
        
        {/* Badges sobrepostos */}
        <div className="absolute top-2 left-2">
          <Badge variant="info" size="sm">Replay</Badge>
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {rating && (
            <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
            <Users className="w-3 h-3 text-gray-600" />
            <span className="text-xs font-medium">{participants}/{maxParticipants}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted mb-2 min-h-[2.5rem]">{description}</p>
          <p className="text-xs text-brand-accent font-medium">Instrutor: {instructor}</p>
          
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
              <Calendar className="w-3 h-3" />
              <span>Ao vivo: {new Date(originalDate).toLocaleDateString('pt-BR')} às {originalTime}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
              <Clock className="w-3 h-3" />
              <span>Duração: {duration}</span>
            </div>
          </div>
          
          {/* Barra de progresso para vídeos do Vimeo */}
          {progress > 0 && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-dark-muted font-medium">Progresso</span>
                <span className="text-gray-500 dark:text-dark-muted">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-3">
          <Badge variant="outline" size="sm">
            {participants} participantes
          </Badge>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-brand-accent hover:bg-brand-accent/90 text-white transition-colors"
          >
            <Play className="w-3 h-3 mr-1" />
            Assistir Replay
          </Button>
        </div>
      </div>
    </ModernCard>
  );
}

// ========================================
// CARD PARA LIVROS
// ========================================
interface CardLivroProps {
  title: string;
  author: string;
  description: string;
  pages: number;
  rating?: number;
  downloads?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  image: string;
  fileUrl: string;
  className?: string;
}

export function CardLivro({
  title,
  author,
  description,
  pages,
  rating,
  downloads,
  isNew = false,
  isFeatured = false,
  image,
  fileUrl,
  className = ""
}: CardLivroProps) {
  return (
    <ModernCard variant="elevated" className={`h-full space-y-4 ${className}`}>
      <div className="relative">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        
        {/* Badges sobrepostos */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="brand" size="sm" className="flex items-center gap-1">
            <Book className="w-3 h-3" />
            Livro
          </Badge>
          {isNew && <Badge variant="warning" size="sm">Novo</Badge>}
          {isFeatured && <Badge variant="brand" size="sm">Destaque</Badge>}
        </div>
        
        <div className="absolute top-2 right-2">
          {rating && (
            <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{title}</h3>
          <p className="text-xs text-brand-accent font-medium mb-1">por {author}</p>
          <p className="text-sm text-gray-600 dark:text-dark-muted">{description}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {pages} páginas
          </div>
          {downloads && (
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {downloads.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <Badge variant="success" size="sm">Disponível</Badge>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600 dark:text-dark-muted hover:text-gray-800 dark:hover:text-dark-text"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-brand-accent hover:bg-brand-accent/90 text-white transition-colors"
            >
              <Download className="w-3 h-3 mr-1" />
              Baixar
            </Button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}

// ========================================
// CARD PARA PDFs
// ========================================
interface CardPDFProps {
  title: string;
  description: string;
  pages: number;
  rating?: number;
  downloads: number;
  isNew?: boolean;
  isFeatured?: boolean;
  series?: string;
  seriesOrder?: number;
  image: string;
  fileUrl: string;
  className?: string;
}

export function CardPDF({
  title,
  description,
  pages,
  rating,
  downloads,
  isNew = false,
  isFeatured = false,
  series,
  seriesOrder,
  image,
  fileUrl,
  className = ""
}: CardPDFProps) {
  return (
    <ModernCard variant="elevated" className={`h-full space-y-4 ${className}`}>
      <div className="relative">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {/* PDF icon overlay */}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 dark:bg-dark-surface/90 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        
        {/* Badges sobrepostos */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="error" size="sm" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            PDF
          </Badge>
          {isNew && <Badge variant="warning" size="sm">Novo</Badge>}
          {isFeatured && <Badge variant="brand" size="sm">Destaque</Badge>}
          {series && (
            <Badge variant="info" size="sm">Vol. {seriesOrder}</Badge>
          )}
        </div>
        
        <div className="absolute top-2 right-2">
          {rating && (
            <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted">{description}</p>
          {series && (
            <p className="text-xs text-brand-accent mt-1 font-medium">{series}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {pages} páginas
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {downloads.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <Badge variant="success" size="sm">Disponível</Badge>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600 dark:text-dark-muted hover:text-gray-800 dark:hover:text-dark-text"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-brand-accent hover:bg-brand-accent/90 text-white transition-colors"
            >
              <Download className="w-3 h-3 mr-1" />
              Baixar
            </Button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}
