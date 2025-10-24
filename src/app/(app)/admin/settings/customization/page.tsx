"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { Palette, Image, Type, Layout } from "lucide-react";

export default function CustomizationSettingsPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Personalização"
          description="Configure temas, cores, fontes e elementos visuais da plataforma"
          icon={Palette}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Temas e Cores
              </h2>
            </div>
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Personalização Visual
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure cores, temas e elementos visuais.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Image className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Branding
              </h2>
            </div>
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Logo e Favicon
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure logo, favicon e elementos de marca.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Tipografia
              </h2>
            </div>
            <div className="text-center py-12">
              <Type className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Fontes e Tipografia
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Configure fontes e estilos de texto.
              </p>
            </div>
          </ModernCard>

          <ModernCard>
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Layout
              </h2>
            </div>
            <div className="text-center py-12">
              <Layout className="w-16 h-16 text-light-muted dark:text-dark-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Layout e Componentes
              </h3>
              <p className="text-light-muted dark:text-dark-muted">
                Personalize layout e componentes da interface.
              </p>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
