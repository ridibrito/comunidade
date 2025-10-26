"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import TrailManager, { type Trail } from "@/components/ui/TrailManager";
import { useState } from "react";

export default function AdminAcervoPage() {
  const [trails, setTrails] = useState<Trail[]>([
    {
      id: "1",
      title: "Biblioteca de Materiais Educativos",
      description: "Coleção de livros, PDFs e recursos para estudo",
      type: "acervo",
      order: 1,
      isExpanded: true,
      modules: [
        {
          id: "m1",
          title: "Livros Fundamentais",
          description: "Obras essenciais sobre AHSD",
          trail_id: "1",
          position: 1,
          order: 1,
          isExpanded: true,
          lessons: [
            {
              id: "l1",
              title: "Guia Completo de AHSD - Dr. Maria Silva",
              status: "published",
              duration: "245 páginas",
              order: 1
            },
            {
              id: "l2", 
              title: "Manual de Identificação - Equipe Coruss",
              status: "published",
              duration: "89 páginas",
              order: 2
            }
          ]
        },
        {
          id: "m2",
          title: "Artigos Científicos", 
          description: "Pesquisas e estudos atualizados",
          trail_id: "1",
          position: 2,
          order: 2,
          isExpanded: false,
          lessons: [
            {
              id: "l3",
              title: "Estratégias de Intervenção - Dr. João Santos",
              status: "draft",
              duration: "156 páginas",
              order: 1
            }
          ]
        }
      ]
    }
  ]);

  const handleUpdateTrails = (updatedTrails: Trail[]) => {
    setTrails(updatedTrails);
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Acervo Digital" subtitle="Gerencie livros, PDFs e materiais educativos." />
        
        <TrailManager 
          trails={trails} 
          onUpdateTrails={handleUpdateTrails}
        />
      </Section>
    </Container>
  );
}


