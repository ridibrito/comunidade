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
import Label from "@/components/ui/Label";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus, Edit, Trash2, BookOpen, Users, Play, AlertTriangle } from "lucide-react";

interface Page {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
}

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  page_id: string;
  position: number;
  modules?: Module[];
  pages?: Page;
}

interface Module {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
  position: number;
  contents?: Content[];
  lessons?: { id: string }[];
}

interface Content {
  id: string;
  module_id: string;
  title: string;
  description: string;
  slug: string;
  content_type: string;
  duration: number;
  position: number;
}

export default function AdminTrailsPage() {
  const supabase = getBrowserSupabaseClient() as any;
  const { push } = useToast();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [trailToDelete, setTrailToDelete] = useState<Trail | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    page_id: "",
    position: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    
    try {
      // Carregar páginas
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('position');

      if (pagesError) throw pagesError;
      setPages((pagesData as Page[] | null) ?? []);

      // Carregar trilhas da página "Montanha do Amanhã"
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'montanha-do-amanha')
        .single();

      if (pageError) throw pageError;

      if (pageData) {
        const pageId = (pageData as Page).id;
        const { data: trailsData, error: trailsError } = await supabase
          .from('trails')
          .select('*')
          .eq('page_id', pageId);
        
        if (trailsError) {
          console.error('Erro ao carregar trilhas:', trailsError);
          push({ message: 'Erro ao carregar trilhas', variant: 'error' });
          return;
        }
        
        // Para cada trilha, buscar seus módulos
        const typedTrails = (trailsData as Trail[] | null) ?? [];

        const trailsWithModules = await Promise.all(
          typedTrails.map(async (trail: Trail) => {
            const { data: modulesData, error: modulesError } = await supabase
              .from('modules')
              .select('*')
              .eq('trail_id', trail.id);
            
            if (modulesError) {
              console.error('Erro ao carregar módulos:', modulesError);
              return { ...trail, modules: [] };
            }
            
            // Para cada módulo, buscar seus conteúdos
            const modulesWithContents = await Promise.all(
              ((modulesData as Module[] | null) ?? []).map(async (module: Module) => {
                const { data: contentsData, error: contentsError } = await supabase
                  .from('contents')
                  .select('*')
                  .eq('module_id', module.id);
                
                if (contentsError) {
                  console.error('Erro ao carregar conteúdos:', contentsError);
                  return { ...module, contents: [] };
                }
                
                return {
                  ...module,
                  contents: (contentsData as Content[] | null) ?? []
                };
              })
            );
            
            return {
              ...trail,
              modules: modulesWithContents
            };
          })
        );
        
        setTrails(trailsWithModules as Trail[]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      push({ message: 'Erro ao carregar dados', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function editTrail(trail: Trail) {
    setEditingTrail(trail);
    setFormData({
      title: trail.title,
      description: trail.description,
      slug: trail.slug,
      page_id: trail.page_id,
      position: trail.position
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      slug: "",
      page_id: "",
      position: 0
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
      push({ message: 'Título e slug são obrigatórios', variant: 'error' });
        return;
      }

      if (editingTrail) {
        // Atualizar trilha existente
        const { error } = await supabase
          .from('trails')
          .update({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            page_id: formData.page_id,
            position: formData.position
          })
          .eq('id', editingTrail.id);

        if (error) {
          console.error('Erro ao atualizar trilha:', error);
          push({ message: 'Erro ao atualizar trilha', variant: 'error' });
          return;
        }

        push({ message: 'Trilha atualizada com sucesso!', variant: 'success' });
      } else {
        // Criar nova trilha
        const { error } = await supabase
          .from('trails')
          .insert({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            page_id: formData.page_id,
            position: formData.position
          });

        if (error) {
          console.error('Erro ao criar trilha:', error);
          push({ message: 'Erro ao criar trilha', variant: 'error' });
          return;
        }

        push({ message: 'Trilha criada com sucesso!', variant: 'success' });
      }

      // Recarregar dados
      await loadData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      push({ message: 'Erro ao salvar trilha', variant: 'error' });
    }
  }

  function openDeleteModal(trail: Trail) {
    console.log('🔍 Abrindo modal de exclusão para trilha:', trail.title, 'ID:', trail.id);
    setTrailToDelete(trail);
    setShowConfirmModal(true);
  }

  async function confirmDeleteTrail() {
    if (!trailToDelete) {
      console.log('❌ Nenhuma trilha selecionada para exclusão');
      return;
    }

    console.log('🗑️ Iniciando exclusão da trilha:', trailToDelete.title, 'ID:', trailToDelete.id);

    try {
      const { error } = await supabase
        .from('trails')
        .delete()
        .eq('id', trailToDelete.id);

      if (error) {
        console.error('❌ Erro ao deletar trilha:', error);
        push({ message: 'Erro ao deletar trilha', variant: 'error' });
        return;
      }

      console.log('✅ Trilha deletada com sucesso!');
      push({ message: 'Trilha deletada com sucesso!', variant: 'success' });
      await loadData();
      setShowConfirmModal(false);
      setTrailToDelete(null);
    } catch (error) {
      console.error('❌ Erro ao deletar trilha:', error);
      push({ message: 'Erro ao deletar trilha', variant: 'error' });
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
                          Trilha
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
                                    {module.description}
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
                        onClick={() => openDeleteModal(trail)}
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

        {/* Modal de confirmação de exclusão */}
        <ConfirmModal
          open={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setTrailToDelete(null);
          }}
          onConfirm={confirmDeleteTrail}
          title="Excluir Trilha"
          description="Tem certeza que deseja excluir esta trilha? Esta ação irá excluir todos os módulos e aulas associados."
          confirmText="Excluir Trilha"
          cancelText="Cancelar"
          variant="destructive"
        >
          {trailToDelete && (
            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Trilha: {trailToDelete.title}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Esta ação irá excluir permanentemente:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 mt-1 ml-4 list-disc">
                    <li>Todos os módulos da trilha</li>
                    <li>Todas as aulas dos módulos</li>
                    <li>Todo o progresso dos usuários</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </ConfirmModal>
      </Section>
    </Container>
  );
}
