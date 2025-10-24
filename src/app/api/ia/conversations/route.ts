import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: conversations, error } = await supabase
      .from('ai_conversations')
      .select(`
        *,
        ai_messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar conversas:', error);
      return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 });
    }

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erro na API de conversas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, firstMessage } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }

    const { data: conversation, error } = await supabase
      .from('ai_conversations')
      .insert({
        title,
        user_id: null // Por enquanto sem autenticação
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar conversa:', error);
      return NextResponse.json({ error: 'Erro ao criar conversa' }, { status: 500 });
    }

    // Se houver primeira mensagem, salvar
    if (firstMessage) {
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversation.id,
          role: 'user',
          content: firstMessage
        });
    }

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Erro na API de conversas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
