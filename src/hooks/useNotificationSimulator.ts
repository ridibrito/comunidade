"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/components/ui/NotificationSystem";

const notificationTemplates = [
  {
    title: "Aula Concluída",
    message: "Você completou a aula 'Aspectos Cognitivos - Aula 01'",
    type: "success" as const,
    metadata: {
      lesson: "Aspectos Cognitivos - Aula 01",
      module: "Aspectos Cognitivos",
      trail: "Identificação"
    }
  },
  {
    title: "Progresso Salvo",
    message: "Seu progresso foi salvo automaticamente",
    type: "success" as const,
    progress: 75,
    metadata: {
      trail: "Identificação"
    }
  },
  {
    title: "Nova Atualização",
    message: "Novos recursos de IA estão disponíveis na plataforma",
    type: "info" as const,
    actionUrl: "/ai",
    actionText: "Explorar IA"
  },
  {
    title: "Conteúdo Bloqueado",
    message: "A aula 'Avaliação - Aula 02' requer pré-requisitos",
    type: "warning" as const,
    actionUrl: "/catalog/modulo/avaliacao",
    actionText: "Ver Pré-requisitos",
    metadata: {
      lesson: "Avaliação - Aula 02"
    }
  },
  {
    title: "Avaliação Recebida",
    message: "Você avaliou a aula 'Aspectos Cognitivos - Aula 01' com 5 estrelas",
    type: "success" as const,
    metadata: {
      lesson: "Aspectos Cognitivos - Aula 01",
      rating: 5
    }
  },
  {
    title: "Módulo Concluído",
    message: "Parabéns! Você finalizou o módulo 'Aspectos Cognitivos'",
    type: "success" as const,
    metadata: {
      module: "Aspectos Cognitivos",
      trail: "Identificação"
    }
  },
  {
    title: "Trilha Concluída",
    message: "Incrível! Você finalizou toda a trilha 'Identificação'",
    type: "success" as const,
    metadata: {
      trail: "Identificação"
    }
  },
  {
    title: "Erro no Vídeo",
    message: "Não foi possível carregar o vídeo. Verifique sua conexão.",
    type: "error" as const,
    actionUrl: "/catalog/modulo/aspectos-cognitivos",
    actionText: "Tentar Novamente"
  },
  {
    title: "Sincronização Concluída",
    message: "Seus dados foram sincronizados com sucesso",
    type: "success" as const
  },
  {
    title: "Lembrete de Estudo",
    message: "Você tem aulas pendentes na trilha 'Identificação'",
    type: "info" as const,
    actionUrl: "/catalog/montanha-do-amanha",
    actionText: "Continuar Estudos",
    metadata: {
      trail: "Identificação"
    }
  }
];

export function useNotificationSimulator(intervalMs: number = 30000) {
  const { addNotification } = useNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);

  const startSimulator = () => {
    if (isActiveRef.current) return;
    
    isActiveRef.current = true;
    
    const sendRandomNotification = () => {
      const randomTemplate = notificationTemplates[
        Math.floor(Math.random() * notificationTemplates.length)
      ];
      
      addNotification(randomTemplate);
    };

    // Enviar primeira notificação imediatamente
    sendRandomNotification();

    // Configurar intervalo para notificações subsequentes
    intervalRef.current = setInterval(sendRandomNotification, intervalMs);
  };

  const stopSimulator = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
  };

  const isActive = () => isActiveRef.current;

  // Cleanup automático quando o componente for desmontado
  useEffect(() => {
    return () => {
      stopSimulator();
    };
  }, []);

  return {
    startSimulator,
    stopSimulator,
    isActive,
  };
}