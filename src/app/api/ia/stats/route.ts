import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Buscar estatísticas das interações
    const { data: interactions, error: interactionsError } = await supabase
      .from('ia_interactions')
      .select('*');

    if (interactionsError) {
      console.error('Erro ao buscar interações:', interactionsError);
      return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
    }

    // Calcular estatísticas
    const totalMessages = interactions?.length || 0;
    const uniqueUsers = new Set(interactions?.map(i => i.user_id).filter(Boolean)).size;
    const avgResponseTime = interactions?.length > 0 
      ? interactions.reduce((sum, i) => sum + (i.response_time_ms || 0), 0) / interactions.length / 1000
      : 0;
    
    const lastActivity = interactions?.length > 0 
      ? new Date(Math.max(...interactions.map(i => new Date(i.created_at).getTime()))).toLocaleString()
      : 'N/A';

    const totalTokens = interactions?.reduce((sum, i) => sum + (i.tokens_used || 0), 0) || 0;
    const totalCost = interactions?.reduce((sum, i) => sum + (i.cost_usd || 0), 0) || 0;
    const errorCount = interactions?.filter(i => !i.success).length || 0;

    const stats = {
      totalMessages,
      uniqueUsers,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      lastActivity,
      totalTokens,
      totalCost: Math.round(totalCost * 10000) / 10000,
      errorCount,
      successRate: totalMessages > 0 ? Math.round(((totalMessages - errorCount) / totalMessages) * 100) : 100
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro na API de estatísticas da IA:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
