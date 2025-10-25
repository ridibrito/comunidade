"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Mountain, BookOpen, Users, HelpCircle, Plus, Edit, Trash2, ChevronDown, ChevronRight, Upload, Link as LinkIcon, Paperclip, FileDown } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useToast } from "@/components/ui/ToastProvider";

// Interfaces
interface Page {
  id: string;
  title: string;
  slug: string;
}

interface Trail {
  id: string;
  title: string;
  description: string;
  slug: string;
  page_id: string;
  position: number;
  isExpanded?: boolean;
  modules?: Module[];
}

interface Module {
  id: string;
  trail_id: string;
  title: string;
  description: string;
  slug: string;
  image_url?: string;
  position: number;
  isExpanded?: boolean;
  contents?: Content[];
}

interface Content {
  id: string;
  module_id: string | null;
  trail_id?: string | null;
  title: string;
  description: string;
  slug: string;
  content_type: string;
  duration: number;
  video_url?: string;
  image_url?: string;
  position: number;
  status: string;
}

interface ContentAsset {
  id: string;
  content_id: string;
  title: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export default function AdminMountainsPage() {
  const { push } = useToast();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState("montanha-do-amanha");
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showTrailModal, setShowTrailModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Editing states
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'trail' | 'module' | 'content', id: string, title: string} | null>(null);
  const [selectedTrailId, setSelectedTrailId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedTrailForDirectContent, setSelectedTrailForDirectContent] = useState<string>("");
  
