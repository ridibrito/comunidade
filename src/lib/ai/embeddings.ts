// lib/ai/embeddings.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmbeddingResult {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class EmbeddingService {
  /**
   * Gera embedding para um texto usando OpenAI
   */
  static async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return {
        embedding: response.data[0].embedding,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Erro ao gerar embedding:', error);
      throw new Error('Falha ao gerar embedding');
    }
  }

  /**
   * Gera embeddings em lote para múltiplos textos
   */
  static async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
        encoding_format: 'float',
      });

      return response.data.map((item, index) => ({
        embedding: item.embedding,
        usage: response.usage,
      }));
    } catch (error) {
      console.error('Erro ao gerar embeddings em lote:', error);
      throw new Error('Falha ao gerar embeddings em lote');
    }
  }

  /**
   * Calcula similaridade coseno entre dois embeddings
   */
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings devem ter o mesmo tamanho');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}
