"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Upload } from "lucide-react";

export default function AdminBulkOperationsPage() {
  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Operações em Lote"
          subtitle="Realize operações em massa, importação e exportação de dados"
        />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              Importação e Exportação
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Realize uploads em massa, importação de dados e edições em lote.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
