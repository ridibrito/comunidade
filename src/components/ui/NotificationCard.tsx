"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Card, { CardContent, CardHeader } from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { ScrollArea } from "./ScrollArea";
import { Progress } from "./Progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  User, 
  BookOpen,
  Star,
  Download,
  ExternalLink
} from "lucide-react";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info" | "progress";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  progress?: number;
  icon?: ReactNode;
  metadata?: {
    user?: string;
    lesson?: string;
    module?: string;
    trail?: string;
    rating?: number;
  };
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string) => void;
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  progress: {
    icon: Clock,
    color: "text-brand-accent",
    bgColor: "bg-brand-accent/10",
    borderColor: "border-brand-accent/20",
  },
};

export function NotificationCard({
  id,
  title,
  message,
  type,
  timestamp,
  read,
  actionUrl,
  actionText,
  progress,
  icon,
  metadata,
  onMarkAsRead,
  onAction,
  className,
}: NotificationCardProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const formatTimestamp = (date: Date | undefined) => {
    if (!date) return "Agora";
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !read) {
      onMarkAsRead(id);
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction(id);
    }
    if (actionUrl) {
      window.open(actionUrl, '_blank');
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        !read && "ring-2 ring-brand-accent/20",
        config.bgColor,
        config.borderColor,
        className
      )}
      onClick={handleMarkAsRead}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", config.bgColor)}>
              {icon || <IconComponent className={cn("size-4", config.color)} />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "text-sm font-medium truncate",
                read ? "text-light-muted dark:text-dark-muted" : "text-light-text dark:text-dark-text"
              )}>
                {title}
              </h4>
              <p className="text-xs text-light-muted dark:text-dark-muted">
                {formatTimestamp(timestamp)}
              </p>
            </div>
          </div>
          {!read && (
            <div className="w-2 h-2 bg-brand-accent rounded-full flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className={cn(
          "text-sm mb-3",
          read ? "text-light-muted dark:text-dark-muted" : "text-light-text dark:text-dark-text"
        )}>
          {message}
        </p>

        {progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-light-muted dark:text-dark-muted mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {metadata && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.user && (
              <Badge variant="outline" className="text-xs">
                <User className="size-3 mr-1" />
                {metadata.user}
              </Badge>
            )}
            {metadata.lesson && (
              <Badge variant="outline" className="text-xs">
                <BookOpen className="size-3 mr-1" />
                {metadata.lesson}
              </Badge>
            )}
            {metadata.rating && (
              <Badge variant="outline" className="text-xs">
                <Star className="size-3 mr-1" />
                {metadata.rating} estrelas
              </Badge>
            )}
          </div>
        )}

        {(actionUrl || actionText) && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            className="w-full"
          >
            {actionText || "Ver Detalhes"}
            <ExternalLink className="size-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface NotificationListProps {
  notifications: NotificationCardProps[];
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onAction,
  onMarkAllAsRead,
  className,
}: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={cn("space-y-4", className)}>
      {notifications.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h3>
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
      )}

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-light-muted dark:bg-dark-muted rounded-full flex items-center justify-center mb-4">
                <Info className="size-6 text-light-muted dark:text-dark-muted" />
              </div>
              <p className="text-light-muted dark:text-dark-muted">
                Nenhuma notificação disponível
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                {...notification}
                onMarkAsRead={onMarkAsRead}
                onAction={onAction}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
