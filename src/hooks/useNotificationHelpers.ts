/**
 * Hook para criar notificações de forma simplificada
 * Fornece métodos helper para criar diferentes tipos de notificações
 */

import { useNotifications } from "@/components/ui/NotificationSystem";
import { useCallback } from "react";

export function useNotificationHelpers() {
  const { addNotification } = useNotifications();

  const notifySuccess = useCallback(
    (title: string, message: string, options?: {
      actionUrl?: string;
      actionText?: string;
      metadata?: Record<string, any>;
    }) => {
      return addNotification({
        title,
        message,
        type: "success",
        ...options,
      });
    },
    [addNotification]
  );

  const notifyError = useCallback(
    (title: string, message: string, options?: {
      actionUrl?: string;
      actionText?: string;
      metadata?: Record<string, any>;
    }) => {
      return addNotification({
        title,
        message,
        type: "error",
        ...options,
      });
    },
    [addNotification]
  );

  const notifyWarning = useCallback(
    (title: string, message: string, options?: {
      actionUrl?: string;
      actionText?: string;
      metadata?: Record<string, any>;
    }) => {
      return addNotification({
        title,
        message,
        type: "warning",
        ...options,
      });
    },
    [addNotification]
  );

  const notifyInfo = useCallback(
    (title: string, message: string, options?: {
      actionUrl?: string;
      actionText?: string;
      metadata?: Record<string, any>;
    }) => {
      return addNotification({
        title,
        message,
        type: "info",
        ...options,
      });
    },
    [addNotification]
  );

  const notifyProgress = useCallback(
    (
      title: string,
      message: string,
      progress: number,
      options?: {
        actionUrl?: string;
        actionText?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      return addNotification({
        title,
        message,
        type: "progress",
        progress,
        ...options,
      });
    },
    [addNotification]
  );

  // Métodos específicos para eventos da aplicação
  const notifyLessonCompleted = useCallback(
    (lessonName: string, moduleName?: string, trailName?: string) => {
      return addNotification({
        title: "Aula Concluída",
        message: `Você completou a aula "${lessonName}"`,
        type: "success",
        metadata: {
          lesson: lessonName,
          module: moduleName,
          trail: trailName,
        },
        actionUrl: moduleName ? `/catalog/modulo/${moduleName.toLowerCase().replace(/\s+/g, "-")}` : undefined,
        actionText: "Ver Módulo",
      });
    },
    [addNotification]
  );

  const notifyModuleCompleted = useCallback(
    (moduleName: string, trailName?: string) => {
      return addNotification({
        title: "Módulo Concluído",
        message: `Parabéns! Você finalizou o módulo "${moduleName}"`,
        type: "success",
        metadata: {
          module: moduleName,
          trail: trailName,
        },
        actionUrl: trailName ? `/catalog/montanha-do-amanha` : undefined,
        actionText: "Ver Trilha",
      });
    },
    [addNotification]
  );

  const notifyTrailCompleted = useCallback(
    (trailName: string) => {
      return addNotification({
        title: "Trilha Concluída",
        message: `Incrível! Você finalizou toda a trilha "${trailName}"`,
        type: "success",
        metadata: {
          trail: trailName,
        },
        actionUrl: "/catalog/montanha-do-amanha",
        actionText: "Ver Outras Trilhas",
      });
    },
    [addNotification]
  );

  const notifyNewContent = useCallback(
    (contentType: "lesson" | "module" | "trail", name: string, url?: string) => {
      const messages = {
        lesson: "Nova aula disponível",
        module: "Novo módulo disponível",
        trail: "Nova trilha disponível",
      };

      return addNotification({
        title: messages[contentType],
        message: `${name} está disponível para você`,
        type: "info",
        metadata: {
          [contentType]: name,
        },
        actionUrl: url,
        actionText: "Ver Conteúdo",
      });
    },
    [addNotification]
  );

  const notifyProgressUpdate = useCallback(
    (progress: number, trailName?: string, message?: string) => {
      return addNotification({
        title: "Progresso Atualizado",
        message: message || `Seu progresso foi atualizado`,
        type: "progress",
        progress,
        metadata: trailName ? { trail: trailName } : {},
      });
    },
    [addNotification]
  );

  const notifyAchievement = useCallback(
    (achievementName: string, description?: string) => {
      return addNotification({
        title: "Conquista Desbloqueada",
        message: description || `Você desbloqueou a conquista "${achievementName}"`,
        type: "success",
        metadata: {
          achievement: achievementName,
        },
      });
    },
    [addNotification]
  );

  return {
    // Métodos básicos
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyProgress,
    // Métodos específicos de eventos
    notifyLessonCompleted,
    notifyModuleCompleted,
    notifyTrailCompleted,
    notifyNewContent,
    notifyProgressUpdate,
    notifyAchievement,
  };
}

