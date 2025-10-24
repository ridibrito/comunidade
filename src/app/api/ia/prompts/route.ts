import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: prompts, error } = await supabase
      .from('ia_prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar prompts:', error);
      return NextResponse.json({ error: 'Erro ao buscar prompts' }, { status: 500 });
    }

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Erro na API de prompts:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, content } = await request.json();

    if (!name || !content) {
      return NextResponse.json({ error: 'Nome e conteúdo são obrigatórios' }, { status: 400 });
    }

    const { data: prompt, error } = await supabase
      .from('ia_prompts')
      .insert({
        name,
        content,
        is_active: false
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar prompt:', error);
      return NextResponse.json({ error: 'Erro ao criar prompt' }, { status: 500 });
    }

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('Erro na API de prompts:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
