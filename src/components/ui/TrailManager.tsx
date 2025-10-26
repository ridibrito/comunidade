"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import VideoUpload from "@/components/ui/VideoUpload";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  BookOpen,
  Play,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Upload,
  Minimize2,
  Search,
  Filter,
  Calendar,
  Users,
  Clock,
  FileText
} from "lucide-react";

// Tipos
export interface Lesson {
  id: string;
  title: string;
  status: "published" | "draft" | "archived";
  duration?: string;
  videoUrl?: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  isExpanded: boolean;
}

export interface Trail {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
  order: number;
  isExpanded: boolean;
  type: "montanha" | "acervo" | "rodas" | "plantao";
}

interface TrailManagerProps {
  trails: Trail[];
  onUpdateTrails: (trails: Trail[]) => void;
}

// Componente Sortable para Trilhas
function SortableTrailItem({ trail, onToggleExpand, onEdit, onDelete, onAddModule }: {
  trail: Trail;
  onToggleExpand: (id: string) => void;
  onEdit: (trail: Trail) => void;
  onDelete: (id: string) => void;
  onAddModule: (trailId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: trail.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-sm">
        {/* Header da Trilha */}
        <div className="flex items-center gap-3 p-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          
          <button
            onClick={() => onToggleExpand(trail.id)}
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          >
            {trail.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="flex-1">
            <h3 className="font-semibold text-light-text dark:text-dark-text">{trail.title}</h3>
            {trail.description && (
              <p className="text-sm text-light-muted dark:text-dark-muted mt-1">{trail.description}</p>
            )}
          </div>

          <Badge variant="info" size="sm">
            {trail.modules.length} módulos
          </Badge>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddModule(trail.id)}
              className="text-brand-accent hover:bg-brand-accent/10"
            >
              <Plus className="w-4 h-4" />
              Módulo
            </Button>
            
            <div className="relative group">
              <Button variant="ghost" size="sm" className="text-light-muted dark:text-dark-muted">
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onEdit(trail)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text"
                >
                  <Edit className="w-4 h-4" />
                  Editar trilha
                </button>
                <button
                  onClick={() => onDelete(trail.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir trilha
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos (quando expandido) */}
        {trail.isExpanded && (
          <div className="border-t border-light-border dark:border-dark-border">
            <SortableContext items={trail.modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
              {trail.modules.map((module) => (
                <SortableModuleItem
                  key={module.id}
                  module={module}
                  trailId={trail.id}
                  onToggleExpand={(moduleId) => {
                    // Implementar toggle de módulo
                  }}
                  onEdit={(module) => {
                    // Implementar edição de módulo
                  }}
                  onDelete={(moduleId) => {
                    // Implementar exclusão de módulo
                  }}
                  onAddLesson={(moduleId) => {
                    // Implementar adição de aula
                  }}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Sortable para Módulos
function SortableModuleItem({ module, trailId, onToggleExpand, onEdit, onDelete, onAddLesson }: {
  module: Module;
  trailId: string;
  onToggleExpand: (id: string) => void;
  onEdit: (module: Module) => void;
  onDelete: (id: string) => void;
  onAddLesson: (moduleId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border-b border-light-border dark:border-dark-border last:border-b-0">
      <div className="flex items-center gap-3 p-4 bg-light-bg/50 dark:bg-dark-bg/50">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <button
          onClick={() => onToggleExpand(module.id)}
          className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
        >
          {module.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <Square className="w-4 h-4 text-light-muted dark:text-dark-muted" />

        <div className="flex-1">
          <h4 className="font-medium text-light-text dark:text-dark-text">{module.title}</h4>
          {module.description && (
            <p className="text-sm text-light-muted dark:text-dark-muted mt-1">{module.description}</p>
          )}
        </div>

        <Badge variant="info" size="sm">
          {module.lessons.length} conteúdo
        </Badge>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddLesson(module.id)}
            className="text-brand-accent hover:bg-brand-accent/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <div className="relative group">
            <Button variant="ghost" size="sm" className="text-light-muted dark:text-dark-muted">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => onEdit(module)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text"
              >
                <Edit className="w-4 h-4" />
                Editar módulo
              </button>
              <button
                onClick={() => onDelete(module.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                Excluir módulo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aulas (quando expandido) */}
      {module.isExpanded && (
        <div className="bg-light-bg/30 dark:bg-dark-bg/30">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 p-4 border-b border-light-border dark:border-dark-border last:border-b-0">
              <GripVertical className="w-4 h-4 text-light-muted dark:text-dark-muted" />
              
              <button className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text">
                <ChevronRight className="w-4 h-4" />
              </button>

              <Square className="w-4 h-4 text-light-muted dark:text-dark-muted" />

              <div className="flex-1">
                <h5 className="text-sm font-medium text-light-text dark:text-dark-text">{lesson.title}</h5>
                {lesson.duration && (
                  <p className="text-xs text-light-muted dark:text-dark-muted">{lesson.duration}</p>
                )}
              </div>

              <Badge 
                variant={lesson.status === "published" ? "success" : lesson.status === "draft" ? "warning" : "default"} 
                size="sm"
              >
                {lesson.status === "published" ? "Publicado" : lesson.status === "draft" ? "Rascunho" : "Arquivado"}
              </Badge>

              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-light-muted dark:text-dark-muted">
                  <MoreVertical className="w-4 h-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text">
                    <Edit className="w-4 h-4" />
                    Editar aula
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-red-600 dark:text-red-400">
                    <Trash2 className="w-4 h-4" />
                    Excluir aula
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente principal
export default function TrailManager({ trails, onUpdateTrails }: TrailManagerProps) {
  const [isClient, setIsClient] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);
  const [selectedLessonForUpload, setSelectedLessonForUpload] = useState<{id: string, title: string} | null>(null);

  // Garantir que o componente só renderize no cliente para evitar erros de hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = trails.findIndex((trail) => trail.id === active.id);
      const newIndex = trails.findIndex((trail) => trail.id === over?.id);

      const newTrails = arrayMove(trails, oldIndex, newIndex);
      onUpdateTrails(newTrails);
    }
  };

  const handleToggleExpand = (trailId: string) => {
    const updatedTrails = trails.map(trail =>
      trail.id === trailId ? { ...trail, isExpanded: !trail.isExpanded } : trail
    );
    onUpdateTrails(updatedTrails);
  };

  const handleAddTrail = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTrail = (trail: Trail) => {
    setEditingTrail(trail);
  };

  const handleDeleteTrail = (trailId: string) => {
    const updatedTrails = trails.filter(trail => trail.id !== trailId);
    onUpdateTrails(updatedTrails);
  };

  const handleAddModule = (trailId: string) => {
    // Implementar adição de módulo
    console.log("Adicionar módulo à trilha:", trailId);
  };

  const handleVideoUpload = (lessonId: string, lessonTitle: string) => {
    setSelectedLessonForUpload({ id: lessonId, title: lessonTitle });
    setIsVideoUploadOpen(true);
  };

  const handleVideoUploadComplete = (file: File, metadata: any) => {
    console.log("Vídeo enviado:", file.name, metadata);
    setIsVideoUploadOpen(false);
    setSelectedLessonForUpload(null);
    // Aqui você implementaria a lógica para salvar o vídeo e atualizar a aula
  };

  // Filtros e busca
  const filteredTrails = trails.filter(trail => {
    const matchesSearch = searchTerm === "" || 
      trail.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.modules.some(module => 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.lessons.some(lesson => 
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    const matchesType = typeFilter === "all" || trail.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Estatísticas
  const stats = {
    totalTrails: trails.length,
    totalModules: trails.reduce((acc, trail) => acc + trail.modules.length, 0),
    totalLessons: trails.reduce((acc, trail) => 
      acc + trail.modules.reduce((moduleAcc, module) => moduleAcc + (module.contents?.length || 0), 0), 0),
    publishedLessons: trails.reduce((acc, trail) => 
      acc + trail.modules.reduce((moduleAcc, module) => 
        moduleAcc + (module.contents?.filter(content => content.status === "published").length || 0), 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{stats.totalTrails}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Trilhas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{stats.totalModules}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Módulos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{stats.totalLessons}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Aulas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{stats.publishedLessons}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Publicadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Buscar trilhas, módulos ou aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          
          {/* Filtro de tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
          >
            <option value="all">Todos os tipos</option>
            <option value="montanha">Montanha</option>
            <option value="acervo">Acervo</option>
            <option value="rodas">Rodas</option>
            <option value="plantao">Plantão</option>
          </select>
        </div>
        
        {/* Ações */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-light-muted dark:text-dark-muted">
            <MoreVertical className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsVideoUploadOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Upload de vídeos
          </Button>
          
          <Button variant="ghost" size="sm" className="text-light-muted dark:text-dark-muted">
            <Minimize2 className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={handleAddTrail}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Lista de Trilhas */}
      {isClient ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredTrails.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {filteredTrails.map((trail) => (
              <SortableTrailItem
                key={trail.id}
                trail={trail}
                onToggleExpand={handleToggleExpand}
                onEdit={handleEditTrail}
                onDelete={handleDeleteTrail}
                onAddModule={handleAddModule}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-4">
          {filteredTrails.map((trail) => (
            <div key={trail.id} className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-light-muted dark:text-dark-muted">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-light-text dark:text-dark-text">{trail.title}</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">{trail.description}</p>
                </div>
                <Badge variant="default" size="sm">
                  {trail.modules.length} módulos
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para adicionar trilha */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          Adicionar Nova Trilha
        </div>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text">Título da Trilha</label>
            <input 
              className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
              placeholder="Ex: Facebook e Instagram Ads"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text">Tipo de Trilha</label>
            <select className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20">
              <option value="montanha">Montanha do Amanhã</option>
              <option value="acervo">Acervo Digital</option>
              <option value="rodas">Rodas de Conversa</option>
              <option value="plantao">Plantão de Dúvidas</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-light-text dark:text-dark-text">Descrição</label>
            <textarea 
              className="mt-1 w-full h-20 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 py-2 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
              placeholder="Descrição da trilha..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-brand-accent hover:bg-brand-accent/90 text-white"
              onClick={() => setIsAddModalOpen(false)}
            >
              Criar Trilha
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Upload de Vídeo */}
      <VideoUpload
        isOpen={isVideoUploadOpen}
        onClose={() => {
          setIsVideoUploadOpen(false);
          setSelectedLessonForUpload(null);
        }}
        onUpload={handleVideoUploadComplete}
        lessonId={selectedLessonForUpload?.id}
        lessonTitle={selectedLessonForUpload?.title}
      />
    </div>
  );
}

// Interface para o tipo Trail
export interface Trail {
  id: string;
  title: string;
  description?: string;
  type: string;
  order: number;
  isExpanded: boolean;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  trail_id?: string;
  position?: number;
  contents?: Content[];
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  module_id: string;
  content_type: string;
  duration: number;
  status: string;
  position: number;
}
