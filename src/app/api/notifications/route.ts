import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabaseServer";
import { getServerUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const supabase = await getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar notificações:", error);
      return NextResponse.json(
        { error: "Erro ao buscar notificações" },
        { status: 500 }
      );
    }

    // Converter timestamps para Date objects
    const notifications = data?.map((notification) => ({
      ...notification,
      createdAt: new Date(notification.created_at),
      updatedAt: new Date(notification.updated_at),
    })) || [];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Erro na API de notificações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, actionUrl, actionText, progress, metadata } =
      body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Título e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await getServerSupabaseClient();

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title,
        message,
        type: type || "info",
        action_url: actionUrl,
        action_text: actionText,
        progress,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar notificação:", error);
      return NextResponse.json(
        { error: "Erro ao criar notificação" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      notification: {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      },
    });
  } catch (error) {
    console.error("Erro na API de notificações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, read, markAllAsRead } = body;

    const supabase = await getServerSupabaseClient();

    if (markAllAsRead) {
      // Marcar todas como lidas
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) {
        console.error("Erro ao marcar todas como lidas:", error);
        return NextResponse.json(
          { error: "Erro ao marcar todas como lidas" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID da notificação é obrigatório" },
        { status: 400 }
      );
    }

    // Marcar uma notificação específica como lida
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: read !== undefined ? read : true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar notificação:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar notificação" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      notification: {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      },
    });
  } catch (error) {
    console.error("Erro na API de notificações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da notificação é obrigatório" },
        { status: 400 }
      );
    }

    const supabase = await getServerSupabaseClient();

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Erro ao deletar notificação:", error);
      return NextResponse.json(
        { error: "Erro ao deletar notificação" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na API de notificações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

