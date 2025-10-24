"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { MessageSquare, Megaphone, HelpCircle, Ticket } from "lucide-react";

export default function CommunicationSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Sistema de Comunicação"
          description="Chat interno, anúncios, FAQ e sistema de suporte"
          icon={MessageSquare}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Chat Interno
              </h2>
            </div>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Comunicação entre Administradores
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Chat em tempo real entre administradores.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Anúncios
              </h2>
            </div>
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Sistema de Anúncios
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Crie e gerencie anúncios para usuários.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                FAQ
              </h2>
            </div>
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Perguntas Frequentes
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Gerencie perguntas e respostas frequentes.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Sistema de Suporte
              </h2>
            </div>
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Tickets de Suporte
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Gerencie tickets de suporte dos usuários.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
