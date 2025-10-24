import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Verificar se a API key está configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY não está configurada no .env.local');
}

export async function POST(request: NextRequest) {
  try {
    console.log('API de IA chamada');
    
    const { message, conversation, conversationId } = await request.json();
    console.log('Mensagem recebida:', message);
    console.log('Conversa anterior:', conversation?.length || 0, 'mensagens');
    console.log('ID da conversa:', conversationId);

    if (!message) {
      console.log('Erro: Mensagem vazia');
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log('Erro: OPENAI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    // Buscar prompt ativo
    let systemPrompt;
    try {
      const promptResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ia/prompt`);
      if (promptResponse.ok) {
        const promptData = await promptResponse.json();
        systemPrompt = promptData.content;
        console.log('Prompt ativo carregado:', promptData.name);
      } else {
        throw new Error('Erro ao carregar prompt');
      }
    } catch (error) {
      console.error('Erro ao carregar prompt ativo, usando padrão:', error);
      // Prompt padrão como fallback
      systemPrompt = `Você é a Corujinha 🦉, uma IA especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. 

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

Você está aqui para ajudar famílias com crianças AHSD a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades.`;
    }

    // Construir o contexto da conversa
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversation.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Prompt do sistema:', systemPrompt.substring(0, 100) + '...');
    console.log('Total de mensagens:', messages.length);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 1000,
      temperature: 0.7,
    });

        const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
        console.log('Resposta da OpenAI:', response);

        // Salvar mensagens na conversa se conversationId for fornecido
        if (conversationId) {
          try {
            // Salvar mensagem do usuário
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ia/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                role: 'user',
                content: message
              })
            });

            // Salvar resposta da IA
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ia/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                role: 'assistant',
                content: response
              })
            });

            console.log('Mensagens salvas na conversa:', conversationId);
          } catch (error) {
            console.error('Erro ao salvar mensagens:', error);
          }
        }

        // Registrar interação no banco de dados
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          const { data: interaction, error: interactionError } = await supabase
            .from('ia_interactions')
            .insert({
              user_message: message,
              ai_response: response,
              tokens_used: completion.usage?.total_tokens || 0,
              response_time_ms: Date.now() - Date.now(), // Será calculado corretamente
              cost_usd: 0, // Será calculado baseado nos tokens
              success: true,
              metadata: {
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 1000
              }
            })
            .select()
            .single();

          if (interactionError) {
            console.error('Erro ao registrar interação:', interactionError);
          } else {
            console.log('Interação registrada:', interaction.id);
          }
        } catch (error) {
          console.error('Erro ao registrar interação:', error);
        }

        return NextResponse.json({ response });

  } catch (error) {
    console.error('Erro na API de IA:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
