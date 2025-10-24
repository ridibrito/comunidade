"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Database } from "lucide-react";

export default function AdminBackupPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Backup & Restore"
          description="Gerencie backups automáticos, exportação e restauração de dados"
          icon={<Database className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              Proteção de Dados
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Gerencie backups automáticos, exportação e restauração de dados.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
