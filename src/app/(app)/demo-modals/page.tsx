"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { Trash2, AlertTriangle, CheckCircle, Download, Upload, Settings } from "lucide-react";

export default function DemoModalsPage() {
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      variant: "destructive"
    });

    if (confirmed) {
      setLoading(true);
      // Simular operação
      setTimeout(() => {
        setLoading(false);
        alert("Item excluído com sucesso!");
      }, 1000);
    }
  };

  const handleWarning = async () => {
    const confirmed = await confirm({
      title: "Atenção",
      message: "Esta ação pode ter consequências indesejadas. Deseja continuar?",
      confirmText: "Continuar",
      cancelText: "Cancelar",
      variant: "warning"
    });

    if (confirmed) {
      alert("Ação executada!");
    }
  };

  const handleSuccess = async () => {
    const confirmed = await confirm({
      title: "Salvar Alterações",
      message: "Deseja salvar todas as alterações feitas?",
      confirmText: "Salvar",
      cancelText: "Cancelar",
      variant: "success"
    });

    if (confirmed) {
      alert("Alterações salvas!");
    }
  };

  const handleDownload = async () => {
    const confirmed = await confirm({
      title: "Download de Arquivo",
      message: "Deseja baixar este arquivo?",
      confirmText: "Baixar",
      cancelText: "Cancelar",
      variant: "default"
    });

    if (confirmed) {
      alert("Download iniciado!");
    }
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Demonstração de Modais" 
          subtitle="Exemplos de como usar os novos modais de confirmação" 
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Modal Destrutivo */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Excluir Item</h3>
                <p className="text-sm text-gray-600">Ação destrutiva</p>
              </div>
            </div>
            <Button 
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Excluindo..." : "Excluir Item"}
            </Button>
          </Card>

          {/* Modal de Aviso */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Aviso</h3>
                <p className="text-sm text-gray-600">Ação com riscos</p>
              </div>
            </div>
            <Button 
              onClick={handleWarning}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Continuar Mesmo Assim
            </Button>
          </Card>

          {/* Modal de Sucesso */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Salvar</h3>
                <p className="text-sm text-gray-600">Confirmação positiva</p>
              </div>
            </div>
            <Button 
              onClick={handleSuccess}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Salvar Alterações
            </Button>
          </Card>

          {/* Modal Padrão */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Download</h3>
                <p className="text-sm text-gray-600">Baixar arquivo</p>
              </div>
            </div>
            <Button 
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Baixar Arquivo
            </Button>
          </Card>

          {/* Modal de Upload */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload</h3>
                <p className="text-sm text-gray-600">Enviar arquivo</p>
              </div>
            </div>
            <Button 
              onClick={() => alert("Funcionalidade de upload em desenvolvimento")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enviar Arquivo
            </Button>
          </Card>

          {/* Modal de Configurações */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-600">Alterar configurações</p>
              </div>
            </div>
            <Button 
              onClick={() => alert("Funcionalidade de configurações em desenvolvimento")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              Aplicar Configurações
            </Button>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Como usar os novos modais</h3>
          <p className="text-blue-800 text-sm mb-4">
            Os modais agora seguem um padrão consistente com cores específicas para cada tipo de ação:
          </p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li><strong>Vermelho:</strong> Ações destrutivas (excluir, remover)</li>
            <li><strong>Amarelo:</strong> Avisos e ações com riscos</li>
            <li><strong>Verde:</strong> Ações positivas (salvar, confirmar)</li>
            <li><strong>Azul:</strong> Ações neutras (download, upload)</li>
            <li><strong>Cinza:</strong> Configurações e ações administrativas</li>
          </ul>
        </div>
      </Section>
    </Container>
  );
}
