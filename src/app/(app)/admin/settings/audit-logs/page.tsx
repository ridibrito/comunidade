"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { History, Filter, Download, Search } from "lucide-react";

export default function AuditLogsSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Logs de Auditoria"
          description="Visualize histórico completo de ações, filtros e exportação"
          icon={History}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Histórico de Ações
              </h2>
            </div>
            <div className="text-center py-12">
              <History className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Logs de Atividade
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Visualize todas as ações realizadas no sistema.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Filtros Avançados
              </h2>
            </div>
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Busca e Filtros
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Filtre logs por usuário, data, ação e outros critérios.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Exportação
              </h2>
            </div>
            <div className="text-center py-12">
              <Download className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Exportar Logs
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Exporte logs para análise externa.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Alertas
              </h2>
            </div>
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Ações Suspeitas
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure alertas para ações suspeitas.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
