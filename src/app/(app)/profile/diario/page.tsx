import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { UserCircle, UsersRound, ClipboardList, CalendarDays, BookOpen } from "lucide-react";

export default function DiarioPage() {
  return (
    <Container fullWidth>
      <div className="flex h-full">
        <aside className="hidden md:block shrink-0 h-screen bg-light-surface dark:bg-dark-surface transition-all duration-300 shadow-sm w-[240px] xl:w-[280px] p-4">
          <div className="mb-2" />
          <ul className="text-sm space-y-2">
            <li>
              <a href="/profile" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle">
                <UserCircle size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Responsável</span>
              </a>
            </li>
            <li>
              <a href="/profile/familia" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle">
                <UsersRound size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Família</span>
              </a>
            </li>
            <li className="my-4"><div className="h-px bg-light-border dark:bg-dark-border" /></li>
            <li>
              <a href="/profile/anamnese" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle">
                <ClipboardList size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Anamnese</span>
              </a>
            </li>
            <li>
              <a href="/profile/rotina" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle">
                <CalendarDays size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Rotina</span>
              </a>
            </li>
            <li>
              <a aria-current="page" href="/profile/diario" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left active-brand-subtle text-brand-accent">
                <BookOpen size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400">Diário</span>
              </a>
            </li>
          </ul>
        </aside>

        <Section>
          <PageHeader title="Diário" subtitle="Registros do dia por filho" />
          <Card className="shadow-md rounded-lg p-8 border-0">
            <div className="text-sm text-light-muted dark:text-dark-muted">Em breve: diário rápido para registro dos responsáveis.</div>
          </Card>
        </Section>
      </div>
    </Container>
  );
}


