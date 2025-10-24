"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Bell, Check, X } from "lucide-react";
import { Popover } from "./Popover";
import Button from "./Button";
import Badge from "./Badge";
import { NotificationList } from "./NotificationCard";
import { cn } from "@/lib/utils";

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
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover
      content={
        <div className="w-80 p-0">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
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
