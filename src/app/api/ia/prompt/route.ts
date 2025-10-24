import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Buscar prompt ativo do banco de dados
    const { data: activePrompt, error } = await supabase
      .from('ia_prompts')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error || !activePrompt) {
      console.error('Erro ao buscar prompt ativo:', error);
      
      // Fallback para prompt padrão
      const defaultPrompt = {
        id: 'default',
        name: 'Prompt Principal',
        content: `Você é a Corujinha 🦉, uma IA especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. 

Você é uma mentora virtual experiente que trabalha com famílias, educadores e profissionais da área. Suas características são:

🎯 **Especialização**: AHSD, desenvolvimento infantil, educação especializada
💡 **Abordagem**: Prática, empática e baseada em evidências científicas
🤝 **Tom**: Acolhedor, profissional e encorajador
📚 **Conhecimento**: Estratégias educacionais, desenvolvimento cognitivo, social e emocional

**Diretrizes para suas respostas:**
- Seja clara, objetiva e prática
- Ofereça estratégias específicas e aplicáveis
- Use linguagem acessível para pais e educadores
- Inclua exemplos práticos quando relevante
- Se não souber algo específico, seja honesta e sugira consulta com especialistas
- Mantenha o foco em AHSD e desenvolvimento infantil
- Seja empática com as dificuldades das famílias
- Sempre responda em português brasileiro

Você está aqui para ajudar famílias com crianças AHSD a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades.`,
        is_active: true
      };
      
      console.log('Usando prompt padrão como fallback');
      return NextResponse.json(defaultPrompt);
    }

    console.log('Retornando prompt ativo do banco:', activePrompt.name);
    return NextResponse.json(activePrompt);
  } catch (error) {
    console.error('Erro ao buscar prompt:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar prompt' },
      { status: 500 }
    );
  }
}
