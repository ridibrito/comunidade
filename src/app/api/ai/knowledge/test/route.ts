// app/api/ai/knowledge/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmbeddingService } from '@/lib/ai/embeddings';
import { VectorSearchService } from '@/lib/vector/supabase-vector';
import { AHSDRAGSystem } from '@/lib/ai/rag';

export async function GET() {
  try {
    // Teste 1: Gerar embedding
    console.log('🧪 Testando geração de embedding...');
    const testText = "Altas Habilidades e Superdotação são características que requerem identificação precoce e atendimento especializado.";
    const embeddingResult = await EmbeddingService.generateEmbedding(testText);
    console.log('✅ Embedding gerado:', embeddingResult.embedding.length, 'dimensões');

    // Teste 2: Adicionar item de teste à base
    console.log('🧪 Adicionando item de teste à base de conhecimento...');
    const testItemId = await VectorSearchService.addKnowledgeItem(
      "Teste de Identificação AHSD",
      "Este é um texto de teste sobre identificação de Altas Habilidades e Superdotação. A identificação precoce é fundamental para o desenvolvimento adequado das crianças com essas características.",
      "aldeia",
      "identificacao",
      "txt",
      embeddingResult.embedding,
      undefined,
      { test: true, created_at: new Date().toISOString() }
    );
    console.log('✅ Item adicionado com ID:', testItemId);

    // Teste 3: Buscar conhecimento
    console.log('🧪 Testando busca vetorial...');
    const searchQuery = "Como identificar crianças com altas habilidades?";
    const searchEmbedding = await EmbeddingService.generateEmbedding(searchQuery);
    const searchResults = await VectorSearchService.searchKnowledge(searchEmbedding.embedding, {
      matchThreshold: 0.5,
      matchCount: 5
    });
    console.log('✅ Resultados da busca:', searchResults.length, 'itens encontrados');

    // Teste 4: Sistema RAG
    console.log('🧪 Testando sistema RAG...');
    const ragResponse = await AHSDRAGSystem.generateResponse({
      query: "Como identificar crianças com altas habilidades?",
      persona: 'identificacao',
      maxResults: 3,
      threshold: 0.5
    });
    console.log('✅ Resposta RAG gerada:', ragResponse.answer.substring(0, 100) + '...');

    // Teste 5: Estatísticas
    console.log('🧪 Obtendo estatísticas...');
    const stats = await VectorSearchService.getKnowledgeStats();
    console.log('✅ Estatísticas:', stats);

    return NextResponse.json({
      success: true,
      message: 'Todos os testes passaram com sucesso!',
      results: {
        embeddingDimensions: embeddingResult.embedding.length,
        testItemId,
        searchResults: searchResults.length,
        ragAnswer: ragResponse.answer.substring(0, 200) + '...',
        confidence: ragResponse.confidence,
        sources: ragResponse.sources.length,
        stats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro no teste do sistema vetorial',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
