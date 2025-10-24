"use client";

import { toast } from "sonner";

export function useSonner() {
  const success = (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    return toast.success(title, {
      description,
      duration: 5000,
      action,
    });
  };

  const error = (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    return toast.error(title, {
      description,
      duration: 7000,
      action,
    });
  };

  const warning = (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    return toast.warning(title, {
      description,
      duration: 6000,
      action,
    });
  };

  const info = (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    return toast.info(title, {
      description,
      duration: 5000,
      action,
    });
  };

  const loading = (title: string, description?: string) => {
    return toast.loading(title, {
      description,
    });
  };

  const dismiss = (toastId?: string | number) => {
    return toast.dismiss(toastId);
  };

  const dismissAll = () => {
    return toast.dismiss();
  };

  const promise = <T>(
    promise: Promise<T>,
    {
      loading: loadingTitle,
      success: successTitle,
      error: errorTitle,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingTitle,
      success: successTitle,
      error: errorTitle,
    });
  };

  // Toast específicos para a aplicação
  const lessonCompleted = (lessonTitle: string) => {
    return success("Aula Concluída! 🎉", `Parabéns! Você completou "${lessonTitle}"`);
  };

  const moduleCompleted = (moduleTitle: string) => {
    return success("Módulo Concluído! 🏆", `Excelente! Você finalizou "${moduleTitle}"`);
  };

  const trailCompleted = (trailTitle: string) => {
    return success("Trilha Concluída! 🚀", `Incrível! Você finalizou toda a trilha "${trailTitle}"`);
  };

  const videoError = (error?: string) => {
    return error("Erro no Vídeo", error || "Não foi possível carregar o vídeo. Verifique sua conexão.");
  };

  const contentBlocked = (reason?: string) => {
    return warning("Conteúdo Bloqueado", reason || "Esta aula requer pré-requisitos. Complete as aulas anteriores.");
  };

  const newUpdate = (details?: string) => {
    return info("Nova Atualização", details || "Novos recursos disponíveis na plataforma. Explore as novas funcionalidades!");
  };

  const saveProgress = () => {
    return success("Progresso Salvo", "Seu progresso foi salvo automaticamente");
  };

  const ratingSaved = (rating: number) => {
    return success("Avaliação Salva", `Você avaliou esta aula com ${rating} estrelas`);
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    promise,
    // Toasts específicos da aplicação
    lessonCompleted,
    moduleCompleted,
    trailCompleted,
    videoError,
    contentBlocked,
    newUpdate,
    saveProgress,
    ratingSaved,
  };
}
