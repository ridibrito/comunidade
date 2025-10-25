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
  stats: any[];
  cta_buttons: any[];
  visual_elements: any[];
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

  // Form states
  const [formData, setFormData] = useState({
    page_slug: "montanha-do-amanha",
    title: "MONTANHA DO AMANHÃ",
    subtitle: "",
    description: "",
    background_gradient: "from-purple-900 via-purple-700 to-orange-500",
    hero_image_url: ""
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
      const heroData = {
        ...formData,
        stats: [
          { label: "6 Módulos Fundamentais", icon: "green", value: "6" },
          { label: "Certificação Profissional", icon: "blue", value: "Cert" },
          { label: "Suporte Especializado", icon: "purple", value: "24/7" }
        ],
        cta_buttons: [
          { text: "Começar Jornada", variant: "primary", action: "start" },
          { text: "Ver Módulos", variant: "secondary", action: "view" }
        ],
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
    setFormData({
      page_slug: hero.page_slug,
      title: hero.title,
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      background_gradient: hero.background_gradient,
      hero_image_url: hero.hero_image_url || ""
    });
    setShowModal(true);
    console.log("Modal aberto:", true);
  }

  function resetForm() {
    setFormData({
      page_slug: "",
      title: "",
      subtitle: "",
      description: "",
      background_gradient: "from-purple-900 via-purple-700 to-orange-500",
      hero_image_url: ""
    });
  }

  function openCreateModal() {
    resetForm();
    setEditingHero(null);
    setShowModal(true);
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
                Páginas Hero Configuradas
              </h2>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Gerencie as seções hero das páginas do catálogo
              </p>
            </div>
            <Button onClick={openCreateModal} className="bg-brand-accent text-white hover:bg-brand-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Página Hero
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
                Upload da Imagem Hero
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Selecione uma imagem para a seção hero da página Montanha do Amanhã
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
      </Section>
    </Container>
  );
}
