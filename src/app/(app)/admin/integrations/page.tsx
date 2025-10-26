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
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('hotmart-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setWebhookSecret(config.webhookSecret || '');
      setProductIds(config.productIds || '');
      setWebhookUrl(config.webhookUrl || 'https://app.aldeiasingular.com.br/api/hotmart/webhook');
      setIsConfigured(config.isConfigured || false);
    } else {
      // Configuração padrão
      setWebhookUrl('https://app.aldeiasingular.com.br/api/hotmart/webhook');
      setIsConfigured(false);
    }
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

  const handleSaveConfiguration = async () => {
    try {
      // Salvar no localStorage para persistência local
      const config = {
        webhookSecret,
        productIds,
        webhookUrl,
        isConfigured: true
      };
      
      localStorage.setItem('hotmart-config', JSON.stringify(config));
      setIsConfigured(true);
      
      push({ title: "Configuração salva", message: "As configurações da Hotmart foram salvas com sucesso!" });
    } catch (error) {
      push({ title: "Erro", message: "Erro ao salvar configurações", variant: "error" });
    }
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Integrações"
          subtitle="Gerencie integrações com Hotmart, APIs externas e outras plataformas"
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
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Cole aqui a URL do ngrok ou use a URL de produção"
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => setWebhookUrl('https://app.aldeiasingular.com.br/api/hotmart/webhook')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Usar URL de produção
                  </Button>
                  <Button
                    onClick={() => setWebhookUrl('https://enumerable-lynetta-soupiest.ngrok-free.dev/api/hotmart/webhook')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Usar URL do ngrok (teste)
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
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base">
                  Como configurar na Hotmart:
                </h4>
                <ol className="text-sm text-gray-800 dark:text-gray-200 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                  <li>Acesse o painel da Hotmart</li>
                  <li>Vá em "Configurações" → "Webhooks"</li>
                  <li>Adicione uma nova URL de webhook</li>
                  <li>Cole a URL de produção: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">https://app.aldeiasingular.com.br/api/hotmart/webhook</code></li>
                  <li>Selecione os eventos: "PURCHASE_APPROVED", "PURCHASE_COMPLETED", "PURCHASE_CANCELED", "PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_PENDING"</li>
                  <li>Configure o secret e cole no campo acima</li>
                  <li>Salve as configurações</li>
                  <li><strong>Teste fazendo uma compra!</strong> 🎉</li>
                </ol>
              </div>

              {/* Status Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-base">
                  Como funciona o sistema de status:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">✅ Acesso Ativo:</h5>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• <strong>PURCHASE_APPROVED</strong> → Status: active</li>
                      <li>• <strong>PURCHASE_COMPLETED</strong> → Status: active</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">❌ Acesso Removido:</h5>
                    <ul className="space-y-1 text-red-700 dark:text-red-300">
                      <li>• <strong>PURCHASE_CANCELED</strong> → Status: canceled</li>
                      <li>• <strong>PURCHASE_REFUNDED</strong> → Status: refunded</li>
                      <li>• <strong>PURCHASE_CHARGEBACK</strong> → Status: chargeback</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                  💡 O sistema automaticamente remove o acesso quando detecta reembolsos, cancelamentos ou chargebacks.
                </p>
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
