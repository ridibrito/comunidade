import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Verificar se a API key está configurada
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY não está configurada no .env.local');
}

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    console.log('API de IA chamada');
    
    const { message, conversation, conversationId, userName } = await request.json();
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

    if (!process.env.GEMINI_API_KEY) {
      console.log('Erro: GEMINI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    if (!genAI) {
      return NextResponse.json(
        { error: 'API Gemini não inicializada' },
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
        // Adicionar instrução sobre o nome do usuário se disponível
        if (userName) {
          systemPrompt += `\n\nVocê está conversando com ${userName}. Use o nome dele(a) de forma natural e acolhedora nas suas respostas quando for apropriado.`;
        }
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
- Sempre responda em português brasileiro${userName ? `\n- Você está conversando com ${userName}, use o nome dele(a) quando for apropriado de forma natural e acolhedora` : ''}

Você está aqui para ajudar famílias com crianças AHSD a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades.`;
    }

    // Preparar histórico de conversa para Gemini
    // O Gemini usa um formato diferente - precisa converter o histórico
    const history = conversation.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Criar o modelo
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: systemPrompt
    });

    // Construir o chat com histórico
    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
    });

    console.log('Prompt do sistema:', systemPrompt.substring(0, 100) + '...');
    console.log('Total de mensagens no histórico:', history.length);

    const startTime = Date.now();
    const result = await chat.sendMessage(message);
    const responseTime = Date.now() - startTime;

    const response = result.response.text();
    console.log('Resposta do Gemini:', response);

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

      // Obter informações de uso do Gemini
      let tokensUsed = 0;
      try {
        const usageMetadata = (result.response as any).usageMetadata;
        tokensUsed = usageMetadata?.totalTokenCount || 0;
      } catch (error) {
        console.log('Não foi possível obter informações de uso:', error);
      }

      const { data: interaction, error: interactionError } = await supabase
        .from('ia_interactions')
        .insert({
          user_message: message,
          ai_response: response,
          tokens_used: tokensUsed,
          response_time_ms: responseTime,
          cost_usd: 0, // Gemini tem preços diferentes, pode calcular depois
          success: true,
          metadata: {
            model: 'gemini-pro',
            temperature: 0.7,
            tokens: tokensUsed
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
