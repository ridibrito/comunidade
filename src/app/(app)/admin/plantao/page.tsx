"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import TrailManager, { type Trail } from "@/components/ui/TrailManager";
import { useState } from "react";

export default function AdminPlantaoPage() {
  const [trails, setTrails] = useState<Trail[]>([
    {
      id: "1",
      title: "Plantão de Dúvidas - Suporte Especializado",
      description: "Sessões de atendimento e esclarecimento de dúvidas",
      type: "plantao",
      order: 1,
      isExpanded: true,
      modules: [
        {
          id: "m1",
          title: "Sessões Realizadas",
          description: "Gravações de plantões já realizados",
          order: 1,
          isExpanded: true,
          lessons: [
            {
              id: "l1",
              title: "Plantão Identificação - 14/01/2024",
              status: "published",
              duration: "2h 15min",
              order: 1
            },
            {
              id: "l2", 
              title: "Plantão Desenvolvimento - 10/01/2024",
              status: "published",
              duration: "1h 45min",
              order: 2
            }
          ]
        },
        {
          id: "m2",
          title: "Próximos Plantões", 
          description: "Sessões de plantão agendadas",
          order: 2,
          isExpanded: false,
          lessons: [
            {
              id: "l3",
              title: "Plantão Intervenção - 18/01/2024",
              status: "draft",
              duration: "2h 00min",
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
        <PageHeader title="Plantão de Dúvidas" subtitle="Gerencie sessões de atendimento e suporte especializado." />
        
        <TrailManager 
          trails={trails} 
          onUpdateTrails={handleUpdateTrails}
        />
      </Section>
    </Container>
  );
}


