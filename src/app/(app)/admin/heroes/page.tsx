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
import { ImageIcon, Upload, Save, Edit, Trash2, Eye, Plus } from "lucide-react";

interface HeroData {
  id: string;
  page_slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  hero_image_url?: string;
  background_gradient: string;
  stats?: any[];
  cta_buttons?: Array<{
    text: string;
    link?: string;
    variant?: string;
  }>;
  visual_elements?: any[];
  is_active: boolean;
}

export default function AdminHeroesPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [heroToDelete, setHeroToDelete] = useState<HeroData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    page_slug: "dashboard",
    title: "",
    subtitle: "",
    description: "",
    background_gradient: "from-purple-900 via-purple-700 to-orange-500",
    hero_image_url: "",
    cta_button: {
      text: "",
      link: "",
      color: "brand-accent"
    },
    title_position: "center",
    subtitle_position: "center"
  });

  useEffect(() => {
    loadHeroes();
  }, []);

  async function loadHeroes() {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from("page_heroes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHeroes(data || []);
    } catch (error) {
      console.error("Erro ao carregar heroes:", error);
      push({ title: "Erro", message: "Falha ao carregar dados", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploading(true);
    try {
      console.log("Iniciando upload do arquivo:", file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `heroes/${fileName}`;

      console.log("Fazendo upload para:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('heroes')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw uploadError;
      }

      console.log("Upload concluído, obtendo URL pública...");

      const { data } = supabase.storage
        .from('heroes')
        .getPublicUrl(filePath);

      console.log("URL pública obtida:", data.publicUrl);

      setFormData(prev => ({ ...prev, hero_image_url: data.publicUrl }));
      push({ title: "Upload realizado", message: "Imagem carregada com sucesso!" });
    } catch (error) {
      console.error("Erro no upload:", error);
      push({ 
        title: "Erro no upload", 
        message: error instanceof Error ? error.message : "Falha ao fazer upload da imagem", 
        variant: "error" 
      });
    } finally {
      setUploading(false);
    }
  }

  async function saveHero() {
    if (!supabase) return;

    try {
      // Usar o page_slug selecionado
      const pageSlug = formData.page_slug || "dashboard";

      // Se houver um cta_button configurado, adicione ao array de cta_buttons
      const ctaButtonsArray = [];
      if (formData.cta_button?.text && formData.cta_button?.link) {
        ctaButtonsArray.push({
          text: formData.cta_button.text,
          link: formData.cta_button.link,
          color: formData.cta_button.color || "brand-accent",
          variant: "primary"
        });
      }

      const heroData = {
        page_slug: pageSlug,
        title: formData.title || "",
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        background_gradient: formData.background_gradient,
        hero_image_url: formData.hero_image_url || null,
        title_position: formData.title_position,
        subtitle_position: formData.subtitle_position,
        stats: [
          { label: "6 Módulos Fundamentais", icon: "green", value: "6" },
          { label: "Certificação Profissional", icon: "blue", value: "Cert" },
          { label: "Suporte Especializado", icon: "purple", value: "24/7" }
        ],
        cta_buttons: ctaButtonsArray.length > 0 ? ctaButtonsArray : [],
        visual_elements: [
          { type: "block", color: "yellow-orange", position: "top-right", size: "large" },
          { type: "block", color: "pink-purple", position: "bottom-left", size: "medium" },
          { type: "block", color: "blue-purple", position: "center-right", size: "small" }
        ]
      };

      if (editingHero) {
        const { error } = await supabase
          .from("page_heroes")
          .update(heroData)
          .eq("id", editingHero.id);

        if (error) throw error;
        push({ title: "Hero atualizado", message: "Dados salvos com sucesso!" });
      } else {
        const { error } = await supabase
          .from("page_heroes")
          .insert(heroData);

        if (error) throw error;
        push({ title: "Hero criado", message: "Nova página hero criada!" });
      }

      setShowModal(false);
      setEditingHero(null);
      resetForm();
      loadHeroes();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      push({ title: "Erro", message: "Falha ao salvar dados", variant: "error" });
    }
  }

  function editHero(hero: HeroData) {
    console.log("Editando hero:", hero);
    setEditingHero(hero);
    
    // Extrair o primeiro botão do array cta_buttons
    const firstButton = hero.cta_buttons && hero.cta_buttons.length > 0 
      ? { 
          text: hero.cta_buttons[0].text || "", 
          link: hero.cta_buttons[0].link || "",
          color: (hero.cta_buttons[0] as any).color || "brand-accent"
        }
      : { text: "", link: "", color: "brand-accent" };
    
    setFormData({
      page_slug: hero.page_slug,
      title: hero.title,
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      background_gradient: hero.background_gradient,
      hero_image_url: hero.hero_image_url || "",
      cta_button: firstButton,
      title_position: (hero as any).title_position || "center",
      subtitle_position: (hero as any).subtitle_position || "center"
    });
    setShowModal(true);
    console.log("Modal aberto:", true);
  }

  function resetForm() {
    setFormData({
      page_slug: "dashboard",
      title: "",
      subtitle: "",
      description: "",
      background_gradient: "from-purple-900 via-purple-700 to-orange-500",
      hero_image_url: "",
      cta_button: {
        text: "",
        link: "",
        color: "brand-accent"
      },
      title_position: "center",
      subtitle_position: "center"
    });
  }

  function openCreateModal() {
    resetForm();
    setEditingHero(null);
    setShowModal(true);
  }

  function openDeleteModal(hero: HeroData) {
    setHeroToDelete(hero);
    setShowDeleteModal(true);
  }

  async function deleteHero() {
    if (!supabase || !heroToDelete) return;

    try {
      const { error } = await supabase
        .from("page_heroes")
        .delete()
        .eq("id", heroToDelete.id);

      if (error) throw error;

      push({ title: "Hero excluído", message: "Hero removido com sucesso!" });
      setShowDeleteModal(false);
      setHeroToDelete(null);
      loadHeroes();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      push({ title: "Erro", message: "Falha ao excluir hero", variant: "error" });
    }
  }

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Gerenciar Heroes" 
          subtitle="Configure as imagens e conteúdo das seções hero das páginas" 
        />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Hero Carrossel do Dashboard
              </h2>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Gerencie as imagens do carrossel hero na página inicial
              </p>
            </div>
            <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem ao Carrossel
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-light-muted dark:text-dark-muted">Carregando...</p>
              </div>
            ) : heroes.length === 0 ? (
              <Card className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" />
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Nenhuma página hero configurada
                </h3>
                <p className="text-light-muted dark:text-dark-muted mb-4">
                  Comece criando uma nova página hero para suas seções principais
                </p>
                <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
                  Criar Primeira Página Hero
                </Button>
              </Card>
            ) : (
              heroes.map((hero) => (
                <Card key={hero.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-light-border dark:bg-dark-border">
                        {hero.hero_image_url ? (
                          <img 
                            src={hero.hero_image_url} 
                            alt={hero.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-light-muted dark:text-dark-muted" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-light-text dark:text-dark-text">
                          {hero.title}
                        </h3>
                        <p className="text-sm text-light-muted dark:text-dark-muted">
                          Slug: {hero.page_slug}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${hero.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-light-muted dark:text-dark-muted">
                            {hero.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => editHero(hero)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/catalog/${hero.page_slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteModal(hero)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
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

        {/* Modal para upload da imagem */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Adicionar Imagem ao Carrossel
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Selecione uma imagem para o hero carrossel do dashboard
              </p>
            </div>

            <div>
              <Label htmlFor="hero_image">Imagem Hero</Label>
              <div className="space-y-3">
                <input
                  type="file"
                  id="hero_image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="hero_image"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:border-brand-accent/50 transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-light-muted dark:text-dark-muted">Fazendo upload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-light-muted dark:text-dark-muted" />
                      <span className="text-sm text-light-muted dark:text-dark-muted">
                        {formData.hero_image_url ? 'Trocar imagem' : 'Selecionar imagem'}
                      </span>
                    </>
                  )}
                </label>
                {formData.hero_image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.hero_image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-light-border dark:border-dark-border"
                    />
                  </div>
                )}
              </div>
            </div>

                         <div>
               <Label htmlFor="page_slug">Página</Label>
               <select
                 id="page_slug"
                 value={formData.page_slug}
                 onChange={(e) => setFormData(prev => ({ ...prev, page_slug: e.target.value }))}
                 className="w-full h-10 rounded-lg bg-light-surface dark:bg-dark-surface px-3 py-2 text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50"
               >
                 <option value="dashboard">Dashboard</option>
                 <option value="montanha-do-amanha">Montanha do Amanhã</option>
                 <option value="acervo-digital">Acervo Digital</option>
                 <option value="rodas-de-conversa">Rodas de Conversa</option>
                 <option value="plantao-de-duvidas">Plantão de Dúvidas</option>
               </select>
             </div>

             <div>
               <Label htmlFor="hero_title">Título (opcional)</Label>
               <Input
                 id="hero_title"
                 value={formData.title}
                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                 placeholder="Ex: Promoção de Verão"
               />
             </div>

            <div>
              <Label htmlFor="hero_subtitle">Subtítulo (opcional)</Label>
              <Input
                id="hero_subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ex: Até 50% off em produtos selecionados"
              />
            </div>

            <div>
              <Label htmlFor="cta_text">Texto do Botão (opcional)</Label>
              <Input
                id="cta_text"
                value={formData.cta_button?.text || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_button: { ...prev.cta_button, text: e.target.value } }))}
                placeholder="Ex: Saiba Mais"
              />
            </div>

            <div>
              <Label htmlFor="cta_link">Link do Botão (opcional)</Label>
              <Input
                id="cta_link"
                value={formData.cta_button?.link || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_button: { ...prev.cta_button, link: e.target.value } }))}
                placeholder="Ex: /promocoes ou https://site.com"
              />
            </div>

            <div>
              <Label htmlFor="cta_color">Cor do Botão</Label>
              <select
                id="cta_color"
                value={formData.cta_button?.color || "brand-accent"}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_button: { ...prev.cta_button, color: e.target.value } }))}
                className="w-full h-10 rounded-lg bg-light-surface dark:bg-dark-surface px-3 py-2 text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50"
              >
                <option value="bg-blue-600">Azul</option>
                <option value="bg-green-600">Verde</option>
                <option value="bg-red-600">Vermelho</option>
                <option value="bg-purple-600">Roxo</option>
                <option value="bg-orange-600">Laranja</option>
                <option value="bg-yellow-600">Amarelo</option>
                <option value="bg-pink-600">Rosa</option>
                <option value="brand-accent">Cor da Marca</option>
              </select>
            </div>

            <div>
              <Label htmlFor="title_position">Posição do Título</Label>
              <select
                id="title_position"
                value={formData.title_position}
                onChange={(e) => setFormData(prev => ({ ...prev, title_position: e.target.value }))}
                className="w-full h-10 rounded-lg bg-light-surface dark:bg-dark-surface px-3 py-2 text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>

            <div>
              <Label htmlFor="subtitle_position">Posição do Subtítulo</Label>
              <select
                id="subtitle_position"
                value={formData.subtitle_position}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle_position: e.target.value }))}
                className="w-full h-10 rounded-lg bg-light-surface dark:bg-dark-surface px-3 py-2 text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={saveHero}
                className="bg-brand-accent text-white hover:bg-brand-accent/90 flex-1"
                disabled={uploading}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Imagem
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
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Tem certeza que deseja excluir este hero do carrossel? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={deleteHero}
                className="bg-red-600 text-white hover:bg-red-700 flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
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
