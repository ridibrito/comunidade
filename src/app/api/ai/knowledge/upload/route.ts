// app/api/ai/knowledge/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmbeddingService } from '@/lib/ai/embeddings';
import { VectorSearchService } from '@/lib/vector/supabase-vector';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const source = formData.get('source') as string;
    const category = formData.get('category') as string;
    const documentType = formData.get('documentType') as string;

    // Validações
    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 });
    }

    if (!title || !source || !category || !documentType) {
      return NextResponse.json(
        { error: 'Título, fonte, categoria e tipo de documento são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipos
    const validSources = ['aldeia', 'virgolim', 'instituto', 'outros'];
    const validCategories = ['identificacao', 'educacao', 'familia', 'desenvolvimento', 'metodologias', 'recursos', 'casos', 'pesquisas'];
    const validTypes = ['pdf', 'docx', 'txt', 'video', 'audio', 'web'];

    if (!validSources.includes(source)) {
      return NextResponse.json({ error: 'Fonte inválida' }, { status: 400 });
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
    }

    if (!validTypes.includes(documentType)) {
      return NextResponse.json({ error: 'Tipo de documento inválido' }, { status: 400 });
    }

    // Extrair texto do arquivo (implementação básica)
    let content = '';
    const fileText = await file.text();
    
    // Aqui você implementaria a extração específica por tipo de arquivo
    // Por enquanto, vamos usar o texto bruto
    content = fileText;

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Conteúdo do arquivo muito curto ou inválido' },
        { status: 400 }
      );
    }

    // Chunking básico (dividir em pedaços menores)
    const chunks = chunkText(content, 1000); // 1000 caracteres por chunk
    const chunkIds: string[] = [];

    // Processar cada chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkTitle = `${title} - Parte ${i + 1}`;
      
      // Gerar embedding
      const embeddingResult = await EmbeddingService.generateEmbedding(chunk);
      
      // Salvar no banco
      const chunkId = await VectorSearchService.addKnowledgeItem(
        chunkTitle,
        chunk,
        source,
        category,
        documentType,
        embeddingResult.embedding,
        undefined, // fileUrl - implementar upload para storage
        {
          originalFile: file.name,
          chunkIndex: i,
          totalChunks: chunks.length,
          fileSize: file.size,
          mimeType: file.type
        }
      );

      chunkIds.push(chunkId);
    }

    return NextResponse.json({
      success: true,
      message: `Documento processado com sucesso. ${chunks.length} chunks criados.`,
      data: {
        originalFile: file.name,
        chunksCreated: chunks.length,
        chunkIds,
        totalTokens: chunks.reduce((sum, chunk) => sum + chunk.length, 0)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro no upload de documento:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Função auxiliar para chunking de texto
function chunkText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
        currentChunk = trimmedSentence;
      } else {
        // Se uma única sentença for muito longa, dividir por palavras
        const words = trimmedSentence.split(' ');
        let wordChunk = '';
        
        for (const word of words) {
          if (wordChunk.length + word.length + 1 <= maxLength) {
            wordChunk += (wordChunk ? ' ' : '') + word;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = word;
          }
        }
        
        if (wordChunk) currentChunk = wordChunk;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + '.');
  }

  return chunks.filter(chunk => chunk.trim().length > 0);
}
