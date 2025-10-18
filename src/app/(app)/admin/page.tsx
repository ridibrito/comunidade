import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function AdminPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Painel administrativo" subtitle="Visão geral de uso e gestão da plataforma." />

      {/* KPIs */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-sm text-[var(--foreground)]/70">Usuários ativos (30d)</div>
          <div className="mt-2 text-3xl font-semibold">1 284</div>
          <div className="mt-1 text-xs text-[var(--foreground)]/60">+8% vs período anterior</div>
        </Card>
        <Card>
          <div className="text-sm text-[var(--foreground)]/70">Montanhas</div>
          <div className="mt-2 text-3xl font-semibold">3</div>
          <div className="mt-1 text-xs text-[var(--foreground)]/60">12 trilhas, 64 módulos</div>
        </Card>
        <Card>
          <div className="text-sm text-[var(--foreground)]/70">Aulas assistidas (30d)</div>
          <div className="mt-2 text-3xl font-semibold">18 902</div>
          <div className="mt-1 text-xs text-[var(--foreground)]/60">Média 26 min por aula</div>
        </Card>
        <Card>
          <div className="text-sm text-[var(--foreground)]/70">Interações IA (30d)</div>
          <div className="mt-2 text-3xl font-semibold">4 317</div>
          <div className="mt-1 text-xs text-[var(--foreground)]/60">Satisfação 92%</div>
        </Card>
      </div>

      {/* Grids */}
      <div className="section-spacing grid gap-8 xl:grid-cols-3">
        {/* Conclusão por trilha */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Conclusão por trilha</h2>
            <span className="text-xs text-[var(--foreground)]/60">Últimos 30 dias</span>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Trilha 1","Trilha 2","Trilha 3","Trilha 4","Trilha 5","Trilha 6"].map((t,i)=> (
              <div key={i} className="rounded-xl border border-[var(--border)] p-3">
                <div className="text-sm">{t}</div>
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--hover)]">
                  <div className="h-2 rounded-full bg-[var(--accent-purple)]" style={{width: `${50 + i*7}%`}} />
                </div>
                <div className="mt-1 text-xs text-[var(--foreground)]/60">{50+i*7}% concluído</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Saúde do sistema */}
        <Card>
          <h2 className="text-lg font-semibold">Saúde do sistema</h2>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center justify-between"><span>Supabase</span><span className="text-[var(--accent-purple)]">OK</span></li>
            <li className="flex items-center justify-between"><span>Storage</span><span className="text-[var(--accent-purple)]">OK</span></li>
            <li className="flex items-center justify-between"><span>OpenAI</span><span className="text-[var(--accent-purple)]">OK</span></li>
            <li className="flex items-center justify-between"><span>Resend</span><span className="text-[var(--accent-purple)]">OK</span></li>
          </ul>
          <div className="mt-3 text-xs text-[var(--foreground)]/60">Última verificação há 2 min</div>
        </Card>
      </div>

      {/* Atividades recentes */}
      <Card className="section-spacing">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Atividades recentes</h2>
          <button className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Ver tudo</button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[var(--foreground)]/60">
              <tr>
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Usuário</th>
                <th className="text-left py-2">Ação</th>
                <th className="text-left py-2">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((i)=> (
                <tr key={i} className="border-t border-[var(--border)]">
                  <td className="py-2">2025-10-16 14:{10+i}</td>
                  <td className="py-2">admin@singulari</td>
                  <td className="py-2">Atualizou aula</td>
                  <td className="py-2">Módulo 2 / Aula {i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </Section>
    </Container>
  );
}


