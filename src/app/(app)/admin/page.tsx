"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/Chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
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
  Eye,
  BarChart3,
  Calendar,
  Filter
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { useState } from "react";

export default function AdminPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  // Dados para gráficos
  const userGrowthData = [
    { month: "Jan", users: 1200, sessions: 3200 },
    { month: "Fev", users: 1350, sessions: 3800 },
    { month: "Mar", users: 1480, sessions: 4200 },
    { month: "Abr", users: 1620, sessions: 4800 },
    { month: "Mai", users: 1750, sessions: 5200 },
    { month: "Jun", users: 1900, sessions: 5800 },
  ];

  const completionData = [
    { name: "Identificação", value: 75, color: "#43085E" },
    { name: "Desenvolvimento", value: 65, color: "#6B46C1" },
    { name: "Avaliação", value: 45, color: "#8B5CF6" },
    { name: "Intervenção", value: 35, color: "#A855F7" },
    { name: "Acompanhamento", value: 25, color: "#C084FC" },
    { name: "Finalização", value: 15, color: "#DDD6FE" },
  ];

  const activityData = [
    { day: "Seg", lessons: 120, users: 85 },
    { day: "Ter", lessons: 150, users: 95 },
    { day: "Qua", lessons: 180, users: 110 },
    { day: "Qui", lessons: 160, users: 100 },
    { day: "Sex", lessons: 140, users: 90 },
    { day: "Sáb", lessons: 80, users: 60 },
    { day: "Dom", lessons: 100, users: 70 },
  ];

  const chartConfig = {
    users: {
      label: "Usuários",
      color: "hsl(var(--chart-1))",
    },
    sessions: {
      label: "Sessões",
      color: "hsl(var(--chart-2))",
    },
    lessons: {
      label: "Aulas",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Painel administrativo" subtitle="Visão geral de uso e gestão da plataforma." />

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-light-muted dark:text-dark-muted" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
                <SelectItem value="1y">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-light-muted dark:text-dark-muted" />
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Usuários</SelectItem>
                <SelectItem value="lessons">Aulas</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Usuários ativos"
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
            title="Aulas assistidas"
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
            title="Taxa de conclusão"
            value="68%"
            description="+5% vs período anterior"
            icon={<TrendingUp className="w-5 h-5" />}
            variant="info"
            trend={{
              value: 5,
              label: "vs período anterior",
              positive: true
            }}
          />
          <MetricCard
            title="Interações IA"
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

        {/* Gráficos principais */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Crescimento de usuários */}
          <ModernCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-accent" />
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Crescimento de Usuários</h2>
              </div>
              <Badge variant="outline" size="sm">Últimos 6 meses</Badge>
            </div>
            <ChartContainer config={chartConfig}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="var(--color-users)"
                  fill="var(--color-users)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stackId="2"
                  stroke="var(--color-sessions)"
                  fill="var(--color-sessions)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </ModernCard>

          {/* Conclusão por trilha */}
          <ModernCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Conclusão por Trilha</h2>
              </div>
              <Badge variant="outline" size="sm">Taxa de conclusão</Badge>
            </div>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={completionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </ModernCard>
        </div>

        {/* Atividade semanal */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          <ModernCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-accent" />
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Atividade Semanal</h2>
              </div>
              <Badge variant="outline" size="sm">Última semana</Badge>
            </div>
            <ChartContainer config={chartConfig}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="lessons" fill="var(--color-lessons)" />
                <Bar dataKey="users" fill="var(--color-users)" />
              </BarChart>
            </ChartContainer>
          </ModernCard>

          {/* Saúde do sistema */}
          <ModernCard>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-brand-accent" />
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Saúde do Sistema</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Supabase", status: "OK", icon: CheckCircle, uptime: "99.9%" },
                { name: "Storage", status: "OK", icon: CheckCircle, uptime: "99.8%" },
                { name: "OpenAI", status: "OK", icon: CheckCircle, uptime: "99.7%" },
                { name: "Resend", status: "OK", icon: CheckCircle, uptime: "99.9%" }
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-light-border/20 dark:bg-dark-border/20">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-4 h-4 text-green-500" />
                    <div>
                      <span className="text-sm font-medium text-light-text dark:text-dark-text">{service.name}</span>
                      <p className="text-xs text-light-muted dark:text-dark-muted">{service.uptime}</p>
                    </div>
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
        <ModernCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-accent" />
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Atividades Recentes</h2>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text transition-colors">
              Ver tudo
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { date: "2025-01-16 14:15", user: "admin@singulari", action: "Atualizou aula", details: "Módulo 2 / Aula 1", status: "success" },
                { date: "2025-01-16 14:12", user: "maria@exemplo.com", action: "Concluiu trilha", details: "Identificação - 100%", status: "success" },
                { date: "2025-01-16 14:08", user: "joao@exemplo.com", action: "Iniciou módulo", details: "Desenvolvimento", status: "info" },
                { date: "2025-01-16 14:05", user: "ana@exemplo.com", action: "Baixou material", details: "Guia Completo AHSD", status: "info" },
                { date: "2025-01-16 14:01", user: "carlos@exemplo.com", action: "Erro no login", details: "Tentativa falhou", status: "error" },
              ].map((activity, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{activity.date}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.details}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={activity.status === "success" ? "success" : activity.status === "error" ? "error" : "info"} 
                      size="sm"
                    >
                      {activity.status === "success" ? "Sucesso" : activity.status === "error" ? "Erro" : "Info"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModernCard>
      </Section>
    </Container>
  );
}