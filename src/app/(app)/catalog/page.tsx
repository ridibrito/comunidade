"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import MontanhaAmanhaPage from "./montanha-do-amanha/page";

export default function CatalogPage() {
  return (
    <Container fullWidth>
      <Section>
        <PageHeader 
          title="Catálogo" 
          subtitle="Explore nosso conteúdo educacional" 
        />
        
        <MontanhaAmanhaPage />
      </Section>
    </Container>
  );
}