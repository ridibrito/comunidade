"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Badge from "@/components/ui/Badge";
import { Link, Copy, Check, ExternalLink, Settings, Zap } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminIntegrationsPage() {
  const [webhookSecret, setWebhookSecret] = useState("");
  const [productIds, setProductIds] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [copied, setCopied] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    // Simular carregamento das configurações existentes
    setWebhookUrl(`${window.location.origin}/api/hotmart/webhook`);
    setIsConfigured(true);
  }, []);

  const handleCopyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      push({ title: "Copiado!", message: "URL do webhook copiada para a área de transferência" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      push({ title: "Erro", message: "Não foi possível copiar a URL", variant: "error" });
    }
  };

  const handleSaveConfiguration = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    push({ title: "Configuração salva", message: "As configurações da Hotmart foram salvas com sucesso!" });
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Integrações"
          description="Gerencie integrações com Hotmart, APIs externas e outras plataformas"
          icon={<Link className="w-5 h-5" />}
        />

        <div className="space-y-6">
          {/* Hotmart Integration */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Hotmart
                </h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">
                  Integração automática de usuários via webhook
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant={isConfigured ? "success" : "warning"}>
                  {isConfigured ? "Configurado" : "Não configurado"}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              {/* Webhook URL */}
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    readOnly
                    className="bg-light-surface dark:bg-dark-surface"
                  />
                  <Button
                    onClick={handleCopyWebhookUrl}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-light-muted dark:text-dark-muted">
                  Configure esta URL no painel da Hotmart em "Webhooks"
                </p>
              </div>

              {/* Webhook Secret */}
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="Digite o secret do webhook da Hotmart"
                  className="bg-light-surface dark:bg-dark-surface"
                />
                <p className="text-xs text-light-muted dark:text-dark-muted">
                  Chave secreta para validar as requisições do webhook
                </p>
              </div>

              {/* Product IDs */}
              <div className="space-y-2">
                <Label htmlFor="product-ids">IDs dos Produtos (opcional)</Label>
                <Input
                  id="product-ids"
                  value={productIds}
                  onChange={(e) => setProductIds(e.target.value)}
                  placeholder="123456, 789012, 345678"
                  className="bg-light-surface dark:bg-dark-surface"
                />
                <p className="text-xs text-light-muted dark:text-dark-muted">
                  IDs dos produtos da Hotmart separados por vírgula. Deixe vazio para aceitar todos.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Como configurar na Hotmart:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Acesse o painel da Hotmart</li>
                  <li>Vá em "Configurações" → "Webhooks"</li>
                  <li>Adicione uma nova URL de webhook</li>
                  <li>Cole a URL acima no campo "URL do webhook"</li>
                  <li>Selecione os eventos: "PURCHASE_APPROVED", "PURCHASE_COMPLETED"</li>
                  <li>Configure o secret e cole no campo acima</li>
                  <li>Salve as configurações</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveConfiguration} className="bg-brand-accent text-white hover:bg-brand-accent/90">
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Configuração
                </Button>
                <Button variant="outline" onClick={() => window.open('https://app.hotmart.com/', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Hotmart
                </Button>
              </div>
            </div>
          </Card>

          {/* Webhook Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Status do Webhook
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Webhook ativo
                  </span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              
              <div className="text-sm text-light-muted dark:text-dark-muted">
                <p className="mb-2">O webhook está configurado para:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Cadastrar usuários automaticamente quando uma compra for aprovada</li>
                  <li>• Ativar assinaturas para produtos da Hotmart</li>
                  <li>• Enviar email de boas-vindas para novos usuários</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
