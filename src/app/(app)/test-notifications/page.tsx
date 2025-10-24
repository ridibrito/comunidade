"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/components/ui/NotificationSystem";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";

export default function TestNotificationsPage() {
  const { addNotification } = useNotifications();
  const { success, error, warning, info, lessonCompleted, moduleCompleted, trailCompleted, videoError, contentBlocked, newUpdate, saveProgress, ratingSaved, loading, dismiss } = useToastContext();
  
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"info" | "success" | "warning" | "error">("info");
  const [simulatorEnabled, setSimulatorEnabled] = useState(false);
  
  const { startSimulator, stopSimulator, isActive } = useNotificationSimulator();
  
  // Ativar/desativar simulador baseado no estado
  useEffect(() => {
    if (simulatorEnabled) {
      startSimulator();
    } else {
      stopSimulator();
    }
  }, [simulatorEnabled, startSimulator, stopSimulator]);

  const handleAddNotification = () => {
    if (!notificationTitle.trim()) return;
    
    addNotification({
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      actionUrl: "/catalog/montanha-do-amanha",
      actionText: "Ver Conteúdo",
    });
    
    setNotificationTitle("");
    setNotificationMessage("");
  };

  const handleAddToast = (type: "success" | "error" | "warning" | "info") => {
    const messages = {
      success: { title: "Sucesso!", description: "Operação realizada com sucesso." },
      error: { title: "Erro!", description: "Algo deu errado. Tente novamente." },
      warning: { title: "Atenção!", description: "Verifique os dados antes de continuar." },
      info: { title: "Informação", description: "Nova atualização disponível." },
    };
    
    const { title, description } = messages[type];
    
    if (type === "success") success(title, description);
    else if (type === "error") error(title, description);
    else if (type === "warning") warning(title, description);
    else info(title, description);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Sistema de Notificações Moderno
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Teste o sistema de notificações e toasts baseado no shadcn-ui
        </p>
        
        {/* Banner de melhorias */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ✨ Novas Funcionalidades Implementadas
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• <strong>Sonner Toast System</strong> - Toasts modernos com ícones coloridos</li>
            <li>• <strong>NotificationCard Avançado</strong> - Com progresso visual e metadata</li>
            <li>• <strong>Toasts Específicos</strong> - Métodos para aula, módulo, trilha concluídos</li>
            <li>• <strong>Simulador Automático</strong> - Notificações automáticas para teste</li>
            <li>• <strong>Design Responsivo</strong> - Baseado nos padrões do shadcn-ui</li>
          </ul>
        </div>
      </div>

      {/* Demonstração Visual */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Demonstração Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700 dark:text-green-400">✅ Toasts Modernos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clique nos botões abaixo para ver toasts com ícones coloridos e animações suaves
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => success("Sucesso!", "Operação realizada com sucesso")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Sucesso
                </Button>
                <Button 
                  onClick={() => error("Erro!", "Algo deu errado")}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Erro
                </Button>
                <Button 
                  onClick={() => warning("Atenção!", "Verifique os dados")}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Aviso
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400">🔔 Notificações Persistentes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adicione notificações que ficam salvas no sino do header
              </p>
              <Button 
                onClick={() => addNotification({
                  title: "Nova Notificação",
                  message: "Esta é uma notificação de exemplo com design moderno",
                  type: "info",
                  actionUrl: "/catalog/montanha-do-amanha",
                  actionText: "Ver Conteúdo"
                })}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Adicionar Notificação
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controle do Simulador */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Simulador Automático</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Switch
              checked={simulatorEnabled}
              onCheckedChange={setSimulatorEnabled}
            />
            <Label htmlFor="simulator">
              {simulatorEnabled ? "Simulador Ativo" : "Ativar Simulador"}
            </Label>
          </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                   {simulatorEnabled 
                     ? `Simulador ativo - Status: ${isActive() ? 'Rodando' : 'Parado'}`
                     : "Ative para receber notificações automáticas de exemplo"
                   }
                 </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teste de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Persistentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Título da notificação"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Mensagem da notificação"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddNotification} className="w-full">
              Adicionar Notificação
            </Button>
          </CardContent>
        </Card>

        {/* Teste de Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Toasts Temporários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleAddToast("success")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Toast Sucesso
              </Button>
              
              <Button 
                onClick={() => handleAddToast("error")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Toast Erro
              </Button>
              
              <Button 
                onClick={() => handleAddToast("warning")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Toast Aviso
              </Button>
              
              <Button 
                onClick={() => handleAddToast("info")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Toast Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações de Exemplo */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações de Exemplo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => addNotification({
                title: "Nova Aula Disponível",
                message: "Aula sobre Aspectos Cognitivos foi publicada",
                type: "success",
                actionUrl: "/catalog/modulo/aspectos-cognitivos",
                actionText: "Assistir",
              })}
              className="w-full"
            >
              Nova Aula
            </Button>
            
            <Button 
              onClick={() => addNotification({
                title: "Lembrete de Evento",
                message: "Roda de Conversa amanhã às 19h",
                type: "info",
                actionUrl: "/calendar",
                actionText: "Ver Calendário",
              })}
              className="w-full"
            >
              Lembrete de Evento
            </Button>
            
            <Button 
              onClick={() => addNotification({
                title: "Sistema em Manutenção",
                message: "Manutenção programada para domingo às 2h",
                type: "warning",
              })}
              className="w-full"
            >
              Aviso de Manutenção
            </Button>
          </CardContent>
        </Card>

        {/* Toasts de Exemplo */}
        <Card>
          <CardHeader>
            <CardTitle>Toasts de Exemplo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => lessonCompleted("Aspectos Cognitivos - Aula 01")}
              className="w-full"
            >
              Aula Concluída
            </Button>
            
            <Button 
              onClick={() => videoError("Erro de conexão com o servidor Vimeo")}
              className="w-full"
            >
              Erro no Vídeo
            </Button>
            
            <Button 
              onClick={() => contentBlocked("Complete a aula anterior primeiro")}
              className="w-full"
            >
              Conteúdo Bloqueado
            </Button>
            
            <Button 
              onClick={() => newUpdate("Novos recursos de IA disponíveis!")}
              className="w-full"
            >
              Nova Atualização
            </Button>
            
            <Button 
              onClick={() => {
                const loadingToast = loading("Carregando...", "Processando sua solicitação");
                setTimeout(() => {
                  dismiss(loadingToast);
                  success("Processamento Concluído!", "Sua solicitação foi processada com sucesso.");
                }, 3000);
              }}
              className="w-full"
            >
              Teste Loading
            </Button>
            
            <Button 
              onClick={() => moduleCompleted("Aspectos Cognitivos")}
              className="w-full"
            >
              Módulo Concluído
            </Button>
            
            <Button 
              onClick={() => trailCompleted("Identificação")}
              className="w-full"
            >
              Trilha Concluída
            </Button>
            
            <Button 
              onClick={() => saveProgress()}
              className="w-full"
            >
              Progresso Salvo
            </Button>
            
            <Button 
              onClick={() => ratingSaved(5)}
              className="w-full"
            >
              Avaliação Salva
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
