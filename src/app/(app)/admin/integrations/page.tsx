"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "lucide-react";

export default function AdminIntegrationsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Integrações"
          description="Gerencie integrações com Hotmart, APIs externas e outras plataformas"
          icon={<Link className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Link className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              APIs e Webhooks
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Gerencie integrações com Hotmart, APIs externas e outras plataformas.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
