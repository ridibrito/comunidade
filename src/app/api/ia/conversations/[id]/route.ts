import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data: conversation, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar conversa:', error);
      return NextResponse.json({ error: 'Erro ao buscar conversa' }, { status: 500 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Erro na API de conversa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }

    const { data: conversation, error } = await supabase
      .from('ai_conversations')
      .update({
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar conversa:', error);
      return NextResponse.json({ error: 'Erro ao atualizar conversa' }, { status: 500 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Erro na API de conversa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Primeiro deletar mensagens
    await supabase
      .from('ai_messages')
      .delete()
      .eq('conversation_id', id);

    // Depois deletar conversa
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir conversa:', error);
      return NextResponse.json({ error: 'Erro ao excluir conversa' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API de conversa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
