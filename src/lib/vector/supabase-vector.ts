// lib/vector/supabase-vector.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseVector = createClient(supabaseUrl, supabaseKey);

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: 'aldeia' | 'virgolim' | 'instituto' | 'outros';
  category: 'identificacao' | 'educacao' | 'familia' | 'desenvolvimento' | 'metodologias' | 'recursos' | 'casos' | 'pesquisas';
  similarity: number;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  source?: string;
  category?: string;
  matchThreshold?: number;
  matchCount?: number;
}

export class VectorSearchService {
  /**
   * Busca conhecimento usando embedding
   */
  static async searchKnowledge(
    queryEmbedding: number[],
    filters: SearchFilters = {}
  ): Promise<KnowledgeItem[]> {
    const {
      source,
      category,
      matchThreshold = 0.7,
      matchCount = 10
    } = filters;

    try {
      const { data, error } = await supabaseVector.rpc('search_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        filter_source: source || null,
        filter_category: category || null
      });

      if (error) {
        console.error('Erro na busca vetorial:', error);
        throw new Error('Falha na busca vetorial');
      }

      return data || [];
    } catch (error) {
      console.error('Erro no VectorSearchService:', error);
      throw error;
    }
  }

  /**
   * Adiciona item à base de conhecimento
   */
  static async addKnowledgeItem(
    title: string,
    content: string,
    source: string,
    category: string,
    documentType: string,
    embedding: number[],
    fileUrl?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const { data, error } = await supabaseVector
        .from('knowledge_base')
        .insert({
          title,
          content,
          source,
          category,
          document_type: documentType,
          file_url: fileUrl,
          embedding,
          metadata: metadata || {},
          created_by: (await supabaseVector.auth.getUser()).data.user?.id
        })
        .select('id')
        .single();

      if (error) {
        console.error('Erro ao adicionar item:', error);
        throw new Error('Falha ao adicionar item à base de conhecimento');
      }

      return data.id;
    } catch (error) {
      console.error('Erro no addKnowledgeItem:', error);
      throw error;
    }
  }

  /**
   * Atualiza item na base de conhecimento
   */
  static async updateKnowledgeItem(
    id: string,
    updates: {
      title?: string;
      content?: string;
      source?: string;
      category?: string;
      embedding?: number[];
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      const { error } = await supabaseVector
        .from('knowledge_base')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar item:', error);
        throw new Error('Falha ao atualizar item');
      }
    } catch (error) {
      console.error('Erro no updateKnowledgeItem:', error);
      throw error;
    }
  }

  /**
   * Remove item da base de conhecimento
   */
  static async deleteKnowledgeItem(id: string): Promise<void> {
    try {
      const { error } = await supabaseVector
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover item:', error);
        throw new Error('Falha ao remover item');
      }
    } catch (error) {
      console.error('Erro no deleteKnowledgeItem:', error);
      throw error;
    }
  }

  /**
   * Lista itens da base de conhecimento com paginação
   */
  static async listKnowledgeItems(
    page: number = 1,
    limit: number = 20,
    filters: { source?: string; category?: string } = {}
  ) {
    try {
      let query = supabaseVector
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Erro ao listar itens:', error);
        throw new Error('Falha ao listar itens');
      }

      return {
        items: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro no listKnowledgeItems:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas da base de conhecimento
   */
  static async getKnowledgeStats() {
    try {
      const { data, error } = await supabaseVector
        .from('knowledge_base')
        .select('source, category')
        .not('embedding', 'is', null);

      if (error) {
        console.error('Erro ao obter estatísticas:', error);
        throw new Error('Falha ao obter estatísticas');
      }

      const stats = {
        total: data?.length || 0,
        bySource: {} as Record<string, number>,
        byCategory: {} as Record<string, number>
      };

      data?.forEach(item => {
        stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erro no getKnowledgeStats:', error);
      throw error;
    }
  }
}
