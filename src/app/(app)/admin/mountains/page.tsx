"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import TrailManager, { type Trail } from "@/components/ui/TrailManager";
import { useState } from "react";

export default function AdminMountainsPage() {
  const [trails, setTrails] = useState<Trail[]>([
    {
      id: "1",
      title: "Identificação - Treinando o seu olhar de Coruja",
      description: "Módulos fundamentais para identificação de características AHSD",
      type: "montanha",
      order: 1,
      isExpanded: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1 - Aspectos Cognitivos",
          description: "Desenvolvimento intelectual e habilidades mentais",
          order: 1,
          isExpanded: true,
          lessons: [
            {
              id: "l1",
              title: "Alinhando as Expectativas - Introdução",
              status: "published",
              duration: "15 min",
              order: 1
            },
            {
              id: "l2", 
              title: "Características Cognitivas Básicas",
              status: "published",
              duration: "22 min",
              order: 2
            }
          ]
        },
        {
          id: "m2",
          title: "Módulo 2 - Aspectos Socioemocionais", 
          description: "Inteligência emocional e relacionamentos",
          order: 2,
          isExpanded: false,
          lessons: [
            {
              id: "l3",
              title: "Desenvolvimento Emocional",
              status: "draft",
              duration: "18 min",
              order: 1
            }
          ]
        }
      ]
    },
    {
      id: "2",
      title: "Desenvolvimento - Potencializando Habilidades",
      description: "Estratégias para desenvolvimento das habilidades identificadas",
      type: "montanha", 
      order: 2,
      isExpanded: false,
      modules: [
        {
          id: "m3",
          title: "Módulo 1 - Rotinas e Organização",
          description: "Estruturação do dia a dia",
          order: 1,
          isExpanded: false,
          lessons: []
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
        <PageHeader title="Montanhas" subtitle="Crie trilhas, módulos e aulas dentro da montanha." />
        
        <TrailManager 
          trails={trails} 
          onUpdateTrails={handleUpdateTrails}
        />
      </Section>
    </Container>
  );
}


