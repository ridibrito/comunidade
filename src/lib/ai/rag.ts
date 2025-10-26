// lib/ai/rag.ts
import OpenAI from 'openai';
import { EmbeddingService } from './embeddings';
import { VectorSearchService, KnowledgeItem } from '../vector/supabase-vector';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type AIPersona = 'identificacao' | 'educacao' | 'familia' | 'geral';

export interface RAGContext {
  query: string;
  persona: AIPersona;
  filters?: {
    source?: string;
    category?: string;
  };
  maxResults?: number;
  threshold?: number;
}

export interface RAGResponse {
  answer: string;
  sources: KnowledgeItem[];
  confidence: number;
  tokensUsed: number;
}

export class AHSDRAGSystem {
  private static readonly PERSONA_PROMPTS = {
    identificacao: `Você é um especialista em identificação de Altas Habilidades/Superdotação (AHSD) com mais de 20 anos de experiência. 
    Sua especialidade é reconhecer características precoces, sinais de superdotação e orientar famílias e educadores sobre o processo de identificação.
    
    Baseie suas respostas nos materiais da Angela Virgolim, Instituto Virgolim e Aldeia Singular.
    Seja preciso, empático e forneça orientações práticas e acionáveis.`,

    educacao: `Você é um consultor pedagógico especializado em educação para crianças e jovens com Altas Habilidades/Superdotação.
    Conhece profundamente estratégias de ensino, adaptações curriculares e metodologias específicas para AHSD.
    
    Use as metodologias validadas pela Aldeia Singular e baseie-se nas pesquisas do Instituto Virgolim.
    Forneça sugestões práticas e personalizadas para cada situação.`,

    familia: `Você é um orientador familiar especializado em Altas Habilidades/Superdotação.
    Ajuda famílias a entender as necessidades de seus filhos, oferece suporte emocional e orientações práticas.
    
    Baseie-se nos guias da Aldeia Singular e nas orientações da Angela Virgolim.
    Seja acolhedor, compreensivo e ofereça suporte real para as famílias.`,

    geral: `Você é um assistente especializado em Altas Habilidades/Superdotação.
    Possui conhecimento abrangente sobre identificação, educação, desenvolvimento e suporte familiar para AHSD.
    
    Use todo o conhecimento disponível da Aldeia Singular, Angela Virgolim e Instituto Virgolim.
    Forneça respostas completas e bem fundamentadas.`
  };

  /**
   * Busca conhecimento relevante para uma consulta
   */
  static async searchKnowledge(context: RAGContext): Promise<KnowledgeItem[]> {
    try {
      // Gerar embedding da consulta
      const queryEmbedding = await EmbeddingService.generateEmbedding(context.query);

      // Buscar conhecimento relevante
      const knowledge = await VectorSearchService.searchKnowledge(
        queryEmbedding.embedding,
        {
          source: context.filters?.source,
          category: context.filters?.category,
          matchThreshold: context.threshold || 0.7,
          matchCount: context.maxResults || 10
        }
      );

      return knowledge;
    } catch (error) {
      console.error('Erro na busca de conhecimento:', error);
      throw new Error('Falha na busca de conhecimento');
    }
  }

  /**
   * Gera resposta usando RAG
   */
  static async generateResponse(context: RAGContext): Promise<RAGResponse> {
    try {
      // Buscar conhecimento relevante
      const sources = await this.searchKnowledge(context);

      // Construir contexto para o LLM
      const knowledgeContext = this.buildKnowledgeContext(sources);

      // Gerar prompt especializado
      const prompt = this.buildSpecializedPrompt(context, knowledgeContext);

      // Gerar resposta
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.PERSONA_PROMPTS[context.persona]
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const answer = response.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
      const tokensUsed = response.usage?.total_tokens || 0;

      // Calcular confiança baseada na qualidade das fontes
      const confidence = this.calculateConfidence(sources);

      return {
        answer,
        sources,
        confidence,
        tokensUsed
      };
    } catch (error) {
      console.error('Erro na geração de resposta:', error);
      throw new Error('Falha na geração de resposta');
    }
  }

  /**
   * Constrói contexto de conhecimento para o LLM
   */
  private static buildKnowledgeContext(sources: KnowledgeItem[]): string {
    if (sources.length === 0) {
      return 'Nenhuma informação específica encontrada na base de conhecimento.';
    }

    let context = 'Informações relevantes da base de conhecimento:\n\n';

    sources.forEach((source, index) => {
      context += `${index + 1}. **${source.title}** (${source.source}/${source.category})\n`;
      context += `   ${source.content}\n\n`;
    });

    return context;
  }

  /**
   * Constrói prompt especializado
   */
  private static buildSpecializedPrompt(context: RAGContext, knowledgeContext: string): string {
    return `Consulta: ${context.query}

${knowledgeContext}

Instruções:
- Responda de forma clara e precisa
- Baseie-se nas informações fornecidas acima
- Se não houver informações suficientes, indique isso
- Forneça orientações práticas quando possível
- Cite as fontes quando relevante
- Mantenha um tom profissional mas acolhedor`;
  }

  /**
   * Calcula confiança da resposta baseada nas fontes
   */
  private static calculateConfidence(sources: KnowledgeItem[]): number {
    if (sources.length === 0) return 0.3;

    const avgSimilarity = sources.reduce((sum, source) => sum + source.similarity, 0) / sources.length;
    const sourceCount = Math.min(sources.length / 5, 1); // Normalizar para 0-1

    return Math.min(avgSimilarity * 0.7 + sourceCount * 0.3, 1.0);
  }

  /**
   * Analisa caso específico (upload de relatório, etc.)
   */
  static async analyzeCase(
    caseContent: string,
    persona: AIPersona = 'geral'
  ): Promise<RAGResponse> {
    const context: RAGContext = {
      query: `Analise este caso e forneça orientações específicas: ${caseContent}`,
      persona,
      maxResults: 15,
      threshold: 0.6
    };

    return await this.generateResponse(context);
  }

  /**
   * Sugere recursos baseados em perfil
   */
  static async suggestResources(
    profile: {
      age?: number;
      characteristics?: string[];
      needs?: string[];
    },
    persona: AIPersona = 'geral'
  ): Promise<RAGResponse> {
    const query = `Sugira recursos e estratégias para: 
    Idade: ${profile.age || 'não especificada'}
    Características: ${profile.characteristics?.join(', ') || 'não especificadas'}
    Necessidades: ${profile.needs?.join(', ') || 'não especificadas'}`;

    const context: RAGContext = {
      query,
      persona,
      maxResults: 12,
      threshold: 0.6
    };

    return await this.generateResponse(context);
  }
}
