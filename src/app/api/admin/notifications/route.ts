import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

const VALID_TYPES = ["info", "success", "warning", "error", "progress"] as const;
type NotificationType = (typeof VALID_TYPES)[number];

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

function normalizeTypes(raw: string | null): NotificationType[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value): value is NotificationType => VALID_TYPES.includes(value as NotificationType));
}

function safeBoolean(value: string | null): boolean | null {
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function safeNumber(value: string | null, fallback: number, min: number, max: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function sanitizeMetadata(input: unknown) {
  if (input === null || input === undefined) return null;
  if (typeof input === "object") return input;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

function sanitizeType(value: unknown): NotificationType {
  if (typeof value === "string" && VALID_TYPES.includes(value as NotificationType)) {
    return value as NotificationType;
  }
  return "info";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);

    const page = safeNumber(searchParams.get("page"), 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = safeNumber(
      searchParams.get("limit"),
      DEFAULT_PAGE_SIZE,
      1,
      MAX_PAGE_SIZE
    );
    const offset = (page - 1) * limit;
    const types = normalizeTypes(searchParams.get("types") || searchParams.get("type"));
    const readFilter = safeBoolean(searchParams.get("read"));
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");
    const sinceParam = searchParams.get("since");

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (types.length > 0) {
      query = query.in("type", types);
    }

    if (readFilter !== null) {
      query = query.eq("read", readFilter);
    }

    if (search && search.trim().length > 0) {
      const pattern = `%${search.trim()}%`;
      query = query.or(`title.ilike.${pattern},message.ilike.${pattern}`);
    }

    if (sinceParam) {
      const sinceDate = new Date(sinceParam);
      if (!Number.isNaN(sinceDate.getTime())) {
        query = query.gte("created_at", sinceDate.toISOString());
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Erro ao consultar notificacoes:", error);
      return NextResponse.json(
        { error: "Falha ao listar notificacoes" },
        { status: 500 }
      );
    }

    const notifications = data ?? [];
    const userIds = Array.from(
      new Set(
        notifications
          .map((item) => item.user_id)
          .filter((value): value is string => typeof value === "string")
      )
    );

    let profilesMap = new Map<string, any>();

    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, role, invite_email")
        .in("id", userIds);

      if (profilesError) {
        console.error("Erro ao carregar perfis para notificacoes:", profilesError);
      } else if (profiles) {
        profilesMap = new Map(profiles.map((profile) => [profile.id, profile]));
      }
    }

    const enriched = notifications.map((notification) => {
      const profile = profilesMap.get(notification.user_id);

      return {
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        actionUrl: notification.action_url,
        actionText: notification.action_text,
        progress: notification.progress,
        metadata: notification.metadata ?? {},
        createdAt: notification.created_at,
        updatedAt: notification.updated_at,
        user: profile
          ? {
              id: profile.id,
              name: profile.full_name,
              role: profile.role,
              email: profile.invite_email,
            }
          : null,
      };
    });

    const totalItems = typeof count === "number" ? count : notifications.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    const [totalCountRes, unreadCountRes, last7DaysRes, typeCountsRes] = await Promise.all([
      supabase.from("notifications").select("id", { head: true, count: "exact" }),
      supabase
        .from("notifications")
        .select("id", { head: true, count: "exact" })
        .eq("read", false),
      supabase
        .from("notifications")
        .select("id", { head: true, count: "exact" })
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ),
      supabase.from("notifications").select("type, count:id", { group: "type" }),
    ]);

    const stats = {
      total: totalCountRes.count ?? 0,
      unread: unreadCountRes.count ?? 0,
      last7Days: last7DaysRes.count ?? 0,
      byType: VALID_TYPES.reduce<Record<NotificationType, number>>((acc, type) => {
        acc[type] = 0;
        return acc;
      }, {} as Record<NotificationType, number>),
    };

    if (typeCountsRes.data) {
      for (const row of typeCountsRes.data as Array<{ type: NotificationType; count: number }>) {
        if (VALID_TYPES.includes(row.type)) {
          stats.byType[row.type] = row.count ?? 0;
        }
      }
    }

    return NextResponse.json({
      notifications: enriched,
      pagination: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      stats,
    });
  } catch (error) {
    console.error("Erro inesperado na API admin/notifications:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar notificacoes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();

    const {
      userId,
      userIds,
      title,
      message,
      type,
      actionUrl,
      actionText,
      progress,
      metadata,
    } = body ?? {};

    const targets: string[] = Array.isArray(userIds)
      ? userIds.filter((value): value is string => typeof value === "string")
      : [];

    if (typeof userId === "string") {
      targets.push(userId);
    }

    const uniqueTargets = Array.from(new Set(targets));

    if (uniqueTargets.length === 0) {
      return NextResponse.json(
        { error: "Informe pelo menos um usuario para receber a notificacao" },
        { status: 400 }
      );
    }

    if (!title || !message) {
      return NextResponse.json(
        { error: "Titulo e mensagem sao obrigatorios" },
        { status: 400 }
      );
    }

    const safeProgress =
      typeof progress === "number" && !Number.isNaN(progress)
        ? Math.max(0, Math.min(100, Math.round(progress)))
        : null;

    const safeMetadata = sanitizeMetadata(metadata) ?? {};

    const payload = uniqueTargets.map((target) => ({
      user_id: target,
      title: String(title),
      message: String(message),
      type: sanitizeType(type),
      action_url: actionUrl ? String(actionUrl) : null,
      action_text: actionText ? String(actionText) : null,
      progress: safeProgress,
      metadata: safeMetadata,
    }));

    const { data, error } = await supabase
      .from("notifications")
      .insert(payload)
      .select();

    if (error) {
      console.error("Erro ao criar notificacoes:", error);
      return NextResponse.json(
        { error: "Falha ao criar notificacoes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      created: (data ?? []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        message: row.message,
        type: row.type,
        read: row.read,
        actionUrl: row.action_url,
        actionText: row.action_text,
        progress: row.progress,
        metadata: row.metadata ?? {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error("Erro inesperado ao criar notificacao:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar notificacao" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();

    const { id, ids, action, read, updates, userId } = body ?? {};

    if (action === "markAllReadForUser") {
      if (!userId || typeof userId !== "string") {
        return NextResponse.json(
          { error: "Informe o usuario para marcar todas como lidas" },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.rpc("mark_all_notifications_as_read", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Erro ao marcar notificacoes como lidas:", error);
        return NextResponse.json(
          { error: "Falha ao marcar notificacoes como lidas" },
          { status: 500 }
        );
      }

      return NextResponse.json({ updated: data ?? 0 });
    }

    const targetIds: string[] = Array.isArray(ids)
      ? ids.filter((value): value is string => typeof value === "string")
      : [];

    if (typeof id === "string") {
      targetIds.push(id);
    }

    const uniqueTargets = Array.from(new Set(targetIds));

    if (uniqueTargets.length === 0) {
      return NextResponse.json(
        { error: "Informe ao menos uma notificacao" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {};

    if (typeof read === "boolean") {
      payload.read = read;
    }

    if (updates && typeof updates === "object") {
      const safeUpdates = updates as Record<string, unknown>;
      if (typeof safeUpdates.title === "string") payload.title = safeUpdates.title;
      if (typeof safeUpdates.message === "string") payload.message = safeUpdates.message;
      if (typeof safeUpdates.actionUrl === "string" || safeUpdates.actionUrl === null) {
        payload.action_url = safeUpdates.actionUrl ?? null;
      }
      if (typeof safeUpdates.actionText === "string" || safeUpdates.actionText === null) {
        payload.action_text = safeUpdates.actionText ?? null;
      }
      if (typeof safeUpdates.type === "string") {
        payload.type = sanitizeType(safeUpdates.type);
      }
      if (typeof safeUpdates.progress === "number" || safeUpdates.progress === null) {
        const prog = safeUpdates.progress;
        payload.progress =
          typeof prog === "number" && !Number.isNaN(prog)
            ? Math.max(0, Math.min(100, Math.round(prog)))
            : null;
      }
      if (safeUpdates.metadata !== undefined) {
        payload.metadata = sanitizeMetadata(safeUpdates.metadata) ?? {};
      }
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: "Nenhuma alteracao foi informada" },
        { status: 400 }
      );
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("notifications")
      .update(payload)
      .in("id", uniqueTargets)
      .select();

    if (error) {
      console.error("Erro ao atualizar notificacoes:", error);
      return NextResponse.json(
        { error: "Falha ao atualizar notificacoes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      updated: (data ?? []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        message: row.message,
        type: row.type,
        read: row.read,
        actionUrl: row.action_url,
        actionText: row.action_text,
        progress: row.progress,
        metadata: row.metadata ?? {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error("Erro inesperado ao atualizar notificacoes:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar notificacoes" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const idsParam = searchParams.get("ids");

    const targetIds: string[] = [];

    if (id) targetIds.push(id);

    if (idsParam) {
      targetIds.push(
        ...idsParam
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value.length > 0)
      );
    }

    const uniqueTargets = Array.from(new Set(targetIds));

    if (uniqueTargets.length === 0) {
      return NextResponse.json(
        { error: "Informe ao menos uma notificacao para remover" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .in("id", uniqueTargets);

    if (error) {
      console.error("Erro ao deletar notificacoes:", error);
      return NextResponse.json(
        { error: "Falha ao deletar notificacoes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ removed: uniqueTargets.length });
  } catch (error) {
    console.error("Erro inesperado ao deletar notificacoes:", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar notificacoes" },
      { status: 500 }
    );
  }
}
