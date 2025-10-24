"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { FileText, Code, Eye, Save } from "lucide-react";

export default function TemplatesSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Editor de Templates"
          description="Crie e edite templates de email com editor HTML/CSS e preview"
          icon={FileText}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Templates */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Templates Existentes
              </h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface">
                <h3 className="font-medium text-light-text dark:text-dark-text">Email de Boas-vindas</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Template padrão para novos usuários</p>
              </div>
              <div className="p-3 border border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface">
                <h3 className="font-medium text-light-text dark:text-dark-text">Recuperação de Senha</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Template para reset de senha</p>
              </div>
              <div className="p-3 border border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface">
                <h3 className="font-medium text-light-text dark:text-dark-text">Notificação de Conteúdo</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">Template para novos conteúdos</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
              + Novo Template
            </button>
          </ModernCard>

          {/* Editor */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Editor HTML/CSS
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Nome do Template
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="Email de Boas-vindas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Assunto
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="Bem-vindo à Comunidade Singular!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Conteúdo HTML
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text font-mono text-sm"
                  rows={8}
                  placeholder="<html><body><h1>Olá {{nome}}!</h1><p>Bem-vindo à nossa comunidade.</p></body></html>"
                />
              </div>
            </div>
          </ModernCard>

          {/* Preview */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Preview
              </h2>
            </div>
            <div className="border border-light-border dark:border-dark-border rounded-lg p-4 bg-light-surface dark:bg-dark-surface">
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-3" />
                <p className="text-light-muted dark:text-dark-muted">
                  Preview do template aparecerá aqui
                </p>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Variáveis Disponíveis */}
        <ModernCard className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-brand-accent" />
            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
              Variáveis Disponíveis
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text mb-2">Dados do Usuário</h3>
              <div className="space-y-1 text-sm">
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{nome}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{email}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{role}}</code>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text mb-2">Dados da Plataforma</h3>
              <div className="space-y-1 text-sm">
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{plataforma}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{url}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{data}}</code>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text mb-2">Links e Ações</h3>
              <div className="space-y-1 text-sm">
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{link_login}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{link_reset}}</code>
                <code className="block px-2 py-1 bg-light-surface dark:bg-dark-surface rounded">{{link_conteudo}}</code>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
            Preview
          </button>
          <button className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
            Cancelar
          </button>
          <button className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-purple-700 transition-colors">
            Salvar Template
          </button>
        </div>
      </Section>
    </Container>
  );
}
