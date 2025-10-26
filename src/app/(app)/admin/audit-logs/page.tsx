"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { History } from "lucide-react";

export default function AdminAuditLogsPage() {
  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Logs de Auditoria"
          subtitle="Visualize o histórico completo de ações dos usuários e administradores"
        />

        <div className="space-y-6">
          <div className="text-center py-12">
            <History className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              Logs de Auditoria
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Visualize o histórico completo de ações dos usuários e administradores.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
