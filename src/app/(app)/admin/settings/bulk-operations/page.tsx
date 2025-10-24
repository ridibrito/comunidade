"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Upload, Download, FileText, Settings } from "lucide-react";

export default function BulkOperationsSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Operações em Lote"
          description="Upload em massa, edição em lote e importação de dados"
          icon={Upload}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Upload em Massa
              </h2>
            </div>
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Upload de Múltiplos Arquivos
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Faça upload de vários arquivos simultaneamente.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Importação de Dados
              </h2>
            </div>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Importar CSV/Excel
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Importe usuários e conteúdos via planilhas.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Edição em Lote
              </h2>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Operações em Massa
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Edite múltiplos itens simultaneamente.
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
        </div>
      </Section>
    </Container>
  );
}
