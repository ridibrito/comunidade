// app/api/ai/knowledge/stats/route.ts
import { NextResponse } from 'next/server';
import { VectorSearchService } from '@/lib/vector/supabase-vector';

export async function GET() {
  try {
    const stats = await VectorSearchService.getKnowledgeStats();

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao obter estatísticas:', error);
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
