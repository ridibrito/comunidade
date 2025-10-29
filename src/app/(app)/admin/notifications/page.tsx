"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Eye,
  Info,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldQuestion,
  Trash2,
  XCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { useToastContext } from "@/components/providers/ToastProvider";

type NotificationType = "info" | "success" | "warning" | "error" | "progress";

interface AdminNotificationUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
}

interface AdminNotification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl: string | null;
  actionText: string | null;
  progress: number | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  user: AdminNotificationUser | null;
}

interface NotificationStats {
  total: number;
  unread: number;
  last7Days: number;
  byType: Record<NotificationType, number>;
}

interface NotificationPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface AdminUserOption {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "aluno" | "profissional" | null;
}

type TargetMode = "single" | "all" | "admins" | "students" | "professionals";

const NOTIFICATION_TYPES: Array<{
  value: NotificationType;
  label: string;
  description: string;
  icon: typeof Info;
}> = [
  {
    value: "info",
    label: "Informacao",
    description: "Atualizacoes gerais e lembretes",
    icon: Info,
  },
  {
    value: "success",
    label: "Sucesso",
    description: "Conquistas e conclusoes de etapas",
    icon: CheckCircle,
  },
  {
    value: "warning",
    label: "Alerta",
    description: "Avisos importantes que exigem atencao",
    icon: AlertTriangle,
  },
  {
    value: "error",
    label: "Erro",
    description: "Falhas em processos ou integracoes",
    icon: XCircle,
  },
  {
    value: "progress",
    label: "Progresso",
    description: "Atualizacoes com indicador percentual",
    icon: MessageSquare,
  },
];

const TARGET_OPTIONS: Array<{ value: TargetMode; label: string }> = [
  { value: "single", label: "Apenas um usuario" },
  { value: "all", label: "Todos os usuarios" },
  { value: "admins", label: "Somente administradores" },
  { value: "students", label: "Somente alunos" },
  { value: "professionals", label: "Somente profissionais" },
];

