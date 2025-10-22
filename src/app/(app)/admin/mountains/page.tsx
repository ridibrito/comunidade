"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import TrailManager, { type Trail } from "@/components/ui/TrailManager";
import { createClient } from "@/lib/supabase";

export default function AdminMountainsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrailsData();
  }, []);

  async function loadTrailsData() {
    try {
      setLoading(true);
      const supabase = createClient();
      
      console.log('🔄 Carregando dados das trilhas...');
      
      // Buscar trilhas
      const { data: trailsData, error: trailsError } = await supabase
        .from('trails')
        .select('*');
      
      if (trailsError) {
        console.error('Erro ao carregar trilhas:', trailsError);
        return;
      }
      
      // Para cada trilha, buscar seus módulos
      const trailsWithModules = await Promise.all(
        (trailsData || []).map(async (trail) => {
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .eq('trail_id', trail.id);
          
          if (modulesError) {
            console.error('Erro ao carregar módulos:', modulesError);
            return { ...trail, modules: [] };
          }
          
          // Para cada módulo, buscar suas aulas
          const modulesWithLessons = await Promise.all(
            (modulesData || []).map(async (module) => {
              const { data: lessonsData, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id);
              
              if (lessonsError) {
                console.error('Erro ao carregar aulas:', lessonsError);
                return { ...module, lessons: [] };
              }
              
              return {
                ...module,
                lessons: (lessonsData || []).map(lesson => ({
                  ...lesson,
                  status: "published", // Mock status
                  duration: "30 min" // Mock duration
                }))
              };
            })
          );
          
          return {
            ...trail,
            modules: modulesWithLessons,
            type: "montanha", // Mock type
            order: 1, // Mock order
            isExpanded: false // Mock expanded state
          };
        })
      );
      
      setTrails(trailsWithModules);
      console.log('✅ Dados carregados:', trailsWithModules.length, 'trilhas');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateTrails = (updatedTrails: Trail[]) => {
    setTrails(updatedTrails);
  };

  if (loading) {
    return (
      <Container fullWidth>
        <Section>
          <PageHeader title="Montanhas" subtitle="Crie trilhas, módulos e aulas dentro da montanha." />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-dark-muted">Carregando trilhas...</p>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Montanhas" subtitle="Crie trilhas, módulos e aulas dentro da montanha." />
        
        {trails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-dark-muted">
              <h3 className="text-lg font-medium mb-2">Nenhuma trilha configurada</h3>
              <p className="text-sm mb-4">As trilhas serão adicionadas em breve pela equipe administrativa.</p>
              <button 
                onClick={loadTrailsData}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Atualizar Dados
              </button>
            </div>
          </div>
        ) : (
          <TrailManager 
            trails={trails} 
            onUpdateTrails={handleUpdateTrails}
          />
        )}
      </Section>
    </Container>
  );
}


