"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <Container fullWidth>
      <Section>
        <PageHeader
          title="Sistema de Notificações"
          description="Gerencie notificações, alertas e comunicações da plataforma"
          icon={<Bell className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
              Sistema de Notificações
            </h3>
            <p className="text-light-muted dark:text-dark-muted">
              Configure notificações por email, push e in-app para usuários e administradores.
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
