import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, content } = await request.json();
    const { id } = params;

    if (!name || !content) {
      return NextResponse.json({ error: 'Nome e conteúdo são obrigatórios' }, { status: 400 });
    }

    const { data: prompt, error } = await supabase
      .from('ia_prompts')
      .update({
        name,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar prompt:', error);
      return NextResponse.json({ error: 'Erro ao atualizar prompt' }, { status: 500 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Erro na API de prompts:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('ia_prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir prompt:', error);
      return NextResponse.json({ error: 'Erro ao excluir prompt' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API de prompts:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
