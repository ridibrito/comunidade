"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Modal from "@/components/ui/Modal";
import { Plus, Edit, Trash2, BookOpen, Users, Play } from "lucide-react";

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  mountain_id: string;
  position: number;
  modules?: Module[];
}

interface Module {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
  position: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  slug: string;
  video_url?: string;
  position: number;
}

export default function AdminTrailsPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: ""
  });

  useEffect(() => {
    loadTrails();
  }, []);

  async function loadTrails() {
    setLoading(true);
    
    try {
      // Buscar trilhas do Supabase
      const { data: trailsData, error: trailsError } = await supabase
        .from('trails')
        .select('*');
      
      if (trailsError) {
        console.error('Erro ao carregar trilhas:', trailsError);
        push('Erro ao carregar trilhas', 'error');
        return;
      }
      
      // Para cada trilha, buscar seus módulos
      const trailsWithModules = await Promise.all(
        (trailsData || []).map(async (trail) => {
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .eq('trail_id', trail.id);
          
          if (modulesError) {
            console.error('Erro ao carregar módulos:', modulesError);
            return { ...trail, modules: [] };
          }
          
          // Para cada módulo, buscar suas aulas
          const modulesWithLessons = await Promise.all(
            (modulesData || []).map(async (module) => {
              const { data: lessonsData, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id);
              
              if (lessonsError) {
                console.error('Erro ao carregar aulas:', lessonsError);
                return { ...module, lessons: [] };
              }
              
              return {
                ...module,
                lessons: lessonsData || []
              };
            })
          );
          
          return {
            ...trail,
            modules: modulesWithLessons
          };
        })
      );
      
      setTrails(trailsWithModules);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      push('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }

  function editTrail(trail: Trail) {
    setEditingTrail(trail);
    setFormData({
      title: trail.title,
      description: trail.description,
      slug: trail.slug
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      slug: ""
    });
  }

  function openCreateModal() {
    resetForm();
    setEditingTrail(null);
    setShowModal(true);
  }

  async function saveTrail() {
    try {
      if (!formData.title || !formData.slug) {
        push('Título e slug são obrigatórios', 'error');
        return;
      }

      // Buscar montanha existente para vincular a trilha
      const { data: mountains, error: mountainsError } = await supabase
        .from('mountains')
        .select('id')
        .limit(1);
      
      if (mountainsError || !mountains || mountains.length === 0) {
        push('Erro ao buscar montanha para vincular a trilha', 'error');
        return;
      }

      const mountainId = mountains[0].id;

      if (editingTrail) {
        // Atualizar trilha existente
        const { error } = await supabase
          .from('trails')
          .update({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            mountain_id: mountainId
          })
          .eq('id', editingTrail.id);

        if (error) {
          console.error('Erro ao atualizar trilha:', error);
          push('Erro ao atualizar trilha', 'error');
          return;
        }

        push('Trilha atualizada com sucesso!', 'success');
      } else {
        // Criar nova trilha
        const { error } = await supabase
          .from('trails')
          .insert({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            mountain_id: mountainId
          });

        if (error) {
          console.error('Erro ao criar trilha:', error);
          push('Erro ao criar trilha', 'error');
          return;
        }

        push('Trilha criada com sucesso!', 'success');
      }

      // Recarregar dados
      await loadTrails();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      push('Erro ao salvar trilha', 'error');
    }
  }

  async function deleteTrail(trailId: string) {
    try {
      const { error } = await supabase
        .from('trails')
        .delete()
        .eq('id', trailId);

      if (error) {
        console.error('Erro ao deletar trilha:', error);
        push('Erro ao deletar trilha', 'error');
        return;
      }

      push('Trilha deletada com sucesso!', 'success');
      await loadTrails();
    } catch (error) {
      console.error('Erro ao deletar trilha:', error);
      push('Erro ao deletar trilha', 'error');
    }
  }

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Gerenciar Trilhas" 
          subtitle="Configure trilhas, módulos e aulas do sistema educacional" 
        />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Trilhas Disponíveis
              </h2>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Gerencie o conteúdo educacional da plataforma
              </p>
            </div>
            <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Trilha
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-light-muted dark:text-dark-muted">Carregando trilhas...</p>
              </div>
            ) : trails.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Nenhuma trilha configurada
                </h3>
                <p className="text-light-muted dark:text-dark-muted mb-4">
                  Comece criando uma nova trilha educacional
                </p>
                <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
                  Criar Primeira Trilha
                </Button>
              </Card>
            ) : (
              trails.map((trail) => (
                <Card key={trail.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-brand-accent" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                          {trail.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-brand-accent/10 text-brand-accent rounded-full">
                          {trail.type}
                        </span>
                      </div>
                      
                      <p className="text-light-muted dark:text-dark-muted mb-4">
                        {trail.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-light-muted dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{trail.modules?.length || 0} módulos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span>{trail.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} aulas</span>
                        </div>
                      </div>
                      
                      {trail.modules && trail.modules.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Módulos:
                          </h4>
                          <div className="space-y-2">
                            {trail.modules.map((module) => (
                              <div key={module.id} className="flex items-center justify-between p-3 bg-light-border/30 dark:bg-dark-border/30 rounded-lg">
                                <div>
                                  <div className="font-medium text-light-text dark:text-dark-text">
                                    {module.title}
                                  </div>
                                  <div className="text-xs text-light-muted dark:text-dark-muted">
                                    {module.instructor} • {module.duration} • {module.difficulty}
                                  </div>
                                </div>
                                <div className="text-xs text-light-muted dark:text-dark-muted">
                                  {module.lessons?.length || 0} aulas
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTrail(trail)}
                      >
                        <BookOpen className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => editTrail(trail)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteTrail(trail.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Modal para criar/editar trilha */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                {editingTrail ? 'Editar Trilha' : 'Nova Trilha'}
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Configure os dados da trilha educacional
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Trilha</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Montanha do Amanhã"
                  className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o objetivo e conteúdo da trilha..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="ex: montanha-do-amanha"
                  className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20"
                >
                  <option value="montanha">Montanha</option>
                  <option value="acervo">Acervo Digital</option>
                  <option value="rodas">Rodas de Conversa</option>
                  <option value="plantao">Plantão de Dúvidas</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={saveTrail}
                className="bg-brand-accent text-white hover:bg-brand-accent/90 flex-1"
              >
                Salvar
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </Section>
    </Container>
  );
}