  // Form data
  const [trailForm, setTrailForm] = useState({
    title: "",
    description: "",
    slug: "",
    position: 0
  });
  
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    slug: "",
    image_url: "",
    position: 0
  });
  
  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
  
  const [contentForm, setContentForm] = useState({
    title: "",
    description: "",
    slug: "",
    content_type: "video", // video | file | text | quiz
    duration: 0,
    video_url: "",
    image_url: "",
    position: 0,
    status: "draft"
  });

  // assets state
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [assetUploading, setAssetUploading] = useState(false);
  
  // Book upload modal state
  const [bookUploadModal, setBookUploadModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    description: "",
    pages: 0,
    file: null as File | null,
    cover: null as File | null
  });

  // Função para buscar duração do vídeo do Vimeo
  async function fetchVimeoDuration(videoUrl: string) {
    try {
      // Extrair ID do Vimeo da URL
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const match = videoUrl.match(vimeoRegex);
      
      if (!match) {
        console.log('URL do Vimeo inválida');
        return null;
      }
      
      const videoId = match[1];
      console.log('🎬 Buscando informações do vídeo Vimeo:', videoId);
      
      // Usar API oEmbed do Vimeo (não requer autenticação)
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`);
      
      if (!response.ok) {
        console.error('Erro ao buscar dados do Vimeo:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      // A API oEmbed do Vimeo retorna a duração em segundos
      if (data.duration) {
        const durationInMinutes = Math.ceil(data.duration / 60);
        console.log('✅ Duração encontrada:', durationInMinutes, 'minutos');
        return durationInMinutes;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar duração do Vimeo:', error);
      return null;
    }
  }

  // Função chamada quando a URL do vídeo é alterada
  async function handleVideoUrlChange(url: string) {
    setContentForm({ ...contentForm, video_url: url });
    
    // Se for uma URL do Vimeo, buscar duração automaticamente
    if (url.includes('vimeo.com')) {
      const duration = await fetchVimeoDuration(url);
      if (duration) {
        setContentForm(prev => ({ ...prev, duration, video_url: url }));
        push(`Duração carregada: ${duration} minutos`, 'success');
      }
    }
  }

  useEffect(() => {
    loadPageData(activeTab);
  }, [activeTab]);

  async function loadPageData(pageSlug: string) {
    try {
      setLoading(true);
      console.log(`🔄 Carregando dados da página: ${pageSlug}`);
      
      // Buscar página
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .single();

      if (pageError || !pageData) {
        console.error('Erro ao carregar página:', pageError);
        setTrails([]);
        return;
      }

      setCurrentPage(pageData);
      
      // Buscar trilhas
      const { data: trailsData, error: trailsError } = await supabase
        .from('trails')
        .select('*')
        .eq('page_id', pageData.id)
        .order('position');
      
      if (trailsError) {
        console.error('Erro ao carregar trilhas:', trailsError);
        setTrails([]);
        return;
      }
      
      // Para cada trilha, buscar módulos e conteúdos
      const trailsWithData = await Promise.all(
        (trailsData || []).map(async (trail) => {
          const { data: modulesData } = await supabase
            .from('modules')
            .select('*')
            .eq('trail_id', trail.id)
            .order('position');

          const modulesWithContents = await Promise.all(
            (modulesData || []).map(async (module) => {
              const { data: contentsData } = await supabase
                .from('contents')
                .select('*')
                .eq('module_id', module.id)
                .order('position');
              
              return {
                ...module,
                contents: contentsData || [],
                isExpanded: false
              };
            })
          );
          // também buscar conteúdos diretos da trilha (sem módulo)
          const { data: directContents } = await supabase
            .from('contents')
            .select('*')
            .eq('trail_id', trail.id)
            .is('module_id', null)
            .order('position');
          
          return {
            ...trail,
            modules: modulesWithContents,
            directContents: directContents || [],
            isExpanded: false
          };
        })
      );
      
      setTrails(trailsWithData);
      console.log('✅ Dados carregados:', trailsWithData.length, 'trilhas');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // Trail CRUD
  function openTrailModal(trail?: Trail) {
    if (trail) {
      setEditingTrail(trail);
      setTrailForm({
        title: trail.title,
        description: trail.description,
        slug: trail.slug,
        position: trail.position
      });
    } else {
      setEditingTrail(null);
      setTrailForm({
        title: "",
        description: "",
        slug: "",
        position: trails.length
      });
    }
    setShowTrailModal(true);
  }

  async function saveTrail() {
    if (!currentPage) return;
    
    try {
      if (editingTrail) {
        const { error } = await supabase
          .from('trails')
          .update({
            title: trailForm.title,
            description: trailForm.description,
            slug: trailForm.slug,
            position: trailForm.position
          })
          .eq('id', editingTrail.id);

        if (error) throw error;
        push('Trilha atualizada com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('trails')
          .insert({
            title: trailForm.title,
            description: trailForm.description,
            slug: trailForm.slug,
            page_id: currentPage.id,
            position: trailForm.position
          });

        if (error) throw error;
        push('Trilha criada com sucesso!', 'success');
      }

      setShowTrailModal(false);
      await loadPageData(activeTab);
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      push('Erro ao salvar trilha', 'error');
    }
  }

  // Book upload modal
  function openBookUploadModal(trailId: string) {
    setSelectedTrailForDirectContent(trailId);
    setBookForm({
      title: "",
      author: "",
      description: "",
      pages: 0,
      file: null,
      cover: null
    });
    setBookUploadModal(true);
  }

  // Module CRUD
  function openModuleModal(trailId: string, module?: Module) {
    setSelectedTrailId(trailId);
    
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title,
        description: module.description,
        slug: module.slug,
        image_url: module.image_url || "",
        position: module.position
      });
    } else {
      setEditingModule(null);
      const trail = trails.find(t => t.id === trailId);
      setModuleForm({
        title: "",
        description: "",
        slug: "",
        image_url: "",
        position: trail?.modules?.length || 0
      });
    }
    setShowModuleModal(true);
  }

  async function saveModule() {
    if (!selectedTrailId) return;
    
    try {
      if (editingModule) {
        const { error } = await supabase
          .from('modules')
          .update({
            title: moduleForm.title,
            description: moduleForm.description,
            slug: moduleForm.slug,
            image_url: moduleForm.image_url,
            position: moduleForm.position
          })
          .eq('id', editingModule.id);

        if (error) throw error;
        push('Módulo atualizado com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('modules')
          .insert({
            title: moduleForm.title,
            description: moduleForm.description,
            slug: moduleForm.slug,
            image_url: moduleForm.image_url,
            trail_id: selectedTrailId,
            position: moduleForm.position
          });

        if (error) throw error;
        push('Módulo criado com sucesso!', 'success');
      }

      setShowModuleModal(false);
      await loadPageData(activeTab);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      push('Erro ao salvar módulo', 'error');
    }
  }

  // Content CRUD
  function openContentModal(moduleId: string | null, content?: Content, trailIdForDirect?: string) {
    setSelectedModuleId(moduleId || "");
    setSelectedTrailForDirectContent(trailIdForDirect || "");
    
    if (content) {
      setEditingContent(content);
      setContentForm({
        title: content.title,
        description: content.description,
        slug: content.slug,
        content_type: content.content_type,
        duration: content.duration,
        video_url: content.video_url || "",
        image_url: content.image_url || "",
        position: content.position,
        status: content.status
      });
      void loadAssets(content.id);
    } else {
      setEditingContent(null);
      // Encontrar quantos conteúdos já existem no módulo ou na trilha
      const module = moduleId
        ? trails.flatMap(t => t.modules || []).find(m => m.id === moduleId)
        : null;
      const trail = trailIdForDirect
        ? trails.find(t => t.id === trailIdForDirect)
        : null;
      const directCount = trail && (trail as any).directContents ? (trail as any).directContents.length : 0;
      
      setContentForm({
        title: "",
        description: "",
        slug: "",
        content_type: "video",
        duration: 0,
        video_url: "",
        image_url: "",
        position: module ? (module.contents?.length || 0) : directCount,
        status: "draft"
      });
      setAssets([]);
    }
    setShowContentModal(true);
  }

  async function saveContent() {
    if (!selectedModuleId && !selectedTrailForDirectContent) return;
    
    try {
      if (editingContent) {
        const { error } = await supabase
          .from('contents')
          .update({
            title: contentForm.title,
            description: contentForm.description,
            slug: contentForm.slug,
            content_type: contentForm.content_type,
            duration: contentForm.duration,
            video_url: contentForm.video_url,
            image_url: contentForm.image_url,
            position: contentForm.position,
            status: contentForm.status
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        push('Aula atualizada com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('contents')
          .insert({
            title: contentForm.title,
            description: contentForm.description,
            slug: contentForm.slug,
            content_type: contentForm.content_type,
            duration: contentForm.duration,
            video_url: contentForm.video_url,
            image_url: contentForm.image_url,
            module_id: selectedModuleId || null,
            trail_id: selectedModuleId ? null : selectedTrailForDirectContent,
            position: contentForm.position,
            status: contentForm.status
          });

        if (error) throw error;
        push('Aula criada com sucesso!', 'success');
      }

      setShowContentModal(false);
      await loadPageData(activeTab);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      push('Erro ao salvar aula', 'error');
    }
  }

  async function saveBook() {
    if (!selectedTrailForDirectContent || !bookForm.file) return;
    
    try {
      // Upload do arquivo PDF
      const fileExt = bookForm.file.name.split('.').pop();
      const filePath = `books/${Date.now()}_${bookForm.title.replace(/[^a-z0-9]/gi, '_')}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content-assets')
        .upload(filePath, bookForm.file);
      
      if (uploadError) throw uploadError;
      
      const { data: fileData } = supabase.storage
        .from('content-assets')
        .getPublicUrl(filePath);
      
      // Upload da capa (se fornecida)
      let coverUrl = "";
      if (bookForm.cover) {
        const coverExt = bookForm.cover.name.split('.').pop();
        const coverPath = `book-covers/${Date.now()}_${bookForm.title.replace(/[^a-z0-9]/gi, '_')}.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('book-covers')
          .upload(coverPath, bookForm.cover);
        
        if (!coverError) {
          const { data: coverData } = supabase.storage
            .from('book-covers')
            .getPublicUrl(coverPath);
          coverUrl = coverData.publicUrl;
        }
      }
      
      // Criar o conteúdo do livro
      const { error } = await supabase
        .from('contents')
        .insert({
          title: bookForm.title,
          description: bookForm.description,
          slug: bookForm.title.toLowerCase().replace(/[^a-z0-9]/gi, '-'),
          content_type: 'book',
          file_url: fileData.publicUrl,
          image_url: coverUrl,
          duration: bookForm.pages, // Usar páginas como duração
          trail_id: selectedTrailForDirectContent,
          position: 0,
          status: 'published'
        });

      if (error) throw error;
      push('Livro enviado com sucesso!', 'success');
      
      setBookUploadModal(false);
      await loadPageData(activeTab);
    } catch (error) {
      console.error('Erro ao enviar livro:', error);
      push('Erro ao enviar livro', 'error');
    }
  }

  async function loadAssets(contentId: string) {
    try {
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAssets((data || []) as unknown as ContentAsset[]);
    } catch (e) {
      console.error('Erro ao carregar anexos:', e);
    }
  }

  async function handleAssetUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingContent) return;
    setAssetUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `content/${editingContent.id}/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('content-assets')
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = await supabase.storage
        .from('content-assets')
        .getPublicUrl(path);
      const { error: insErr } = await supabase
        .from('content_assets')
        .insert({
          content_id: editingContent.id,
          title: file.name,
          file_url: pub.publicUrl,
          file_type: file.type,
          file_size: file.size
        });
      if (insErr) throw insErr;
      await loadAssets(editingContent.id);
      push('Anexo enviado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao enviar anexo:', err);
      push('Erro ao enviar anexo', 'error');
    } finally {
      setAssetUploading(false);
      (e.target as HTMLInputElement).value = '';
    }
  }

  // Delete functions
  function openDeleteModal(type: 'trail' | 'module' | 'content', id: string, title: string) {
    setDeleteTarget({ type, id, title });
    setShowConfirmModal(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      const { error } = await supabase
        .from(deleteTarget.type === 'trail' ? 'trails' : deleteTarget.type === 'module' ? 'modules' : 'contents')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;

      push(`${deleteTarget.type === 'trail' ? 'Trilha' : deleteTarget.type === 'module' ? 'Módulo' : 'Aula'} excluído(a) com sucesso!`, 'success');
      setShowConfirmModal(false);
      setDeleteTarget(null);
      await loadPageData(activeTab);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      push('Erro ao excluir', 'error');
    }
  }

  // Toggle expand
  function toggleTrailExpand(trailId: string) {
    setTrails(trails.map(t => 
      t.id === trailId ? { ...t, isExpanded: !t.isExpanded } : t
    ));
  }

  function toggleModuleExpand(moduleId: string) {
    setTrails(trails.map(trail => ({
      ...trail,
      modules: trail.modules?.map(m =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    })));
  }

  // Upload de imagem para o storage do Supabase
  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      push('Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.', 'error');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      push('Arquivo muito grande. Tamanho máximo: 5MB.', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `module_${Date.now()}.${fileExt}`;
      const filePath = `modules/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('module-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('module-covers')
        .getPublicUrl(filePath);

      setModuleForm({ ...moduleForm, image_url: publicUrl });
      push('Imagem enviada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      push('Erro ao enviar imagem. Crie o bucket "module-covers" no Supabase Storage.', 'error');
    } finally {
      setUploadingImage(false);
    }
  }

  if (loading) {
    return (
      <Container fullWidth>
        <Section>
          <PageHeader 
            title="Gerenciar Conteúdo" 
            subtitle="Administre trilhas, módulos e aulas da plataforma" 
          />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Gerenciar Conteúdo" 
          subtitle="Administre trilhas, módulos e aulas da plataforma" 
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="montanha-do-amanha" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              <span className="hidden sm:inline">Montanha do Amanhã</span>
              <span className="sm:hidden">Montanha</span>
            </TabsTrigger>
            <TabsTrigger value="acervo-digital" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Acervo Digital</span>
              <span className="sm:hidden">Acervo</span>
            </TabsTrigger>
            <TabsTrigger value="rodas-de-conversa" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Rodas de Conversa</span>
              <span className="sm:hidden">Rodas</span>
            </TabsTrigger>
            <TabsTrigger value="plantao-de-duvidas" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Plantão de Dúvidas</span>
              <span className="sm:hidden">Plantão</span>
            </TabsTrigger>
          </TabsList>

          {/* Content for all tabs */}
          {["montanha-do-amanha", "acervo-digital", "rodas-de-conversa", "plantao-de-duvidas"].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6">
              {/* Header with Add Trail button */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    Trilhas
                  </h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    {trails.length} trilha(s) configurada(s)
                  </p>
                </div>
                <Button onClick={() => openTrailModal()} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Trilha
                </Button>
              </div>

              {/* Trails List */}
        {trails.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-light-muted dark:text-dark-muted">
                    Nenhuma trilha configurada. Clique em "Nova Trilha" para começar.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {trails.map((trail) => (
                    <Card key={trail.id} className="p-4">
                      {/* Trail Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
              <button 
                            onClick={() => toggleTrailExpand(trail.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          >
                            {trail.isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
              </button>
                          <div className="flex-1">
                            <h4 className="font-semibold text-light-text dark:text-dark-text">
                              {trail.title}
                            </h4>
                            <p className="text-sm text-light-muted dark:text-dark-muted">
                              {trail.modules?.length || 0} módulo(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModuleModal(trail.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Módulo
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openContentModal(null, undefined, trail.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Conteúdo direto
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBookUploadModal(trail.id)}
                            className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload Livro
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openTrailModal(trail)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal('trail', trail.id, trail.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
            </div>
          </div>

                      {/* Direct contents for this trail (no modules) */}
                      {trail.isExpanded && (trail as any).directContents && (trail as any).directContents.length > 0 && (
                        <div className="mt-4 ml-8 space-y-2">
                          <div className="text-sm text-light-muted dark:text-dark-muted">Conteúdos diretos</div>
                          {(trail as any).directContents.map((content: Content) => (
                            <div
                              key={content.id}
                              className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                  {content.title}
                                </p>
                                <p className="text-xs text-light-muted dark:text-dark-muted">
                                  {content.duration} min • {content.content_type} • {content.status}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openContentModal(null, content, trail.id)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteModal('content', content.id, content.title)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Modules List */}
                      {trail.isExpanded && trail.modules && trail.modules.length > 0 && (
                        <div className="mt-4 ml-8 space-y-3">
                          {trail.modules.map((module) => (
                            <Card key={module.id} className="p-3 bg-gray-50 dark:bg-gray-900">
                              {/* Module Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
              <button 
                                    onClick={() => toggleModuleExpand(module.id)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                                  >
                                    {module.isExpanded ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
              </button>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-light-text dark:text-dark-text">
                                      {module.title}
                                    </h5>
                                    <p className="text-xs text-light-muted dark:text-dark-muted">
                                      {module.contents?.length || 0} aula(s)
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openContentModal(module.id)}
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Aula
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openModuleModal(trail.id, module)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDeleteModal('module', module.id, module.title)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Contents List */}
                              {module.isExpanded && module.contents && module.contents.length > 0 && (
                                <div className="mt-3 ml-6 space-y-2">
                                  {module.contents.map((content) => (
                                    <div
                                      key={content.id}
                                      className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm"
                                    >
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                          {content.title}
                                        </p>
                                        <p className="text-xs text-light-muted dark:text-dark-muted">
                                          {content.duration} min • {content.content_type} • {content.status}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openContentModal(module.id, content)}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openDeleteModal('content', content.id, content.title)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Trail Modal */}
        <Modal open={showTrailModal} onClose={() => setShowTrailModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              {editingTrail ? 'Editar Trilha' : 'Nova Trilha'}
            </h3>
            <div className="space-y-3">
              <div>
                <Label>Título</Label>
                <Input
                  value={trailForm.title}
                  onChange={(e) => setTrailForm({ ...trailForm, title: e.target.value })}
                  placeholder="Nome da trilha"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <textarea
                  value={trailForm.description}
                  onChange={(e) => setTrailForm({ ...trailForm, description: e.target.value })}
                  placeholder="Descrição da trilha"
                  className="w-full px-3 py-2 rounded-lg border"
                  rows={3}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={trailForm.slug}
                  onChange={(e) => setTrailForm({ ...trailForm, slug: e.target.value })}
                  placeholder="slug-da-trilha"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowTrailModal(false)}>
                Cancelar
              </Button>
              <Button onClick={saveTrail} className="bg-orange-500 hover:bg-orange-600">
                Salvar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Module Modal */}
        <Modal open={showModuleModal} onClose={() => setShowModuleModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
            </h3>
            <div className="space-y-3">
              <div>
                <Label>Título</Label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Nome do módulo"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Descrição do módulo"
                  className="w-full px-3 py-2 rounded-lg border"
                  rows={3}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={moduleForm.slug}
                  onChange={(e) => setModuleForm({ ...moduleForm, slug: e.target.value })}
                  placeholder="slug-do-modulo"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Imagem de Capa</Label>
                  <span className="text-xs text-light-muted dark:text-dark-muted">
                    📐 Ideal: 700x768px (9:16)
                  </span>
                </div>
                
                {/* Botões para escolher tipo de input */}
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant={imageInputType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('url')}
                    className={imageInputType === 'url' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={imageInputType === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('upload')}
                    className={imageInputType === 'upload' ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90' : ''}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                {/* Input de URL */}
                {imageInputType === 'url' && (
                  <div>
                    <Input
                      value={moduleForm.image_url}
                      onChange={(e) => setModuleForm({ ...moduleForm, image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                      Cole a URL da imagem externa (recomendado: 700x768px, proporção 9:16)
                    </p>
                  </div>
                )}

                {/* Input de Upload */}
                {imageInputType === 'upload' && (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 focus:outline-none p-2"
                    />
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                      {uploadingImage ? 'Enviando...' : 'JPG, PNG, WebP ou GIF (max 5MB) • Ideal: 700x768px (9:16)'}
                    </p>
                  </div>
                )}

                {/* Preview da imagem */}
                {moduleForm.image_url && (
                  <div className="mt-3">
                    <img 
                      src={moduleForm.image_url} 
                      alt="Preview da capa" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModuleModal(false)}>
                Cancelar
              </Button>
              <Button onClick={saveModule} className="bg-orange-500 hover:bg-orange-600">
                Salvar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Content Modal */}
        <Modal open={showContentModal} onClose={() => setShowContentModal(false)}>
          <div className="p-8 max-w-5xl w-full mx-auto">
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
              {editingContent ? 'Editar Aula' : 'Nova Aula'}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primeira coluna - Informações básicas */}
              <div className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    placeholder="Nome da aula"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                    placeholder="Descrição da aula"
                    className="w-full px-3 py-2 rounded-lg border"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={contentForm.slug}
                    onChange={(e) => setContentForm({ ...contentForm, slug: e.target.value })}
                    placeholder="slug-da-aula"
                  />
                </div>
                <div>
                  <Label>Tipo de conteúdo</Label>
                  <select
                    value={contentForm.content_type}
                    onChange={(e) => setContentForm({ ...contentForm, content_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                  >
                    <option value="video">Vídeo</option>
                    <option value="file">Arquivo (PDF, etc.)</option>
                    <option value="text">Texto</option>
                  </select>
                </div>
              </div>

              {/* Segunda coluna - Configurações específicas */}
              <div className="space-y-4">
                <div>
                  <Label>URL do Vídeo (Vimeo)</Label>
                  <Input
                    value={contentForm.video_url}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://vimeo.com/..."
                  />
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                    A duração será preenchida automaticamente ao colar a URL do Vimeo
                  </p>
                </div>
                <div>
                  <Label>Capa (URL da imagem)</Label>
                  <Input
                    value={contentForm.image_url}
                    onChange={(e) => setContentForm({ ...contentForm, image_url: e.target.value })}
                    placeholder="https://exemplo.com/capa.jpg"
                  />
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                    Recomendado para livros (proporção 3:4). Você também pode usar o Storage bucket "book-covers".
                  </p>
                  {contentForm.image_url && (
                    <img src={contentForm.image_url} alt="Capa" className="mt-2 w-32 h-44 object-cover rounded" />
                  )}
                </div>
                <div>
                  <Label>Duração (minutos)</Label>
                  <Input
                    type="number"
                    value={contentForm.duration}
                    onChange={(e) => setContentForm({ ...contentForm, duration: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                    disabled={contentForm.video_url.includes('vimeo.com')}
                  />
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                    {contentForm.video_url.includes('vimeo.com') 
                      ? 'Duração carregada automaticamente do Vimeo' 
                      : 'Ou insira manualmente'}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={contentForm.status}
                    onChange={(e) => setContentForm({ ...contentForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Anexos: listar e enviar */}
            {editingContent && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-light-text dark:text-dark-text">
                    <Paperclip className="w-5 h-5" />
                    <span className="font-medium">Anexos</span>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input type="file" className="hidden" onChange={handleAssetUpload} disabled={assetUploading} />
                    <Button size="sm" variant="outline" disabled={assetUploading}>
                      <Upload className="w-4 h-4 mr-2" /> {assetUploading ? 'Enviando...' : 'Enviar anexo'}
                    </Button>
                  </label>
                </div>
                {assets.length === 0 ? (
                  <p className="text-sm text-light-muted dark:text-dark-muted text-center py-4">Nenhum anexo.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assets.map(a => (
                      <div key={a.id} className="flex items-center justify-between bg-light-surface dark:bg-dark-surface rounded-lg p-3 border">
                        <div className="flex items-center gap-3">
                          <FileDown className="w-4 h-4 text-gray-500" />
                          <a href={a.file_url} target="_blank" rel="noreferrer" className="text-sm text-brand-accent hover:underline font-medium">
                            {a.title || 'arquivo'}
                          </a>
                        </div>
                        <span className="text-xs text-light-muted dark:text-dark-muted">{a.file_type || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowContentModal(false)} className="px-6">
                Cancelar
              </Button>
              <Button onClick={saveContent} className="bg-orange-500 hover:bg-orange-600 px-6">
                {editingContent ? 'Atualizar' : 'Criar'} Aula
              </Button>
            </div>
          </div>
        </Modal>

        {/* Book Upload Modal */}
        <Modal open={bookUploadModal} onClose={() => setBookUploadModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload de Livro</h2>
            <div className="space-y-4">
              <div>
                <Label>Título do Livro</Label>
                <Input
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="Nome do livro"
                />
              </div>
              <div>
                <Label>Autor</Label>
                <Input
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  placeholder="Nome do autor"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="Descrição do livro"
                  className="w-full px-3 py-2 rounded-lg border"
                  rows={3}
                />
              </div>
              <div>
                <Label>Número de Páginas</Label>
                <Input
                  type="number"
                  value={bookForm.pages}
                  onChange={(e) => setBookForm({ ...bookForm, pages: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label>Arquivo PDF</Label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setBookForm({ ...bookForm, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 rounded-lg border"
                />
                {bookForm.file && (
                  <p className="text-sm text-green-600 mt-1">✓ Arquivo selecionado: {bookForm.file.name}</p>
                )}
              </div>
              <div>
                <Label>Capa do Livro (opcional)</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBookForm({ ...bookForm, cover: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 rounded-lg border"
                />
                {bookForm.cover && (
                  <p className="text-sm text-green-600 mt-1">✓ Capa selecionada: {bookForm.cover.name}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => setBookUploadModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={saveBook} 
                disabled={!bookForm.title || !bookForm.file}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Livro
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir "${deleteTarget?.title}"?`}
          variant="destructive"
          confirmText="Excluir"
          cancelText="Cancelar"
        >
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              {deleteTarget?.type === 'trail' && 'Esta ação excluirá permanentemente a trilha e todos os seus módulos e aulas.'}
              {deleteTarget?.type === 'module' && 'Esta ação excluirá permanentemente o módulo e todas as suas aulas.'}
              {deleteTarget?.type === 'content' && 'Esta ação excluirá permanentemente a aula.'}
            </p>
          </div>
        </ConfirmModal>
      </Section>
    </Container>
  );
}
