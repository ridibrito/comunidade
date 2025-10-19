import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { MountainBuilder } from "../_components/MountainBuilder";
import { Mountain, Layers, BookOpen, Users } from "lucide-react";

export default function AdminMountainsPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Montanhas" subtitle="Crie trilhas, módulos e aulas dentro da montanha." />
        
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-4 mb-8">
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Mountain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">3</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Montanhas</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">12</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Trilhas</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">64</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Módulos</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">1,284</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Usuários ativos</div>
              </div>
            </div>
          </ModernCard>
        </div>

        <ModernCard>
          <MountainBuilder />
        </ModernCard>
      </Section>
    </Container>
  );
}


