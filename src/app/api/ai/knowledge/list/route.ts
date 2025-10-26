// app/api/ai/knowledge/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { VectorSearchService } from '@/lib/vector/supabase-vector';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') || undefined;
    const category = searchParams.get('category') || undefined;

    const result = await VectorSearchService.listKnowledgeItems(page, limit, {
      source,
      category
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao listar itens:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
