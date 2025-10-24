import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do prompt é obrigatório' }, { status: 400 });
    }

    // Primeiro, desativar todos os prompts
    await supabase
      .from('ia_prompts')
      .update({ is_active: false });

    // Depois, ativar o prompt selecionado
    const { data: prompt, error } = await supabase
      .from('ia_prompts')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao ativar prompt:', error);
      return NextResponse.json({ error: 'Erro ao ativar prompt' }, { status: 500 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Erro na API de prompts:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
