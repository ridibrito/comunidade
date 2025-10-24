"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Mail, Server, FileText, Send } from "lucide-react";

export default function EmailSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Configurações de Email"
          description="Configure SMTP, templates e configurações de envio"
          icon={Mail}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configurações SMTP */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Configurações SMTP
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Servidor SMTP
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Porta
                </label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email de Envio
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="comunidade@aldeiasingular.com.br"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Senha do Email
                </label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light-text dark:text-dark-text">SSL/TLS</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    Usar conexão segura
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </ModernCard>

          {/* Configurações de Envio */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Configurações de Envio
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Limite de Emails por Hora
                </label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Delay entre Emails (ms)
                </label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                  placeholder="1000"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light-text dark:text-dark-text">Fila de Envio</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    Processar emails em fila
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </ModernCard>

          {/* Templates Padrão */}
          <ModernCard className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Templates Padrão
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-medium text-light-text dark:text-dark-text mb-3">Email de Boas-vindas</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Assunto
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                      placeholder="Bem-vindo à Comunidade Singular!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Conteúdo
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                      rows={4}
                      placeholder="Olá {{nome}}, bem-vindo à nossa comunidade!"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-light-text dark:text-dark-text mb-3">Email de Recuperação</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Assunto
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                      placeholder="Recuperação de Senha"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      Conteúdo
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                      rows={4}
                      placeholder="Clique no link para redefinir sua senha: {{link}}"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
            Testar Conexão
          </button>
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
