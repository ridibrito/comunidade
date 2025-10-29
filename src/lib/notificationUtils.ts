/**
 * Funções utilitárias para criar notificações automaticamente
 * Baseadas em eventos da aplicação
 */

import { Notification } from "@/components/ui/NotificationSystem";

/**
 * Cria uma notificação quando uma aula é concluída
 */
export function createLessonCompletedNotification(
  lessonName: string,
  moduleName?: string,
  trailName?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Aula Concluída",
    message: `Você completou a aula "${lessonName}"`,
    type: "success",
    metadata: {
      lesson: lessonName,
      module: moduleName,
      trail: trailName,
    },
    actionUrl: moduleName
      ? `/catalog/modulo/${moduleName.toLowerCase().replace(/\s+/g, "-")}`
      : undefined,
    actionText: "Ver Módulo",
  };
}

/**
 * Cria uma notificação quando um módulo é concluído
 */
export function createModuleCompletedNotification(
  moduleName: string,
  trailName?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Módulo Concluído",
    message: `Parabéns! Você finalizou o módulo "${moduleName}"`,
    type: "success",
    metadata: {
      module: moduleName,
      trail: trailName,
    },
    actionUrl: trailName ? `/catalog/montanha-do-amanha` : undefined,
    actionText: "Ver Trilha",
  };
}

/**
 * Cria uma notificação quando uma trilha é concluída
 */
export function createTrailCompletedNotification(
  trailName: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Trilha Concluída",
    message: `Incrível! Você finalizou toda a trilha "${trailName}"`,
    type: "success",
    metadata: {
      trail: trailName,
    },
    actionUrl: "/catalog/montanha-do-amanha",
    actionText: "Ver Outras Trilhas",
  };
}

/**
 * Cria uma notificação para novo conteúdo disponível
 */
export function createNewContentNotification(
  contentType: "lesson" | "module" | "trail",
  name: string,
  url?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  const messages = {
    lesson: "Nova aula disponível",
    module: "Novo módulo disponível",
    trail: "Nova trilha disponível",
  };

  return {
    title: messages[contentType],
    message: `${name} está disponível para você`,
    type: "info",
    metadata: {
      [contentType]: name,
    },
    actionUrl: url,
    actionText: "Ver Conteúdo",
  };
}

/**
 * Cria uma notificação de progresso atualizado
 */
export function createProgressNotification(
  progress: number,
  trailName?: string,
  message?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Progresso Atualizado",
    message: message || `Seu progresso foi atualizado`,
    type: "progress",
    progress,
    metadata: trailName ? { trail: trailName } : {},
  };
}

/**
 * Cria uma notificação de conquista desbloqueada
 */
export function createAchievementNotification(
  achievementName: string,
  description?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Conquista Desbloqueada",
    message: description || `Você desbloqueou a conquista "${achievementName}"`,
    type: "success",
    metadata: {
      achievement: achievementName,
    },
  };
}

/**
 * Cria uma notificação de aviso sobre conteúdo bloqueado
 */
export function createLockedContentNotification(
  contentType: "lesson" | "module",
  name: string,
  requirements?: string[]
): Omit<Notification, "id" | "read" | "createdAt"> {
  const requirementsText = requirements
    ? `Requisitos: ${requirements.join(", ")}`
    : "Complete os pré-requisitos para acessar";

  return {
    title: "Conteúdo Bloqueado",
    message: `A ${contentType === "lesson" ? "aula" : "módulo"} "${name}" requer pré-requisitos. ${requirementsText}`,
    type: "warning",
    metadata: {
      [contentType]: name,
    },
  };
}

/**
 * Cria uma notificação de lembrete de estudo
 */
export function createStudyReminderNotification(
  trailName: string,
  pendingLessons?: number
): Omit<Notification, "id" | "read" | "createdAt"> {
  const lessonsText = pendingLessons
    ? `Você tem ${pendingLessons} aula${pendingLessons > 1 ? "s" : ""} pendente${pendingLessons > 1 ? "s" : ""}`
    : "Você tem aulas pendentes";

  return {
    title: "Lembrete de Estudo",
    message: `${lessonsText} na trilha "${trailName}"`,
    type: "info",
    metadata: {
      trail: trailName,
    },
    actionUrl: "/catalog/montanha-do-amanha",
    actionText: "Continuar Estudos",
  };
}

/**
 * Cria uma notificação de avaliação recebida
 */
export function createRatingNotification(
  lessonName: string,
  rating: number
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: "Avaliação Recebida",
    message: `Você avaliou a aula "${lessonName}" com ${rating} estrela${rating > 1 ? "s" : ""}`,
    type: "success",
    metadata: {
      lesson: lessonName,
      rating,
    },
  };
}

/**
 * Cria uma notificação de erro genérica
 */
export function createErrorNotification(
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title,
    message,
    type: "error",
    actionUrl,
    actionText: actionText || "Tentar Novamente",
  };
}

/**
 * Cria uma notificação de sincronização
 */
export function createSyncNotification(
  success: boolean,
  message?: string
): Omit<Notification, "id" | "read" | "createdAt"> {
  return {
    title: success ? "Sincronização Concluída" : "Erro na Sincronização",
    message: message || (success ? "Seus dados foram sincronizados com sucesso" : "Não foi possível sincronizar seus dados"),
    type: success ? "success" : "error",
  };
}

