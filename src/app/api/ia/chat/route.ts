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
    
    const { message, conversation } = await request.json();
    console.log('Mensagem recebida:', message);

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

    // Construir o contexto da conversa
    const messages = [
      {
        role: 'system',
        content: `Você é um assistente especializado em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. 
        
        Sua missão é ajudar famílias com crianças AHSD fornecendo:
        - Orientação educacional especializada
        - Estratégias de desenvolvimento
        - Suporte emocional para pais e cuidadores
        - Informações sobre recursos e oportunidades
        - Dicas para estimular o potencial das crianças
        
        Sempre responda em português brasileiro, seja empático, acolhedor e forneça informações precisas e úteis.
        Se não souber algo específico, seja honesto e sugira onde buscar mais informações.`
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
    console.log('Resposta da OpenAI:', response);

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Erro na API de IA:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
