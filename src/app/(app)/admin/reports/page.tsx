"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Reports from "@/components/ui/Reports";
import { useState } from "react";

export default function AdminReportsPage() {
  const [trails] = useState([
    {
      id: "1",
      title: "Identificação - Treinando o seu olhar de Coruja",
      type: "montanha"
    },
    {
      id: "2", 
      title: "Desenvolvimento - Potencializando Habilidades",
      type: "montanha"
    },
    {
      id: "3",
      title: "Biblioteca de Materiais Educativos",
      type: "acervo"
    }
  ]);

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Relatórios" subtitle="Acompanhe métricas, performance e engajamento do conteúdo." />
        
        <Reports trails={trails} />
      </Section>
    </Container>
  );
}
