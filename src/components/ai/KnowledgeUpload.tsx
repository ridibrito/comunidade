// components/ai/KnowledgeUpload.tsx
"use client";

import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/ToastProvider';

interface UploadProgress {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  result?: any;
}

interface KnowledgeUploadProps {
  onUploadComplete?: (results: any[]) => void;
}

export function KnowledgeUpload({ onUploadComplete }: KnowledgeUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));

    setUploads(prev => [...prev, ...newUploads]);
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (upload: UploadProgress, index: number) => {
    try {
      // Atualizar status para uploading
      setUploads(prev => prev.map((u, i) => 
        i === index ? { ...u, status: 'uploading', progress: 0 } : u
      ));

      const formData = new FormData();
      formData.append('file', upload.file);
      formData.append('title', upload.file.name);
      formData.append('source', 'aldeia'); // Default para Aldeia
      formData.append('category', 'identificacao'); // Default para identificação
      formData.append('documentType', getFileType(upload.file.name));

      const response = await fetch('/api/ai/knowledge/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploads(prev => prev.map((u, i) => 
          i === index ? { 
            ...u, 
            status: 'success', 
            progress: 100, 
            result 
          } : u
        ));
        
        push({
          title: "Upload concluído",
          message: `${upload.file.name} foi processado com sucesso!`,
          variant: "success"
        });
      } else {
        throw new Error(result.error || 'Erro no upload');
      }
    } catch (error: any) {
      setUploads(prev => prev.map((u, i) => 
        i === index ? { 
          ...u, 
          status: 'error', 
          error: error.message 
        } : u
      ));
      
      push({
        title: "Erro no upload",
        message: `Falha ao processar ${upload.file.name}: ${error.message}`,
        variant: "error"
      });
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    const pendingUploads = uploads.filter(u => u.status === 'pending');
    
    try {
      await Promise.all(
        pendingUploads.map((upload, index) => {
          const originalIndex = uploads.findIndex(u => u === upload);
          return uploadFile(upload, originalIndex);
        })
      );

      const successfulUploads = uploads.filter(u => u.status === 'success');
      if (onUploadComplete && successfulUploads.length > 0) {
        onUploadComplete(successfulUploads.map(u => u.result));
      }

      push({
        title: "Uploads concluídos",
        message: `${successfulUploads.length} arquivo(s) processado(s) com sucesso!`,
        variant: "success"
      });
    } catch (error) {
      console.error('Erro nos uploads:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'docx';
      case 'txt': return 'txt';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video';
      case 'mp3':
      case 'wav': return 'audio';
      default: return 'txt';
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileText size={20} className="text-blue-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pendingCount = uploads.filter(u => u.status === 'pending').length;
  const successCount = uploads.filter(u => u.status === 'success').length;
  const errorCount = uploads.filter(u => u.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            Upload de Documentos
          </h2>
          <p className="text-light-muted dark:text-dark-muted">
            Adicione documentos à base de conhecimento da IA especializada em AHSD
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.mp4,.mp3,.wav"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload size={18} />
            Selecionar Arquivos
          </Button>
        </div>
      </div>

      {/* Stats */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              <div>
                <p className="text-sm text-light-muted dark:text-dark-muted">Total</p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {uploads.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Loader2 size={20} className="text-yellow-500" />
              <div>
                <p className="text-sm text-light-muted dark:text-dark-muted">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {pendingCount}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <div>
                <p className="text-sm text-light-muted dark:text-dark-muted">Sucesso</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {successCount}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              <div>
                <p className="text-sm text-light-muted dark:text-dark-muted">Erros</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {errorCount}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* File List */}
      {uploads.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Arquivos Selecionados
              </h3>
              {pendingCount > 0 && (
                <Button
                  onClick={uploadAllFiles}
                  disabled={isUploading}
                  className="bg-brand-accent text-white hover:bg-brand-accent/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" />
                      Processar Todos ({pendingCount})
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploads.map((upload, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-light-border dark:border-dark-border rounded-lg"
                >
                  {getFileIcon(upload.file.name)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-light-text dark:text-dark-text truncate">
                      {upload.file.name}
                    </p>
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                      {formatFileSize(upload.file.size)} • {getFileType(upload.file.name).toUpperCase()}
                    </p>
                    
                    {upload.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
                          <div 
                            className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {upload.status === 'error' && upload.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {upload.error}
                      </p>
                    )}
                    
                    {upload.status === 'success' && upload.result && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {upload.result.chunksCreated} chunks criados
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {upload.status === 'pending' && (
                      <Button
                        onClick={() => uploadFile(upload, index)}
                        size="sm"
                        className="bg-brand-accent text-white hover:bg-brand-accent/90"
                      >
                        <Upload size={16} />
                      </Button>
                    )}
                    
                    {upload.status === 'uploading' && (
                      <Loader2 size={20} className="animate-spin text-brand-accent" />
                    )}
                    
                    {upload.status === 'success' && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    
                    {upload.status === 'error' && (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                    
                    <Button
                      onClick={() => removeUpload(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Instruções de Upload
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>• <strong>Formatos suportados:</strong> PDF, DOC, DOCX, TXT, MP4, MP3, WAV</li>
          <li>• <strong>Tamanho máximo:</strong> 50MB por arquivo</li>
          <li>• <strong>Processamento:</strong> Arquivos são divididos em chunks para melhor busca</li>
          <li>• <strong>Fontes:</strong> Aldeia Singular, Angela Virgolim, Instituto Virgolim</li>
          <li>• <strong>Categorias:</strong> Identificação, Educação, Família, Desenvolvimento, etc.</li>
        </ul>
      </Card>
    </div>
  );
}