const ALL_USERS_VALUE = "__all__";
function formatDateTime(input: string) {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatRelative(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `ha ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `ha ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `ha ${days} d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `ha ${weeks} sem`;
  const months = Math.floor(days / 30);
  if (months < 12) return `ha ${months} mes`;
  const years = Math.floor(days / 365);
  return `ha ${years} ano`;
}

export default function AdminNotificationsPage() {
  const { success, error: toastError, info: toastInfo } = useToastContext();

  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    last7Days: 0,
    byType: {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      progress: 0,
    },
  });
  const [pagination, setPagination] = useState<NotificationPagination>({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
  });
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [loadedUsers, setLoadedUsers] = useState(false);

  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all");
  const [filterUser, setFilterUser] = useState<string>(ALL_USERS_VALUE);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null);

  const [targetMode, setTargetMode] = useState<TargetMode>("single");
  const [formUserId, setFormUserId] = useState<string>("");
  const [formType, setFormType] = useState<NotificationType>("info");
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formActionUrl, setFormActionUrl] = useState("");
  const [formActionText, setFormActionText] = useState("");
  const [formProgress, setFormProgress] = useState("");
  const [formMetadata, setFormMetadata] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);
  const loadUsers = useCallback(async () => {
    if (loadedUsers) return;
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      setUsers(
        (payload?.users ?? []).map((user: AdminUserOption) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email ?? null,
          role: user.role ?? null,
        }))
      );
      setLoadedUsers(true);
    } catch (err) {
      console.error("Erro ao carregar usuarios:", err);
      toastError(
        "Falha ao carregar usuarios",
        "Verifique se a API /api/admin/users esta acessivel."
      );
    } finally {
      setLoadingUsers(false);
    }
  }, [loadedUsers, toastError]);

  const fetchNotifications = useCallback(
    async (page = pagination.page) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(pagination.pageSize));

        if (filterType !== "all") {
          params.set("type", filterType);
        }
        if (filterRead === "read") {
          params.set("read", "true");
        } else if (filterRead === "unread") {
          params.set("read", "false");
        }
        if (filterUser !== ALL_USERS_VALUE) {
          params.set("userId", filterUser);
        }
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const response = await fetch(
          `/api/admin/notifications?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        setNotifications(payload.notifications ?? []);
        setStats(payload.stats);
        setPagination(payload.pagination);
      } catch (err) {
        console.error("Erro ao buscar notificacoes:", err);
        toastError(
          "Falha ao carregar notificacoes",
          "Verifique a API admin/notifications."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.page,
      pagination.pageSize,
      filterType,
      filterRead,
      filterUser,
      debouncedSearch,
      toastError,
    ]
  );

  useEffect(() => {
    fetchNotifications(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterRead, filterUser, debouncedSearch]);

  useEffect(() => {
    if (pagination.page > 1) {
      fetchNotifications(pagination.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormTitle("");
    setFormMessage("");
    setFormActionUrl("");
    setFormActionText("");
    setFormProgress("");
    setFormMetadata("");
    setFormUserId("");
    setTargetMode("single");
    setFormType("info");
  };

  const resolveTargets = useCallback((): string[] => {
    if (targetMode === "single") {
      return formUserId ? [formUserId] : [];
    }

    if (users.length === 0) {
      return [];
    }

    if (targetMode === "all") {
      return users.map((user) => user.id);
    }

    const roleMap: Record<TargetMode, AdminUserOption["role"]> = {
      single: null,
      all: null,
      admins: "admin",
      students: "aluno",
      professionals: "profissional",
    };

    const targetRole = roleMap[targetMode];
    if (!targetRole) {
      return [];
    }

    return users
      .filter((user) => user.role === targetRole)
      .map((user) => user.id);
  }, [targetMode, formUserId, users]);

  const handleCreateNotification = useCallback(async () => {
    if (!formTitle.trim() || !formMessage.trim()) {
      toastError("Preencha titulo e mensagem antes de enviar.");
      return;
    }

    const targets = resolveTargets();
    if (targets.length === 0) {
      toastError("Nenhum destinatario selecionado.");
      return;
    }

    let parsedMetadata: Record<string, unknown> | undefined;
    if (formMetadata.trim().length > 0) {
      try {
        const parsed = JSON.parse(formMetadata);
        if (typeof parsed === "object" && parsed !== null) {
          parsedMetadata = parsed as Record<string, unknown>;
        } else {
          throw new Error("Metadata precisa ser um objeto JSON.");
        }
      } catch (err) {
        toastError(
          "Metadata invalido",
          "Use um JSON valido (por exemplo: {\"lesson\": \"Nome\"})."
        );
        return;
      }
    }

    const progressValue = Number(formProgress);
    const payload = {
      userIds: targets,
      title: formTitle.trim(),
      message: formMessage.trim(),
      type: formType,
      actionUrl: formActionUrl.trim() || null,
      actionText: formActionText.trim() || null,
      progress: Number.isNaN(progressValue) ? undefined : progressValue,
      metadata: parsedMetadata,
    };

    try {
      setSubmitting(true);
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const details = await response.json().catch(() => null);
        throw new Error(details?.error || "Falha ao criar notificacao");
      }

      const result = await response.json();
      success(
        "Notificacao criada",
        `Enviada para ${result?.created?.length ?? targets.length} destinatario(s).`
      );
      resetForm();
      fetchNotifications(1);
    } catch (err) {
      console.error("Erro ao criar notificacao:", err);
      toastError(
        "Nao foi possivel criar a notificacao",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    formTitle,
    formMessage,
    formActionUrl,
    formActionText,
    formProgress,
    formMetadata,
    formType,
    success,
    toastError,
    resolveTargets,
    fetchNotifications,
  ]);

  const handleMarkRead = useCallback(
    async (id: string, read: boolean) => {
      try {
        const response = await fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, read }),
        });
        if (!response.ok) {
          throw new Error("Falha ao atualizar status");
        }
        toastInfo(read ? "Notificacao marcada como lida" : "Marcada como nao lida");
        fetchNotifications(pagination.page);
      } catch (err) {
        console.error("Erro ao alterar status de leitura:", err);
        toastError("Nao foi possivel alterar o status de leitura.");
      }
    },
    [fetchNotifications, pagination.page, toastError, toastInfo]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        "Deseja realmente remover esta notificacao?"
      );
      if (!confirmed) return;
      try {
        const response = await fetch(`/api/admin/notifications?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Falha ao excluir notificacao");
        }
        toastInfo("Notificacao removida.");
        fetchNotifications(pagination.page);
      } catch (err) {
        console.error("Erro ao excluir notificacao:", err);
        toastError("Nao foi possivel excluir a notificacao.");
      }
    },
    [fetchNotifications, pagination.page, toastError, toastInfo]
  );

  const handleMarkAllForUser = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "markAllReadForUser", userId }),
        });
        if (!response.ok) {
          throw new Error("Falha ao marcar notificacoes como lidas");
        }
        toastInfo("Todas as notificacoes desse usuario foram marcadas como lidas.");
        fetchNotifications(pagination.page);
      } catch (err) {
        console.error("Erro ao marcar todas como lidas:", err);
        toastError("Nao foi possivel marcar as notificacoes como lidas.");
      }
    },
    [fetchNotifications, pagination.page, toastError, toastInfo]
  );

  const filteredTypeLabel = useMemo(() => {
    if (filterType === "all") return "Todas";
    return NOTIFICATION_TYPES.find((item) => item.value === filterType)?.label;
  }, [filterType]);

  const currentUserSelection = useMemo(() => {
    if (filterUser === ALL_USERS_VALUE) return "Todos";
    const user = users.find((item) => item.id === filterUser);
    return user?.full_name || user?.email || "Usuario";
  }, [filterUser, users]);

  const targetInfo = useMemo(() => {
    switch (targetMode) {
      case "all":
        return "Envia para todos os perfis cadastrados.";
      case "admins":
        return "Envia apenas para usuarios com papel admin.";
      case "students":
        return "Envia para usuarios com papel aluno.";
      case "professionals":
        return "Envia para usuarios com papel profissional.";
      default:
        return "Selecione um usuario especifico para o envio.";
    }
  }, [targetMode]);
  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Painel de notificacoes"
          subtitle="Acompanhe envios, configure alertas e acione comunicados para a comunidade."
          icon={<Bell className="h-8 w-8 text-brand-accent" />}
          actions={
            <Button
              variant="outline"
              onClick={() => {
                fetchNotifications(pagination.page);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          <MetricCard
            title="Total de notificacoes"
            value={stats.total}
            description="Todas as notificacoes registradas na plataforma"
            icon={<Bell className="h-12 w-12 text-brand-accent" />}
          />
          <MetricCard
            title="Nao lidas"
            value={stats.unread}
            description="Notificacoes aguardando visualizacao"
            icon={<AlertTriangle className="h-12 w-12 text-yellow-500" />}
          />
          <MetricCard
            title="Ultimos 7 dias"
            value={stats.last7Days}
            description="Volume de notificacoes criadas na ultima semana"
            icon={<Info className="h-12 w-12 text-blue-500" />}
          />
          <MetricCard
            title="Tipos ativos"
            value={Object.values(stats.byType).filter((value) => value > 0).length}
            description="Quantidade de categorias com notificacoes recentes"
            icon={<ShieldQuestion className="h-12 w-12 text-emerald-500" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <ModernCard className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  Tipo: {filteredTypeLabel}
                </Badge>
                <Badge variant="outline">
                  Status: {filterRead === "all" ? "Todos" : filterRead === "read" ? "Lidos" : "Nao lidos"}
                </Badge>
                <Badge variant="outline">Usuario: {currentUserSelection}</Badge>
                {debouncedSearch && (
                  <Badge variant="outline">Busca: {debouncedSearch}</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filterType}
                  onValueChange={(value) =>
                    setFilterType(value as NotificationType | "all")
                  }
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Filtrar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {NOTIFICATION_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterRead}
                  onValueChange={(value) =>
                    setFilterRead(value as "all" | "read" | "unread")
                  }
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="read">Somente lidas</SelectItem>
                    <SelectItem value="unread">Somente nao lidas</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterUser}
                  onValueChange={(value) => setFilterUser(value)}
                  onOpenChange={(open) => {
                    if (open) loadUsers();
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Filtrar usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_USERS_VALUE}>Todos os usuarios</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email || user.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Buscar por titulo ou mensagem..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="md:max-w-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("all");
                    setFilterRead("all");
                    setFilterUser(ALL_USERS_VALUE);
                    setSearch("");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-light-border/40 dark:border-dark-border/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notificacao</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Criada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        Carregando notificacoes...
                      </TableCell>
                    </TableRow>
                  ) : notifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        Nenhuma notificacao encontrada com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifications.map((notification) => {
                      const typeData = NOTIFICATION_TYPES.find(
                        (item) => item.value === notification.type
                      );
                      const TypeIcon = typeData?.icon ?? Info;
                      return (
                        <TableRow
                          key={notification.id}
                          className="align-top"
                        >
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4 text-brand-accent" />
                                <span className="font-medium text-light-text dark:text-dark-text">
                                  {notification.title}
                                </span>
                              </div>
                              <p className="text-sm text-light-muted dark:text-dark-muted line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.type === "progress" && (
                                <Badge variant="outline">
                                  Progresso: {notification.progress ?? 0}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {notification.user?.name ||
                                  notification.user?.email ||
                                  "Usuario removido"}
                              </span>
                              {notification.user?.role && (
                                <span className="text-xs text-light-muted dark:text-dark-muted">
                                  Papel: {notification.user.role}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDateTime(notification.createdAt)}</span>
                              <span className="text-xs text-light-muted dark:text-dark-muted">
                                {formatRelative(notification.createdAt)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant={
                                  notification.read ? "success" : "warning"
                                }
                              >
                                {notification.read ? "Lida" : "Nao lida"}
                              </Badge>
                              <Badge variant="outline">{notification.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Visualizar detalhes"
                                onClick={() => setSelectedNotification(notification)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title={
                                  notification.read
                                    ? "Marcar como nao lida"
                                    : "Marcar como lida"
                                }
                                onClick={() =>
                                  handleMarkRead(notification.id, !notification.read)
                                }
                              >
                                {notification.read ? (
                                  <XCircle className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Marcar todas desse usuario como lidas"
                                disabled={!notification.userId}
                                onClick={() => {
                                  if (notification.userId) {
                                    handleMarkAllForUser(notification.userId);
                                  }
                                }}
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                title="Excluir notificacao"
                                onClick={() => handleDelete(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span className="text-sm text-light-muted dark:text-dark-muted">
                Mostrando pagina {pagination.page} de {pagination.totalPages} (
                {pagination.totalItems} notificacoes)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => {
                    const prevPage = Math.max(1, pagination.page - 1);
                    setPagination((state) => ({ ...state, page: prevPage }));
                    fetchNotifications(prevPage);
                  }}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => {
                    const nextPage = Math.min(
                      pagination.totalPages,
                      pagination.page + 1
                    );
                    setPagination((state) => ({ ...state, page: nextPage }));
                    fetchNotifications(nextPage);
                  }}
                >
                  Proxima
                </Button>
              </div>
            </div>
          </ModernCard>

          <div className="space-y-6">
            <ModernCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Distribuicao por tipo
                </h3>
                <Badge variant="outline">Total: {stats.total}</Badge>
              </div>
              <div className="space-y-3">
                {NOTIFICATION_TYPES.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center justify-between rounded-lg bg-light-border/10 dark:bg-dark-border/10 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-brand-accent" />
                      <div>
                        <p className="text-sm font-medium text-light-text dark:text-dark-text">
                          {item.label}
                        </p>
                        <p className="text-xs text-light-muted dark:text-dark-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {stats.byType[item.value]}
                    </Badge>
                  </div>
                ))}
              </div>
            </ModernCard>

            <ModernCard className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    Criar notificacao
                  </h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    Envie comunicados customizados para usuarios ou grupos.
                  </p>
                </div>
                <Plus className="h-6 w-6 text-brand-accent" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Destinatarios
                </label>
                <Select
                  value={targetMode}
                  onValueChange={(value) =>
                    setTargetMode(value as TargetMode)
                  }
                  onOpenChange={(open) => {
                    if (open) loadUsers();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os destinatarios" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-light-muted dark:text-dark-muted">
                  {targetInfo}
                </p>
              </div>

              {targetMode === "single" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-light-text dark:text-dark-text">
                    Usuario
                  </label>
                  <Select
                    value={formUserId}
                    onValueChange={(value) => setFormUserId(value)}
                    onOpenChange={(open) => {
                      if (open) loadUsers();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingUsers && (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      )}
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name || user.email || user.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Tipo da notificacao
                </label>
                <Select
                  value={formType}
                  onValueChange={(value) =>
                    setFormType(value as NotificationType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Titulo
                </label>
                <Input
                  placeholder="Ex: Novo modulo liberado"
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Mensagem
                </label>
                <Textarea
                  placeholder="Conteudo principal da notificacao..."
                  value={formMessage}
                  onChange={(event) => setFormMessage(event.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-light-text dark:text-dark-text">
                    URL de acao (opcional)
                  </label>
                  <Input
                    placeholder="https://"
                    value={formActionUrl}
                    onChange={(event) =>
                      setFormActionUrl(event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-light-text dark:text-dark-text">
                    Texto do botao (opcional)
                  </label>
                  <Input
                    placeholder="Ver detalhes"
                    value={formActionText}
                    onChange={(event) =>
                      setFormActionText(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Progresso (0 a 100, opcional)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Ex: 75"
                  value={formProgress}
                  onChange={(event) => setFormProgress(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  Metadata JSON (opcional)
                </label>
                <Textarea
                  placeholder='{"lesson": "Nome da aula"}'
                  value={formMetadata}
                  onChange={(event) => setFormMetadata(event.target.value)}
                  rows={3}
                />
                <p className="text-xs text-light-muted dark:text-dark-muted">
                  Inclua dados extras para contextualizar a notificacao (ex:
                  lesson, module, trail, rating).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Limpar
                </Button>
                <Button onClick={handleCreateNotification} disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar notificacao"}
                </Button>
              </div>
            </ModernCard>
          </div>
        </div>
      </Section>
      <Modal
        open={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                  {selectedNotification.title}
                </h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">
                  Criada em {formatDateTime(selectedNotification.createdAt)} (
                  {formatRelative(selectedNotification.createdAt)})
                </p>
              </div>
              <Badge variant="outline">{selectedNotification.type}</Badge>
            </div>

            <p className="text-sm leading-relaxed text-light-text dark:text-dark-text">
              {selectedNotification.message}
            </p>

            <div className="space-y-3 rounded-lg bg-light-border/10 p-4 dark:bg-dark-border/10">
              <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                Destinatario
              </h4>
              <div className="grid gap-1 text-sm">
                <span>
                  <strong>Nome:</strong> {selectedNotification.user?.name ||
                    selectedNotification.user?.email ||
                    "Usuario removido"}
                </span>
                {selectedNotification.user?.email && (
                  <span>
                    <strong>Email:</strong> {selectedNotification.user.email}
                  </span>
                )}
                {selectedNotification.user?.role && (
                  <span>
                    <strong>Papel:</strong> {selectedNotification.user.role}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg bg-light-border/10 p-3 dark:bg-dark-border/10">
                <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                  Status
                </h4>
                <Badge variant={selectedNotification.read ? "success" : "warning"}>
                  {selectedNotification.read ? "Lida" : "Nao lida"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleMarkRead(
                      selectedNotification.id,
                      !selectedNotification.read
                    );
                    setSelectedNotification(null);
                  }}
                >
                  Alternar lida
                </Button>
              </div>
              <div className="space-y-2 rounded-lg bg-light-border/10 p-3 dark:bg-dark-border/10">
                <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                  Atalhos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNotification.actionUrl && (
                    <a
                      href={selectedNotification.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-brand-accent underline"
                    >
                      Abrir link
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleDelete(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>

            {selectedNotification.metadata &&
              Object.keys(selectedNotification.metadata).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                    Metadata
                  </h4>
                  <pre className="rounded-lg bg-light-border/10 p-4 text-xs text-light-text dark:bg-dark-border/10 dark:text-dark-text overflow-auto">
                    {JSON.stringify(selectedNotification.metadata, null, 2)}
                  </pre>
                </div>
              )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-light-muted dark:text-dark-muted">
                Atualizada em {formatDateTime(selectedNotification.updatedAt)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotification(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
}
