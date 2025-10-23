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
import { Plus, Edit, Trash2, Play, Clock, FileText, ArrowLeft, ExternalLink } from "lucide-react";

interface Trail {
  id: string;
  title: string;
  slug: string;
  page_id: string;
}

interface Module {
  id: string;
  title: string;
  slug: string;
  trail_id: string;
  position: number;
  trails?: Trail;
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
  modules?: Module;
}

export default function AdminLessonsPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  
  const [trails, setTrails] = useState<Trail[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    module_id: "",
    position: 1,
    content_type: "video",
    duration: 15
  });

  useEffect(() => {
    loadTrails();
  }, []);

  useEffect(() => {
    if (selectedTrail) {
      loadModules(selectedTrail);
      setSelectedModule(""); // Reset module selection
    }
  }, [selectedTrail]);

  useEffect(() => {
    if (selectedModule) {
      loadContents(selectedModule);
    }
  }, [selectedModule]);

  async function loadTrails() {
    setLoading(true);
    
    try {
      // Carregar trilhas da página "Montanha do Amanhã"
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'montanha-do-amanha')
        .single();

      if (pageError) throw pageError;

      if (pageData) {
        const { data: trailsData, error: trailsError } = await supabase
          .from('trails')
          .select('id, title, slug, page_id')
          .eq('page_id', pageData.id)
          .order('position');
        
        if (trailsError) {
          console.error('Erro ao carregar trilhas:', trailsError);
          push('Erro ao carregar trilhas', 'error');
          return;
        }
        
        setTrails(trailsData || []);
        
        // Selecionar primeira trilha por padrão
        if (trailsData && trailsData.length > 0) {
          setSelectedTrail(trailsData[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error);
      push('Erro ao carregar trilhas', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadModules(trailId: string) {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          trails (
            id,
            title,
            slug
          )
        `)
        .eq('trail_id', trailId)
        .order('position');
      
      if (modulesError) {
        console.error('Erro ao carregar módulos:', modulesError);
        push('Erro ao carregar módulos', 'error');
        return;
      }
      
      setModules(modulesData || []);
      
      // Selecionar primeiro módulo por padrão
      if (modulesData && modulesData.length > 0) {
        setSelectedModule(modulesData[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
      push('Erro ao carregar módulos', 'error');
    }
  }

  async function loadContents(moduleId: string) {
    setLoading(true);
    
    try {
      const { data: contentsData, error: contentsError } = await supabase
        .from('contents')
        .select(`
          *,
          modules (
            id,
            title,
            slug,
            trail_id,
            position,
            trails (
              id,
              title,
              slug
            )
          )
        `)
        .eq('module_id', moduleId)
        .order('position');
      
      if (contentsError) {
        console.error('Erro ao carregar conteúdos:', contentsError);
        push('Erro ao carregar conteúdos', 'error');
        return;
      }
      
      setContents(contentsData || []);
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
      push('Erro ao carregar conteúdos', 'error');
    } finally {
      setLoading(false);
    }
  }

  function editLesson(lesson: Lesson) {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      slug: lesson.slug,
      module_id: lesson.module_id,
      position: lesson.position,
      video_url: lesson.video_url || "",
      materials_url: lesson.materials_url || "",
      duration: lesson.duration || 15
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      slug: "",
      module_id: selectedModule,
      position: lessons.length + 1,
      video_url: "",
      materials_url: "",
      duration: 15
    });
  }

  function openCreateModal() {
    resetForm();
    setEditingLesson(null);
    setShowModal(true);
  }

  async function saveLesson() {
    try {
      if (!formData.title || !formData.slug || !formData.module_id) {
        push('Título, slug e módulo são obrigatórios', 'error');
        return;
      }

      if (editingLesson) {
        // Atualizar aula existente
        const { error } = await supabase
          .from('lessons')
          .update({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            module_id: formData.module_id,
            position: formData.position,
            video_url: formData.video_url || null,
            materials_url: formData.materials_url || null,
            duration: formData.duration
          })
          .eq('id', editingLesson.id);

        if (error) {
          console.error('Erro ao atualizar aula:', error);
          push('Erro ao atualizar aula', 'error');
          return;
        }

        push('Aula atualizada com sucesso!', 'success');
      } else {
        // Criar nova aula
        const { error } = await supabase
          .from('lessons')
          .insert({
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            module_id: formData.module_id,
            position: formData.position,
            video_url: formData.video_url || null,
            materials_url: formData.materials_url || null,
            duration: formData.duration
          });

        if (error) {
          console.error('Erro ao criar aula:', error);
          push('Erro ao criar aula', 'error');
          return;
        }

        push('Aula criada com sucesso!', 'success');
      }

      // Recarregar dados
      if (selectedModule) {
        await loadLessons(selectedModule);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      push('Erro ao salvar aula', 'error');
    }
  }

  async function deleteLesson(lessonId: string) {
    try {
      // Confirmar exclusão
      if (!confirm('Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.')) {
        return;
      }

      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) {
        console.error('Erro ao deletar aula:', error);
        push('Erro ao deletar aula', 'error');
        return;
      }

      push('Aula deletada com sucesso!', 'success');
      if (selectedModule) {
        await loadLessons(selectedModule);
      }
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      push('Erro ao deletar aula', 'error');
    }
  }

  const selectedTrailData = trails.find(t => t.id === selectedTrail);
  const selectedModuleData = modules.find(m => m.id === selectedModule);

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Gerenciar Aulas" 
          subtitle="Configure aulas, vídeos e materiais dentro dos módulos" 
        />

        <div className="space-y-6">
          {/* Seletores de trilha e módulo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-accent" />
              <span className="text-sm font-medium text-light-text dark:text-dark-text">
                Trilha:
              </span>
            </div>
            <select
              value={selectedTrail}
              onChange={(e) => setSelectedTrail(e.target.value)}
              className="px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface shadow-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-brand-accent/20"
            >
              {trails.map((trail) => (
                <option key={trail.id} value={trail.id}>
                  {trail.title}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-light-text dark:text-dark-text">
                Módulo:
              </span>
            </div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface shadow-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-brand-accent/20"
              disabled={!selectedTrail}
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Aulas do Módulo: {selectedModuleData?.title || 'Selecione um módulo'}
              </h2>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Gerencie as aulas, vídeos e materiais deste módulo
              </p>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="bg-brand-accent text-white hover:bg-brand-accent/90"
              disabled={!selectedModule}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Aula
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-light-muted dark:text-dark-muted">Carregando aulas...</p>
              </div>
            ) : !selectedModule ? (
              <Card className="text-center py-12">
                <Play className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Selecione um módulo
                </h3>
                <p className="text-light-muted dark:text-dark-muted">
                  Escolha uma trilha e módulo para gerenciar suas aulas
                </p>
              </Card>
            ) : lessons.length === 0 ? (
              <Card className="text-center py-12">
                <Play className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Nenhuma aula configurada
                </h3>
                <p className="text-light-muted dark:text-dark-muted mb-4">
                  Comece criando uma nova aula para este módulo
                </p>
                <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
                  Criar Primeira Aula
                </Button>
              </Card>
            ) : (
              lessons.map((lesson) => (
                <Card key={lesson.id} className="p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Play className="w-5 h-5 text-brand-accent" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                          {lesson.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-brand-accent/10 text-brand-accent rounded-full">
                          Posição {lesson.position}
                        </span>
                      </div>
                      
                      <p className="text-light-muted dark:text-dark-muted mb-4">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-light-muted dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration || 15}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Slug: {lesson.slug}</span>
                        </div>
                        {lesson.video_url && (
                          <div className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            <span>Com vídeo</span>
                          </div>
                        )}
                        {lesson.materials_url && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>Com materiais</span>
                          </div>
                        )}
                      </div>
                      
                      {lesson.video_url && (
                        <div className="mt-3 p-3 bg-light-border/20 dark:bg-dark-border/20 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Play className="w-4 h-4 text-brand-accent" />
                            <span className="text-sm font-medium text-light-text dark:text-dark-text">
                              Vídeo:
                            </span>
                          </div>
                          <div className="text-xs text-light-muted dark:text-dark-muted break-all">
                            {lesson.video_url}
                          </div>
                        </div>
                      )}
                      
                      {lesson.materials_url && (
                        <div className="mt-3 p-3 bg-light-border/20 dark:bg-dark-border/20 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-brand-accent" />
                            <span className="text-sm font-medium text-light-text dark:text-dark-text">
                              Materiais:
                            </span>
                          </div>
                          <div className="text-xs text-light-muted dark:text-dark-muted break-all">
                            {lesson.materials_url}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/catalog/modulo/${lesson.modules?.slug}/assistir`, '_blank')}
                        title="Visualizar aula"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => editLesson(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteLesson(lesson.id)}
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

        {/* Modal para criar/editar aula */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                {editingLesson ? 'Editar Aula' : 'Nova Aula'}
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Configure os dados da aula educacional
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Aula</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Introdução aos Aspectos Cognitivos"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o conteúdo e objetivos da aula..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface shadow-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-brand-accent/20 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="ex: introducao-aspectos-cognitivos"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Posição</Label>
                  <Input
                    id="position"
                    type="number"
                    min="1"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                    className="bg-light-surface dark:bg-dark-surface shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                    className="bg-light-surface dark:bg-dark-surface shadow-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="video_url">URL do Vídeo (Vimeo)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="ex: https://vimeo.com/123456789"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>

              <div>
                <Label htmlFor="materials_url">URL dos Materiais (PDF)</Label>
                <Input
                  id="materials_url"
                  value={formData.materials_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, materials_url: e.target.value }))}
                  placeholder="ex: https://exemplo.com/material.pdf"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={saveLesson}
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


