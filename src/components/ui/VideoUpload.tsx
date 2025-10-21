"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { 
  Upload, 
  FileVideo, 
  X, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata: VideoMetadata) => void;
  lessonId?: string;
  lessonTitle?: string;
}

interface VideoMetadata {
  title: string;
  description: string;
  duration: string;
  thumbnail?: string;
  tags: string[];
}

export default function VideoUpload({ isOpen, onClose, onUpload, lessonId, lessonTitle }: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: lessonTitle || '',
    description: '',
    duration: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('video/')) {
      setUploadedFile(file);
      setUploadStatus('idle');
      
      // Simular obtenção de duração do vídeo
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setMetadata(prev => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
        }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simular upload progressivo
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('processing');
          
          // Simular processamento
          setTimeout(() => {
            setUploadStatus('completed');
            onUpload(uploadedFile, metadata);
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simular erro ocasional
    if (Math.random() < 0.1) {
      setTimeout(() => {
        clearInterval(interval);
        setUploadStatus('error');
      }, 1000);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setMetadata({
      title: lessonTitle || '',
      description: '',
      duration: '',
      tags: []
    });
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />;
      default:
        return <FileVideo className="w-5 h-5 text-light-muted dark:text-dark-muted" />;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
            Upload de Vídeo
          </h2>
          <button
            onClick={onClose}
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Área de Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-brand-accent bg-brand-accent/5' 
                : 'border-light-border dark:border-dark-border hover:border-brand-accent/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <div>
                <Upload className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-4" />
                <p className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                  Arraste seu vídeo aqui ou clique para selecionar
                </p>
                <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
                  Formatos suportados: MP4, MOV, AVI, WMV (máx. 2GB)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white border-brand-accent"
                >
                  Selecionar Arquivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <p className="font-medium text-light-text dark:text-dark-text">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="w-full">
                    <div className="flex justify-between text-sm text-light-muted dark:text-dark-muted mb-1">
                      <span>Enviando...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
                      <div 
                        className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadStatus === 'processing' && (
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                      Processando vídeo...
                    </p>
                  </div>
                )}

                {uploadStatus === 'completed' && (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Vídeo enviado com sucesso!
                    </p>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Erro no upload. Tente novamente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadados do Vídeo */}
          {uploadedFile && uploadStatus === 'idle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Título do Vídeo
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  placeholder="Digite o título do vídeo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Descrição
                </label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  rows={3}
                  placeholder="Descrição do conteúdo do vídeo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag, index) => (
                    <Badge key={index} variant="info" size="sm" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {metadata.duration && (
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Duração
                  </label>
                  <div className="flex items-center gap-2 text-light-muted dark:text-dark-muted">
                    <Play className="w-4 h-4" />
                    <span>{metadata.duration}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            {uploadedFile && uploadStatus === 'idle' && (
              <>
                <Button variant="outline" onClick={resetUpload}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
                <Button 
                  onClick={handleUpload}
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Vídeo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
