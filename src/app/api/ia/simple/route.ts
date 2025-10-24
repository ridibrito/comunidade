import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ 
      response: 'Olá! Esta é uma resposta de teste da IA. Se você está vendo esta mensagem, a API está funcionando corretamente.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro no teste simples' },
      { status: 500 }
    );
  }
}
