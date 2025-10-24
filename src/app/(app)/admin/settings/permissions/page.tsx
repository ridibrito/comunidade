"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Shield, Users, Key, Settings } from "lucide-react";

export default function PermissionsSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Sistema de Permissões"
          description="Configure roles customizados, permissões granulares e hierarquia de usuários"
          icon={Shield}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Roles Customizados */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Roles Customizados
              </h2>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Gerenciamento de Roles
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Crie e configure roles personalizados com permissões específicas.
              </p>
            </div>
          </ModernCard>

          {/* Permissões Granulares */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Permissões Granulares
              </h2>
            </div>
            <div className="text-center py-12">
              <Key className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Controle de Acesso
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure permissões específicas por módulo e funcionalidade.
              </p>
            </div>
          </ModernCard>

          {/* Hierarquia de Usuários */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Hierarquia
              </h2>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Estrutura Hierárquica
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure super admin, admin, moderador e outros níveis.
              </p>
            </div>
          </ModernCard>

          {/* Auditoria de Permissões */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Auditoria
              </h2>
            </div>
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Logs de Permissões
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Monitore alterações de permissões e acessos.
              </p>
            </div>
          </ModernCard>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
            Cancelar
          </button>
          <button className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-purple-700 transition-colors">
            Salvar Configurações
          </button>
        </div>
      </Section>
    </Container>
  );
}
