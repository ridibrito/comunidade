"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Shield } from "lucide-react";

export default function AdminPermissionsPage() {
  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Sistema de Permissões"
          subtitle="Gerencie roles, permissões e acesso de usuários"
        />
        <Shield className="w-12 h-12 text-brand-accent mb-6" />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              Controle de Acesso
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Configure roles customizados, permissões granulares e hierarquia de usuários.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
