import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { conversationId, role, content } = await request.json();

    if (!conversationId || !role || !content) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios: conversationId, role, content' }, { status: 400 });
    }

    const { data: message, error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar mensagem:', error);
      return NextResponse.json({ error: 'Erro ao salvar mensagem' }, { status: 500 });
    }

    // Atualizar timestamp da conversa
    await supabase
      .from('ai_conversations')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erro na API de mensagens:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
