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
import { Plus, Edit, Trash2, BookOpen, Users, Play, ArrowLeft, AlertTriangle } from "lucide-react";

interface Trail {
  id: string;
  title: string;
  slug: string;
  page_id: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  slug: string;
  trail_id: string;
  position: number;
  contents?: Content[];
  trails?: Trail;
  cover_url?: string | null;
  banner_url?: string | null;
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
  video_url?: string | null;
  materials_url?: string | null;
}

export default function AdminModulesPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  
  const [trails, setTrails] = useState<Trail[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<string>("");
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    trail_id: "",
    position: 1,
    cover_url: "", // Imagem pequena para a trilha (700x700)
    banner_url: "" // Banner grande para o módulo (2700x900)
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    loadTrails();
  }, []);

  useEffect(() => {
    if (selectedTrail) {
      loadModules(selectedTrail);
    }
  }, [selectedTrail]);

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

      const pageId = (pageData as { id: string } | null)?.id;

      if (pageId) {
        const { data: trailsData, error: trailsError } = await supabase
          .from('trails')
          .select('id, title, slug, page_id')
          .eq('page_id', pageId)
          .order('position');
        
        if (trailsError) {
          console.error('Erro ao carregar trilhas:', trailsError);
          push({ message: 'Erro ao carregar trilhas', variant: 'error' });
          return;
        }
        
        const typedTrails = (trailsData as Trail[] | null) ?? [];
        setTrails(typedTrails);

        // Selecionar primeira trilha por padrão
        if (typedTrails.length > 0) {
          setSelectedTrail(typedTrails[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error);
      push({ message: 'Erro ao carregar trilhas', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function loadModules(trailId: string) {
    setLoading(true);
    
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
        push({ message: 'Erro ao carregar módulos', variant: 'error' });
        return;
      }
      
      // Para cada módulo, buscar seus conteúdos
      const typedModules = (modulesData as Module[] | null) ?? [];

      const modulesWithContents = await Promise.all(
        typedModules.map(async (module: Module) => {
          const { data: contentsData, error: contentsError } = await supabase
            .from('contents')
            .select('*')
            .eq('module_id', module.id)
            .order('position');
          
          if (contentsError) {
            console.error('Erro ao carregar conteúdos:', contentsError);
            return { ...module, contents: [] };
          }

          const typedContents = (contentsData as Content[] | null) ?? [];

          return {
            ...module,
            contents: typedContents
          };
        })
      );
      
      setModules(modulesWithContents);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
      push({ message: 'Erro ao carregar módulos', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function editModule(module: Module) {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      slug: module.slug,
      trail_id: module.trail_id,
      position: module.position,
      cover_url: module.cover_url || "",
      banner_url: module.banner_url || ""
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      slug: "",
      trail_id: selectedTrail,
      position: modules.length + 1,
      cover_url: "",
      banner_url: ""
    });
  }

  function openCreateModal() {
    resetForm();
    setEditingModule(null);
    setShowModal(true);
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `module-cover-${Date.now()}.${fileExt}`;
      const filePath = `module-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('module-covers')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        push({ message: 'Erro ao fazer upload da capa', variant: 'error' });
        return;
      }

      const { data } = supabase.storage
        .from('module-covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_url: data.publicUrl }));
      push({ message: 'Capa enviada com sucesso!', variant: 'success' });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      push({ message: 'Erro ao fazer upload da capa', variant: 'error' });
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleBannerUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `module-banner-${Date.now()}.${fileExt}`;
      const filePath = `module-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('module-covers')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        push({ message: 'Erro ao fazer upload do banner', variant: 'error' });
        return;
      }

      const { data } = supabase.storage
        .from('module-covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, banner_url: data.publicUrl }));
      push({ message: 'Banner enviado com sucesso!', variant: 'success' });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      push({ message: 'Erro ao fazer upload do banner', variant: 'error' });
    } finally {
      setUploadingBanner(false);
    }
  }

  async function saveModule() {
    try {
      if (!formData.title || !formData.slug || !formData.trail_id) {
        push({ message: 'Título, slug e trilha são obrigatórios', variant: 'error' });
        return;
      }

      if (editingModule) {
        // Atualizar módulo existente
        const updatePayload: Partial<Module> = {
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          trail_id: formData.trail_id,
          position: formData.position,
          cover_url: formData.cover_url || null,
          banner_url: formData.banner_url || null
        };

        const modulesTable = supabase.from('modules') as any;
        const { error } = await modulesTable
          .update(updatePayload)
          .eq('id', editingModule.id);

        if (error) {
          console.error('Erro ao atualizar módulo:', error);
          push({ message: 'Erro ao atualizar módulo', variant: 'error' });
          return;
        }

        push({ message: 'Módulo atualizado com sucesso!', variant: 'success' });
      } else {
        // Criar novo módulo
        const insertPayload: Omit<Module, 'id' | 'contents' | 'trails'> = {
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          trail_id: formData.trail_id,
          position: formData.position,
          cover_url: formData.cover_url || null,
          banner_url: formData.banner_url || null
        };

        const modulesTable = supabase.from('modules') as any;
        const { error } = await modulesTable.insert(insertPayload);

        if (error) {
          console.error('Erro ao criar módulo:', error);
          push({ message: 'Erro ao criar módulo', variant: 'error' });
          return;
        }

        push({ message: 'Módulo criado com sucesso!', variant: 'success' });
      }

      // Recarregar dados
      if (selectedTrail) {
        await loadModules(selectedTrail);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      push({ message: 'Erro ao salvar módulo', variant: 'error' });
    }
  }

  function openDeleteModal(module: Module) {
    setModuleToDelete(module);
    setShowConfirmModal(true);
  }

  async function confirmDeleteModule() {
    if (!moduleToDelete) return;

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleToDelete.id);

      if (error) {
        console.error('Erro ao deletar módulo:', error);
        push({ message: 'Erro ao deletar módulo', variant: 'error' });
        return;
      }

      push({ message: 'Módulo deletado com sucesso!', variant: 'success' });
      if (selectedTrail) {
        await loadModules(selectedTrail);
      }
      setShowConfirmModal(false);
      setModuleToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar módulo:', error);
      push({ message: 'Erro ao deletar módulo', variant: 'error' });
    }
  }

  const selectedTrailData = trails.find(t => t.id === selectedTrail);

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Gerenciar Módulos" 
          subtitle="Configure módulos e aulas dentro das trilhas educacionais" 
        />

        <div className="space-y-6">
          {/* Seletor de trilha */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-accent" />
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
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Módulos da Trilha: {selectedTrailData?.title || 'Selecione uma trilha'}
              </h2>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Gerencie os módulos e aulas desta trilha
              </p>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="bg-brand-accent text-white hover:bg-brand-accent/90"
              disabled={!selectedTrail}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Módulo
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-light-muted dark:text-dark-muted">Carregando módulos...</p>
              </div>
            ) : !selectedTrail ? (
              <Card className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Selecione uma trilha
                </h3>
                <p className="text-light-muted dark:text-dark-muted">
                  Escolha uma trilha para gerenciar seus módulos
                </p>
              </Card>
            ) : modules.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Nenhum módulo configurado
                </h3>
                <p className="text-light-muted dark:text-dark-muted mb-4">
                  Comece criando um novo módulo para esta trilha
                </p>
                <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
                  Criar Primeiro Módulo
                </Button>
              </Card>
            ) : (
              modules.map((module) => (
                <Card key={module.id} className="p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-brand-accent" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                          {module.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-brand-accent/10 text-brand-accent rounded-full">
                          Posição {module.position}
                        </span>
                      </div>
                      
                      <p className="text-light-muted dark:text-dark-muted mb-4">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-light-muted dark:text-dark-muted">
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span>{module.contents?.length || 0} aulas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Slug: {module.slug}</span>
                        </div>
                      </div>
                      
                      {module.contents && module.contents.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Aulas:
                          </h4>
                          <div className="space-y-2">
                            {module.contents.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-light-border/20 dark:bg-dark-border/20 rounded-lg shadow-sm">
                                <div>
                                  <div className="font-medium text-light-text dark:text-dark-text">
                                    {lesson.title}
                                  </div>
                                  <div className="text-xs text-light-muted dark:text-dark-muted">
                                    Posição {lesson.position} • {lesson.video_url ? 'Com vídeo' : 'Sem vídeo'}
                                  </div>
                                </div>
                                <div className="text-xs text-light-muted dark:text-dark-muted">
                                  {lesson.slug}
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
                        onClick={() => window.open(`/catalog/modulo/${module.slug}`, '_blank')}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => editModule(module)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteModal(module)}
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

        {/* Modal para criar/editar módulo */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Configure os dados do módulo educacional
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Módulo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Aspectos Cognitivos"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o objetivo e conteúdo do módulo..."
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
                  placeholder="ex: aspectos-cognitivos"
                  className="bg-light-surface dark:bg-dark-surface shadow-sm"
                />
              </div>

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
                <Label htmlFor="cover_image">Capa para Trilha (Opcional)</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="cover_image"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                  <label
                    htmlFor="cover_image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-lg transition-colors"
                  >
                    {uploadingCover ? 'Enviando...' : 'Enviar Capa'}
                  </label>
                  {formData.cover_url && (
                    <div className="mt-2">
                      <div className="relative inline-block">
                        <img
                          src={formData.cover_url}
                          alt="Preview Capa"
                          className="w-32 h-32 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, cover_url: "" }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Imagem ideal: 700x700px (1:1 - Quadrada)
                </p>
              </div>

              <div>
                <Label htmlFor="banner_image">Banner do Módulo (Opcional)</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="banner_image"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    disabled={uploadingBanner}
                  />
                  <label
                    htmlFor="banner_image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-lg transition-colors"
                  >
                    {uploadingBanner ? 'Enviando...' : 'Enviar Banner'}
                  </label>
                  {formData.banner_url && (
                    <div className="mt-2">
                      <div className="relative inline-block">
                        <img
                          src={formData.banner_url}
                          alt="Preview Banner"
                          className="w-32 h-10 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, banner_url: "" }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Imagem ideal: 2700x900px (3:1 - Banner horizontal)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={saveModule}
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
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteModule}
          title="Confirmar exclusão"
          description={`Tem certeza que deseja excluir o módulo "${moduleToDelete?.title}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
        />
      </Section>
    </Container>
  );
}
