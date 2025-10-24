"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Database, Download, Upload, Settings } from "lucide-react";

export default function BackupSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Backup & Restore"
          description="Configure backup automático, exportação e restauração de dados"
          icon={Database}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Backup Automático
              </h2>
            </div>
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Backup Agendado
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure backup automático dos dados.
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
                Exportar Dados
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Exporte dados em diferentes formatos.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Restauração
              </h2>
            </div>
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Restaurar Dados
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Restaure dados de backups anteriores.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Configurações
              </h2>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Configurações de Backup
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure frequência e retenção de backups.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
