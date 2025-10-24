"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Bot, Settings, MessageSquare, BarChart3, Save, RefreshCw } from "lucide-react";

interface IAPrompt {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IAStats {
  totalMessages: number;
  totalUsers: number;
  averageResponseTime: number;
  lastActivity: string;
}

export default function AdminIAPage() {
  const [prompts, setPrompts] = useState<IAPrompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<IAPrompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<IAStats>({
    totalMessages: 0,
    totalUsers: 0,
    averageResponseTime: 0,
    lastActivity: ''
  });

  // Formulário para novo prompt
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    content: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadPrompts();
    loadStats();
  }, []);

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/ia/prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      } else {
        console.error('Erro ao carregar prompts');
      }
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Simular carregamento de estatísticas
      const mockStats: IAStats = {
        totalMessages: 1247,
        totalUsers: 89,
        averageResponseTime: 2.3,
        lastActivity: new Date().toISOString()
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt.name || !newPrompt.content) return;

    try {
      const response = await fetch('/api/ia/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });

      if (response.ok) {
        const createdPrompt = await response.json();
        setPrompts(prev => [...prev, createdPrompt]);
        setNewPrompt({ name: '', content: '' });
      } else {
        console.error('Erro ao criar prompt');
      }
    } catch (error) {
      console.error('Erro ao criar prompt:', error);
    }
  };

  const handleEditPrompt = (prompt: IAPrompt) => {
    setCurrentPrompt(prompt);
    setIsEditing(true);
  };

  const handleSavePrompt = async () => {
    if (!currentPrompt) return;

    try {
      const response = await fetch(`/api/ia/prompts/${currentPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentPrompt.name,
          content: currentPrompt.content,
        }),
      });

      if (response.ok) {
        const updatedPrompt = await response.json();
        setPrompts(prev => prev.map(p => 
          p.id === currentPrompt.id ? updatedPrompt : p
        ));
        setCurrentPrompt(null);
        setIsEditing(false);
      } else {
        console.error('Erro ao atualizar prompt');
      }
    } catch (error) {
      console.error('Erro ao atualizar prompt:', error);
    }
  };

  const handleActivatePrompt = async (promptId: string) => {
    try {
      const response = await fetch('/api/ia/prompts/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: promptId }),
      });

      if (response.ok) {
        // Recarregar prompts para refletir mudanças
        await loadPrompts();
        console.log('Prompt ativado com sucesso');
      } else {
        console.error('Erro ao ativar prompt');
      }
    } catch (error) {
      console.error('Erro ao ativar prompt:', error);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/ia/prompts/${promptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrompts(prev => prev.filter(p => p.id !== promptId));
        console.log('Prompt excluído com sucesso');
      } else {
        console.error('Erro ao excluir prompt');
      }
    } catch (error) {
      console.error('Erro ao excluir prompt:', error);
    }
  };

  return (
    <Container>
      <Section>
        <PageHeader
          title="Administração da IA"
          description="Gerencie prompts, configurações e monitore o desempenho da IA"
          icon={<Bot className="w-5 h-5" />}
        />

        <div className="space-y-6">
          {/* Estatísticas */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Estatísticas da IA
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                <div className="text-2xl font-bold text-brand-accent">{stats.totalMessages}</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Mensagens Totais</div>
              </div>
              <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                <div className="text-2xl font-bold text-brand-accent">{stats.totalUsers}</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Usuários Únicos</div>
              </div>
              <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                <div className="text-2xl font-bold text-brand-accent">{stats.averageResponseTime}s</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Tempo Médio</div>
              </div>
              <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                <div className="text-2xl font-bold text-brand-accent">
                  {new Date(stats.lastActivity).toLocaleDateString('pt-BR')}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Última Atividade</div>
              </div>
            </div>
          </ModernCard>

          {/* Gerenciamento de Prompts */}
          <ModernCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-brand-accent" />
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                  Gerenciamento de Prompts
                </h2>
              </div>
              <Button onClick={loadPrompts} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">Lista de Prompts</TabsTrigger>
                <TabsTrigger value="create">Criar Novo</TabsTrigger>
                <TabsTrigger value="edit">Editar</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="p-4 border border-light-border dark:border-dark-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-light-text dark:text-dark-text">
                          {prompt.name}
                        </h3>
                        {prompt.isActive && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                            Ativo
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPrompt(prompt)}
                        >
                          Editar
                        </Button>
                        {!prompt.isActive && (
                          <Button
                            size="sm"
                            onClick={() => handleActivatePrompt(prompt.id)}
                          >
                            Ativar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePrompt(prompt.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-light-muted dark:text-dark-muted line-clamp-3">
                      {prompt.content}
                    </p>
                    <div className="text-xs text-light-muted dark:text-dark-muted mt-2">
                      Criado em: {new Date(prompt.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt-name">Nome do Prompt</Label>
                    <Input
                      id="prompt-name"
                      value={newPrompt.name}
                      onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Prompt Principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prompt-content">Conteúdo do Prompt</Label>
                    <Textarea
                      id="prompt-content"
                      value={newPrompt.content}
                      onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Digite o conteúdo do prompt..."
                      rows={10}
                    />
                  </div>
                  <Button onClick={handleCreatePrompt} disabled={!newPrompt.name || !newPrompt.content}>
                    <Save className="w-4 h-4 mr-2" />
                    Criar Prompt
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                {currentPrompt ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-prompt-name">Nome do Prompt</Label>
                      <Input
                        id="edit-prompt-name"
                        value={currentPrompt.name}
                        onChange={(e) => setCurrentPrompt(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-prompt-content">Conteúdo do Prompt</Label>
                      <Textarea
                        id="edit-prompt-content"
                        value={currentPrompt.content}
                        onChange={(e) => setCurrentPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                        rows={10}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSavePrompt}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                      Selecione um Prompt para Editar
                    </h3>
                    <p className="text-light-muted dark:text-dark-muted">
                      Clique em "Editar" em um prompt da lista para começar a edição.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ModernCard>

          {/* Configurações Avançadas */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Configurações Avançadas
              </h2>
            </div>
            <div className="text-center py-8">
              <Settings className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Configurações da IA
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure parâmetros avançados como temperatura, tokens máximos e outros ajustes.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
