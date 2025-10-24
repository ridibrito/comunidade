import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      hasApiKey,
      message: hasApiKey 
        ? 'API key configurada corretamente' 
        : 'API key não encontrada no .env.local',
      envVars: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Configurada' : 'Não configurada'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao verificar configuração',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
