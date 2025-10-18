import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function AnamnesePage() {
  return (
    <main className="p-0 h-[calc(100vh-64px)] overflow-hidden -m-4">
      <div className="flex h-full">
        <aside className="hidden md:block w-[280px] xl:w-[340px] border-r-2 border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="mb-2 px-2 text-sm font-medium opacity-70">Perfil</div>
          <ul className="text-sm space-y-1">
            <li><a href="/profile?s=responsavel" className="block px-3 py-2 rounded-xl hover:bg-[var(--hover)]">Responsável</a></li>
            <li><a href="/profile?s=familia" className="block px-3 py-2 rounded-xl hover:bg-[var(--hover)]">Família</a></li>
            <li className="pt-2 mt-2 border-t border-[var(--border)]" />
            <li><a aria-current="page" className="block px-3 py-2 rounded-xl bg-[var(--hover)]" href="#">Anamnese</a></li>
            <li><a href="/profile/rotina" className="block px-3 py-2 rounded-xl hover:bg-[var(--hover)]">Rotina</a></li>
            <li><a href="/profile/diario" className="block px-3 py-2 rounded-xl hover:bg-[var(--hover)]">Diário</a></li>
          </ul>
        </aside>
        <section className="flex-1 p-8 overflow-y-auto">
          <PageHeader title="Anamnese" subtitle="Formulário por filho" />
          <Card>
            <div className="text-sm text-[var(--foreground)]/70">Em breve: formulário completo de Anamnese por filho.</div>
          </Card>
        </section>
      </div>
    </main>
  );
}


