"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
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

export default function AdminPage() {
  const supabase = getBrowserSupabaseClient();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");
  const [loading, setLoading] = useState(true);
  
  // Estados para dados reais
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    totalModules: 0,
    totalTrails: 0,
    completionRate: 0,
    aiInteractions: 0
  });
  
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  async function loadDashboardData() {
    setLoading(true);
    
    try {
      // Carregar estatísticas básicas
      const [trailsResult, modulesResult, lessonsResult, usersResult] = await Promise.all([
        supabase.from('trails').select('id', { count: 'exact' }),
        supabase.from('modules').select('id', { count: 'exact' }),
        supabase.from('contents').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalLessons: lessonsResult.count || 0,
        totalModules: modulesResult.count || 0,
        totalTrails: trailsResult.count || 0,
        completionRate: 68, // Mock por enquanto
        aiInteractions: 4317 // Mock por enquanto
      });

      // Carregar dados de conclusão por trilha
      const { data: trails } = await supabase
        .from('trails')
        .select('id, title');
      
      if (trails) {
        const completionPromises = trails.map(async (trail) => {
          const { count } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact' })
            .eq('trail_id', trail.id)
            .eq('progress_type', 'completed');
          
          return {
            name: trail.title,
            value: Math.floor(Math.random() * 100), // Mock por enquanto
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
          };
        });
        
        const completionResults = await Promise.all(completionPromises);
        setCompletionData(completionResults);
      }

      // Carregar atividades recentes
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentActivities(activities || []);

      // Dados de crescimento (mock por enquanto)
      setUserGrowthData([
        { month: "Jan", users: 1200, sessions: 3200 },
        { month: "Fev", users: 1350, sessions: 3800 },
        { month: "Mar", users: 1480, sessions: 4200 },
        { month: "Abr", users: 1620, sessions: 4800 },
        { month: "Mai", users: 1750, sessions: 5200 },
        { month: "Jun", users: 1900, sessions: 5800 },
      ]);

      // Dados de atividade semanal (mock por enquanto)
      setActivityData([
        { day: "Seg", lessons: 120, users: 85 },
        { day: "Ter", lessons: 150, users: 95 },
        { day: "Qua", lessons: 180, users: 110 },
        { day: "Qui", lessons: 160, users: 100 },
        { day: "Sex", lessons: 140, users: 90 },
        { day: "Sáb", lessons: 80, users: 60 },
        { day: "Dom", lessons: 100, users: 70 },
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

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
            value={loading ? "..." : stats.totalUsers.toLocaleString()}
            description="Usuários cadastrados"
            icon={<Users className="w-5 h-5" />}
            variant="default"
            trend={{
              value: 8,
              label: "vs período anterior",
              positive: true
            }}
          />
          <MetricCard
            title="Aulas disponíveis"
            value={loading ? "..." : stats.totalLessons.toLocaleString()}
            description={`${stats.totalModules} módulos`}
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
            value={loading ? "..." : `${stats.completionRate}%`}
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
            value={loading ? "..." : stats.aiInteractions.toLocaleString()}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando atividades...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : recentActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-light-muted dark:text-dark-muted">
                    Nenhuma atividade recente
                  </TableCell>
                </TableRow>
              ) : (
                recentActivities.map((activity, i) => (
                  <TableRow key={activity.id || i}>
                    <TableCell className="font-medium">
                      {new Date(activity.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {activity.user_id ? `Usuário ${activity.user_id.slice(0, 8)}...` : 'Sistema'}
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>
                      {activity.resource_type ? `${activity.resource_type}: ${activity.resource_id?.slice(0, 8)}...` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="info" size="sm">
                        Info
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ModernCard>
      </Section>
    </Container>
  );
}