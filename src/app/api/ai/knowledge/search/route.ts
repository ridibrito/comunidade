// app/api/ai/knowledge/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AHSDRAGSystem } from '@/lib/ai/rag';
import { EmbeddingService } from '@/lib/ai/embeddings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, persona = 'geral', filters = {}, maxResults = 10, threshold = 0.7 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query é obrigatória e deve ser uma string' },
        { status: 400 }
      );
    }

    // Validar persona
    const validPersonas = ['identificacao', 'educacao', 'familia', 'geral'];
    if (!validPersonas.includes(persona)) {
      return NextResponse.json(
        { error: 'Persona inválida' },
        { status: 400 }
      );
    }

    // Gerar resposta usando RAG
    const response = await AHSDRAGSystem.generateResponse({
      query,
      persona,
      filters,
      maxResults,
      threshold
    });

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro na busca de conhecimento:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const persona = searchParams.get('persona') as any || 'geral';
    const source = searchParams.get('source') || undefined;
    const category = searchParams.get('category') || undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Parâmetro "q" é obrigatório' },
        { status: 400 }
      );
    }

    const response = await AHSDRAGSystem.generateResponse({
      query,
      persona,
      filters: { source, category },
      maxResults: 10,
      threshold: 0.7
    });

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro na busca GET:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
