"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import TrailManager, { type Trail } from "@/components/ui/TrailManager";
import { useState } from "react";

export default function AdminRodasPage() {
  const [trails, setTrails] = useState<Trail[]>([
    {
      id: "1",
      title: "Rodas de Conversa - Desenvolvimento Motor",
      description: "Discussões sobre desenvolvimento físico e coordenação motora",
      type: "rodas",
      order: 1,
      isExpanded: true,
      modules: [
        {
          id: "m1",
          title: "Sessões Realizadas",
          description: "Gravações de rodas já realizadas",
          order: 1,
          isExpanded: true,
          lessons: [
            {
              id: "l1",
              title: "Desenvolvimento Motor - 15/01/2024",
              status: "published",
              duration: "1h 30min",
              order: 1
            },
            {
              id: "l2", 
              title: "Rotinas e Organização - 12/01/2024",
              status: "published",
              duration: "1h 20min",
              order: 2
            }
          ]
        },
        {
          id: "m2",
          title: "Próximas Sessões", 
          description: "Rodas de conversa agendadas",
          order: 2,
          isExpanded: false,
          lessons: [
            {
              id: "l3",
              title: "Estratégias de Intervenção - 20/01/2024",
              status: "draft",
              duration: "1h 30min",
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
        <PageHeader title="Rodas de Conversa" subtitle="Gerencie sessões de discussão e eventos ao vivo." />
        
        <TrailManager 
          trails={trails} 
          onUpdateTrails={handleUpdateTrails}
        />
      </Section>
    </Container>
  );
}


