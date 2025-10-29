"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Bell, Check, X } from "lucide-react";
import { Popover } from "./Popover";
import Button from "./Button";
import Badge from "./Badge";
import { NotificationList } from "./NotificationCard";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "progress";
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
  progress?: number;
  metadata?: {
    user?: string;
    lesson?: string;
    module?: string;
    trail?: string;
    rating?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// Função auxiliar para converter notificação do banco para o formato esperado
function mapNotificationFromDB(dbNotification: any): Notification {
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    read: dbNotification.read,
    createdAt: new Date(dbNotification.created_at),
    actionUrl: dbNotification.action_url,
    actionText: dbNotification.action_text,
    progress: dbNotification.progress,
    metadata: dbNotification.metadata || {},
  };
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Buscar notificações do servidor
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications?limit=50");
      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }
      const data = await response.json();
      const mappedNotifications = data.notifications.map(mapNotificationFromDB);
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar notificações ao montar o componente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Configurar sincronização em tempo real com Supabase
  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe para mudanças na tabela de notificações
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // Recarregar notificações quando houver mudanças
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  const addNotification = useCallback(async (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          progress: notification.progress,
          metadata: notification.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar notificação");
      }

      const data = await response.json();
      const newNotification = mapNotificationFromDB(data.notification);
      
      // Atualizar estado local imediatamente para feedback instantâneo
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      // Fallback: adicionar notificação localmente se a API falhar
      const fallbackNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date(),
      };
      setNotifications(prev => [fallbackNotification, ...prev]);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // Otimista: atualizar UI imediatamente
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, read: true }),
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar como lida");
      }
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      // Reverter em caso de erro
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: false } : n)
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Otimista: atualizar UI imediatamente
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar todas como lidas");
      }
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      // Recarregar do servidor em caso de erro
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const removeNotification = useCallback(async (id: string) => {
    // Otimista: remover da UI imediatamente
    const removedNotification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover notificação");
      }
    } catch (error) {
      console.error("Erro ao remover notificação:", error);
      // Restaurar notificação em caso de erro
      if (removedNotification) {
        setNotifications(prev => [...prev, removedNotification].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        ));
      }
    }
  }, [notifications]);

  const clearAll = useCallback(async () => {
    // Marcar todas como lidas primeiro
    await markAllAsRead();
    // Depois remover todas
    setNotifications([]);
  }, [markAllAsRead]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  // Converter notificações para o formato esperado pelo NotificationCard
  const mappedNotifications = notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    timestamp: notification.createdAt,
    read: notification.read,
    actionUrl: notification.actionUrl,
    actionText: notification.actionText,
    progress: notification.progress,
    metadata: notification.metadata,
  }));

  return (
    <Popover
      content={
        <div className="w-80 p-4 bg-light-surface dark:bg-dark-surface">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-light-muted dark:text-dark-muted">Carregando...</div>
            </div>
          ) : (
            <NotificationList
              notifications={mappedNotifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          )}
        </div>
      }
    >
      <div className="relative">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer hover-brand-subtle text-light-muted dark:text-dark-muted relative"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </div>
    </Popover>
  );
}
