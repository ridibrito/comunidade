import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { 
  Users, 
  Mountain, 
  PlayCircle, 
  Bot, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye
} from "lucide-react";

export default function AdminPage() {
  return (
    <Container>
      <Section>
        <PageHeader title="Painel administrativo" subtitle="Visão geral de uso e gestão da plataforma." />

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Usuários ativos (30d)"
            value="1,284"
            description="+8% vs período anterior"
            icon={<Users className="w-5 h-5" />}
            variant="default"
            trend={{
              value: 8,
              label: "vs período anterior",
              positive: true
            }}
          />
          <MetricCard
            title="Montanhas"
            value="3"
            description="12 trilhas, 64 módulos"
            icon={<Mountain className="w-5 h-5" />}
            variant="info"
          />
          <MetricCard
            title="Aulas assistidas (30d)"
            value="18,902"
            description="Média 26 min por aula"
            icon={<PlayCircle className="w-5 h-5" />}
            variant="success"
            trend={{
              value: 12,
              label: "vs mês anterior",
              positive: true
            }}
          />
          <MetricCard
            title="Interações IA (30d)"
            value="4,317"
            description="Satisfação 92%"
            icon={<Bot className="w-5 h-5" />}
            variant="brand"
            trend={{
              value: 15,
              label: "vs período anterior",
              positive: true
            }}
          />
        </div>

        {/* Grids */}
        <div className="section-spacing grid gap-8 xl:grid-cols-3">
          {/* Conclusão por trilha */}
          <ModernCard className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Conclusão por trilha</h2>
              <Badge variant="outline" size="sm">Últimos 30 dias</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Identificação", "Desenvolvimento", "Avaliação", "Intervenção", "Acompanhamento", "Finalização"].map((t,i)=> (
                <div key={i} className="p-4 rounded-lg bg-light-border/30 dark:bg-dark-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">{t}</span>
                    <span className="text-xs text-light-muted dark:text-dark-muted">{50+i*7}%</span>
                  </div>
                  <div className="w-full bg-light-border/50 dark:bg-dark-border/50 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-brand-accent transition-all duration-500" 
                      style={{width: `${50 + i*7}%`}} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Saúde do sistema */}
          <ModernCard>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-brand-accent" />
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Saúde do sistema</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Supabase", status: "OK", icon: CheckCircle },
                { name: "Storage", status: "OK", icon: CheckCircle },
                { name: "OpenAI", status: "OK", icon: CheckCircle },
                { name: "Resend", status: "OK", icon: CheckCircle }
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-light-border/20 dark:bg-dark-border/20">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">{service.name}</span>
                  </div>
                  <Badge variant="success" size="sm">{service.status}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted">
                <Clock className="w-3 h-3" />
                Última verificação há 2 min
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Atividades recentes */}
        <ModernCard className="section-spacing">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-accent" />
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Atividades recentes</h2>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text transition-colors">
              Ver tudo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Data</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Usuário</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Ação</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i)=> (
                  <tr key={i} className="border-b border-light-border/50 dark:border-dark-border/50 hover:bg-light-border/20 dark:hover:bg-dark-border/20 transition-colors">
                    <td className="py-3 text-light-text dark:text-dark-text">2025-01-16 14:{10+i}</td>
                    <td className="py-3 text-light-text dark:text-dark-text">admin@singulari</td>
                    <td className="py-3">
                      <Badge variant="info" size="sm">Atualizou aula</Badge>
                    </td>
                    <td className="py-3 text-light-muted dark:text-dark-muted">Módulo 2 / Aula {i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModernCard>
      </Section>
    </Container>
  );
}