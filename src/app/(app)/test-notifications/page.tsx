"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Trash2, 
  Save, 
  Download,
  Upload,
  Settings,
  User,
  Shield,
  Lock
} from "lucide-react";

// Componente de Modal de Confirmação inspirado no shadcn-ui
interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: "default" | "destructive" | "warning" | "success";
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  variant = "default",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon
}: ConfirmationModalProps) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          iconBg: "bg-red-100 dark:bg-red-900/20",
          iconColor: "text-red-600 dark:text-red-400",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200 dark:border-red-800"
        };
      case "warning":
        return {
          iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          border: "border-yellow-200 dark:border-yellow-800"
        };
      case "success":
        return {
          iconBg: "bg-green-100 dark:bg-green-900/20",
          iconColor: "text-green-600 dark:text-green-400",
          confirmButton: "bg-green-600 hover:bg-green-700 text-white",
          border: "border-green-200 dark:border-green-800"
        };
      default:
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200 dark:border-blue-800"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4">
        <Card className={`p-0 overflow-hidden ${styles.border}`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-2 rounded-full ${styles.iconBg}`}>
                <div className={`w-6 h-6 ${styles.iconColor}`}>
                  {icon || (
                    variant === "destructive" ? <AlertTriangle className="w-6 h-6" /> :
                    variant === "warning" ? <AlertTriangle className="w-6 h-6" /> :
                    variant === "success" ? <CheckCircle className="w-6 h-6" /> :
                    <Info className="w-6 h-6" />
                  )}
        </div>
      </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">
                  {description}
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${styles.confirmButton}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
      </Card>
      </div>
          </div>
  );
}

export default function TestNotificationsPage() {
  const [modals, setModals] = useState({
    delete: false,
    cancel: false,
    warning: false,
    safe: false,
    success: false,
    discard: false,
    download: false,
    preview: false,
    upload: false,
    cancelUpload: false,
    settings: false,
    reset: false
  });

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  const handleConfirm = (modal: keyof typeof modals) => {
    console.log(`Confirmado: ${modal}`);
    closeModal(modal);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Teste de Modais de Confirmação
        </h1>
          <p className="text-light-muted dark:text-dark-muted">
            Teste diferentes tipos de modais de confirmação com temas light e dark
          </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Modal Destrutivo */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Excluir</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Ação destrutiva</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('delete')}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir Item
            </Button>
          </Card>

          {/* Modal de Aviso */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Aviso</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Ação com riscos</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('warning')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Continuar Mesmo Assim
            </Button>
      </Card>

          {/* Modal de Sucesso */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Salvar</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Confirmação positiva</p>
              </div>
          </div>
            <Button 
              onClick={() => openModal('success')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Salvar Alterações
            </Button>
        </Card>

          {/* Modal de Download */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Download</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Baixar arquivo</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('download')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Baixar Arquivo
            </Button>
          </Card>

          {/* Modal de Upload */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Upload</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Enviar arquivo</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('upload')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enviar Arquivo
            </Button>
        </Card>

          {/* Modal de Configurações */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-light-text dark:text-dark-text">Configurações</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Alterar configurações</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('settings')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              Aplicar Configurações
            </Button>
        </Card>
        </div>

        {/* Modais */}
        <ConfirmationModal
          open={modals.delete}
          onClose={() => closeModal('delete')}
          onConfirm={() => handleConfirm('delete')}
          title="Excluir Item"
          description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita e todos os dados relacionados serão permanentemente removidos."
          variant="destructive"
          confirmText="Excluir"
          cancelText="Cancelar"
          icon={<Trash2 className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.cancel}
          onClose={() => closeModal('cancel')}
          onConfirm={() => handleConfirm('cancel')}
          title="Cancelar Ação"
          description="Deseja realmente cancelar esta ação? Todas as alterações não salvas serão perdidas."
          variant="default"
          confirmText="Sim, Cancelar"
          cancelText="Continuar"
          icon={<X className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.warning}
          onClose={() => closeModal('warning')}
          onConfirm={() => handleConfirm('warning')}
          title="Ação Perigosa"
          description="Esta ação pode ter consequências irreversíveis. Certifique-se de que você entende os riscos antes de continuar."
          variant="warning"
          confirmText="Continuar Mesmo Assim"
          cancelText="Voltar"
          icon={<AlertTriangle className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.safe}
          onClose={() => closeModal('safe')}
          onConfirm={() => handleConfirm('safe')}
          title="Fazer de Forma Segura"
          description="Esta é a opção mais segura. O sistema irá criar um backup antes de prosseguir com a ação."
          variant="success"
          confirmText="Fazer Seguro"
          cancelText="Cancelar"
          icon={<Shield className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.success}
          onClose={() => closeModal('success')}
          onConfirm={() => handleConfirm('success')}
          title="Salvar Alterações"
          description="Tem certeza que deseja salvar todas as alterações? As modificações serão aplicadas imediatamente."
          variant="success"
          confirmText="Salvar"
          cancelText="Cancelar"
          icon={<Save className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.discard}
          onClose={() => closeModal('discard')}
          onConfirm={() => handleConfirm('discard')}
          title="Descartar Alterações"
          description="Tem certeza que deseja descartar todas as alterações? Esta ação não pode ser desfeita."
          variant="destructive"
          confirmText="Descartar"
          cancelText="Manter"
          icon={<Trash2 className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.download}
          onClose={() => closeModal('download')}
          onConfirm={() => handleConfirm('download')}
          title="Baixar Arquivo"
          description="O arquivo será baixado para seu dispositivo. Certifique-se de que você tem espaço suficiente em disco."
          variant="default"
          confirmText="Baixar"
          cancelText="Cancelar"
          icon={<Download className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.preview}
          onClose={() => closeModal('preview')}
          onConfirm={() => handleConfirm('preview')}
          title="Visualizar Arquivo"
          description="O arquivo será aberto em uma nova aba para visualização. Você pode baixá-lo depois se desejar."
          variant="default"
          confirmText="Visualizar"
          cancelText="Cancelar"
          icon={<Info className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.upload}
          onClose={() => closeModal('upload')}
          onConfirm={() => handleConfirm('upload')}
          title="Enviar Arquivo"
          description="O arquivo será enviado para o servidor. Certifique-se de que o arquivo não contém informações sensíveis."
          variant="default"
          confirmText="Enviar"
          cancelText="Cancelar"
          icon={<Upload className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.cancelUpload}
          onClose={() => closeModal('cancelUpload')}
          onConfirm={() => handleConfirm('cancelUpload')}
          title="Cancelar Upload"
          description="Deseja realmente cancelar o upload? O arquivo não será enviado para o servidor."
          variant="destructive"
          confirmText="Cancelar Upload"
          cancelText="Continuar"
          icon={<X className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.settings}
          onClose={() => closeModal('settings')}
          onConfirm={() => handleConfirm('settings')}
          title="Aplicar Configurações"
          description="As alterações nas configurações serão aplicadas imediatamente. Algumas mudanças podem requerer reinicialização."
          variant="default"
          confirmText="Aplicar"
          cancelText="Cancelar"
          icon={<Settings className="w-6 h-6" />}
        />

        <ConfirmationModal
          open={modals.reset}
          onClose={() => closeModal('reset')}
          onConfirm={() => handleConfirm('reset')}
          title="Restaurar Configurações Padrão"
          description="Todas as configurações serão restauradas para os valores padrão. Esta ação não pode ser desfeita."
          variant="destructive"
          confirmText="Restaurar"
          cancelText="Cancelar"
          icon={<Settings className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}