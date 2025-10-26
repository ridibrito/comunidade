// app/(app)/admin/knowledge-base/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { KnowledgeUpload } from '@/components/ai/KnowledgeUpload';
import { Database, Upload, Search, BarChart3, FileText, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  document_type: string;
  created_at: string;
  metadata?: any;
}

interface KnowledgeStats {
  total: number;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
}

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { push } = useToast();

  const loadItems = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (filterSource) params.append('source', filterSource);
      if (filterCategory) params.append('category', filterCategory);

      const response = await fetch(`/api/ai/knowledge/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items);
        setTotalPages(data.data.totalPages);
        setCurrentPage(page);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      push({
        title: "Erro ao carregar itens",
        message: error.message,
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/ai/knowledge/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  useEffect(() => {
    loadItems();
    loadStats();
  }, [filterSource, filterCategory]);

  const handleUploadComplete = (results: any[]) => {
    push({
      title: "Upload concluído",
      message: `${results.length} documento(s) adicionado(s) à base de conhecimento!`,
      variant: "success"
    });
    loadItems();
    loadStats();
  };

  const searchKnowledge = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch('/api/ai/knowledge/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          persona: 'geral',
          maxResults: 10
        })
      });

      const data = await response.json();

      if (data.success) {
        push({
          title: "Busca realizada",
          message: `${data.data.sources.length} resultado(s) encontrado(s)`,
          variant: "success"
        });
        // Aqui você pode mostrar os resultados em um modal ou nova página (futuro)
        if (process.env.NODE_ENV !== 'production') console.log('Resultados da busca:', data.data);
      }
    } catch (error: any) {
      push({
        title: "Erro na busca",
        message: error.message,
        variant: "error"
      });
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'aldeia': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'virgolim': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'instituto': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identificacao': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'educacao': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'familia': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'desenvolvimento': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Base de Conhecimento IA"
          subtitle="Gerencie documentos e conhecimento para a IA especializada em AHSD"
        />

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Total de Documentos</p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {stats.total}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Fontes</p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {Object.keys(stats.bySource).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Categorias</p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {Object.keys(stats.byCategory).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Search className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Busca Ativa</p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    ✓
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            Buscar na Base de Conhecimento
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua pergunta sobre AHSD..."
              className="flex-1 px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
              onKeyPress={(e) => e.key === 'Enter' && searchKnowledge()}
            />
            <Button
              onClick={searchKnowledge}
              className="bg-brand-accent text-white hover:bg-brand-accent/90"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </Card>

        {/* Upload Section */}
        <Card className="p-6 mb-8">
          <KnowledgeUpload onUploadComplete={handleUploadComplete} />
        </Card>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            Filtros
          </h3>
          <div className="flex gap-4">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
            >
              <option value="">Todas as fontes</option>
              <option value="aldeia">Aldeia Singular</option>
              <option value="virgolim">Angela Virgolim</option>
              <option value="instituto">Instituto Virgolim</option>
              <option value="outros">Outros</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
            >
              <option value="">Todas as categorias</option>
              <option value="identificacao">Identificação</option>
              <option value="educacao">Educação</option>
              <option value="familia">Família</option>
              <option value="desenvolvimento">Desenvolvimento</option>
              <option value="metodologias">Metodologias</option>
              <option value="recursos">Recursos</option>
              <option value="casos">Casos</option>
              <option value="pesquisas">Pesquisas</option>
            </select>

            <Button
              onClick={() => {
                setFilterSource('');
                setFilterCategory('');
              }}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Items List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              Documentos na Base
            </h3>
            <Button
              onClick={() => loadItems()}
              variant="outline"
              size="sm"
            >
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <p className="text-light-muted dark:text-dark-muted">
                Nenhum documento encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-light-text dark:text-dark-text mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-light-muted dark:text-dark-muted mb-3 line-clamp-2">
                        {item.content.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}`}>
                          {item.source}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          {item.document_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    onClick={() => loadItems(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-light-muted dark:text-dark-muted">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    onClick={() => loadItems(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </Section>
    </Container>
  );
}
