"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Link, Settings, Activity, TestTube } from "lucide-react";

export default function IntegrationsSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Integrações Externas"
          description="Configure Hotmart, APIs externas e sincronização de dados"
          icon={Link}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Link className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Hotmart
              </h2>
            </div>
            <div className="text-center py-12">
              <Link className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Webhook Hotmart
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure integração com Hotmart para novos usuários.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                APIs Externas
              </h2>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Configuração de APIs
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure endpoints e autenticação de APIs.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Sincronização
              </h2>
            </div>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Status e Logs
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Monitore status e logs de sincronização.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <TestTube className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Testes
              </h2>
            </div>
            <div className="text-center py-12">
              <TestTube className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Validação de Integrações
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Teste e valide integrações configuradas.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
