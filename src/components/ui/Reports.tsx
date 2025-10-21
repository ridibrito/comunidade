"use client";

import React, { useState } from "react";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/Chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Play, 
  Clock, 
  Download,
  Calendar,
  Filter,
  FileText,
  Eye,
  ThumbsUp
} from "lucide-react";

interface ReportsProps {
  trails: any[];
}

export default function Reports({ trails }: ReportsProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [reportType, setReportType] = useState("engagement");

  // Dados simulados para relatórios
  const engagementData = [
    { day: "Seg", views: 120, completions: 85, avgTime: 18 },
    { day: "Ter", views: 150, completions: 95, avgTime: 22 },
    { day: "Qua", views: 180, completions: 110, avgTime: 25 },
    { day: "Qui", views: 160, completions: 100, avgTime: 20 },
    { day: "Sex", views: 140, completions: 90, avgTime: 19 },
    { day: "Sáb", views: 80, completions: 60, avgTime: 15 },
    { day: "Dom", views: 100, completions: 70, avgTime: 17 },
  ];

  const trailPerformanceData = [
    { name: "Identificação", views: 1250, completions: 980, rating: 4.8 },
    { name: "Desenvolvimento", views: 890, completions: 720, rating: 4.6 },
    { name: "Avaliação", views: 650, completions: 520, rating: 4.7 },
    { name: "Intervenção", views: 420, completions: 380, rating: 4.9 },
  ];

  const userActivityData = [
    { name: "Ativos", value: 65, color: "#43085E" },
    { name: "Moderados", value: 25, color: "#6B46C1" },
    { name: "Inativos", value: 10, color: "#8B5CF6" },
  ];

  const contentTypesData = [
    { name: "Vídeos", value: 45, color: "#43085E" },
    { name: "PDFs", value: 30, color: "#6B46C1" },
    { name: "Livros", value: 15, color: "#8B5CF6" },
    { name: "Aulas ao Vivo", value: 10, color: "#A855F7" },
  ];

  const chartConfig = {
    views: {
      label: "Visualizações",
      color: "hsl(var(--chart-1))",
    },
    completions: {
      label: "Conclusões",
      color: "hsl(var(--chart-2))",
    },
    avgTime: {
      label: "Tempo Médio",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  // Métricas calculadas
  const metrics = {
    totalViews: 1580,
    totalCompletions: 1240,
    completionRate: 78.5,
    avgEngagementTime: 19.4,
    activeUsers: 285,
    totalContent: 156,
    avgRating: 4.7
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Relatórios e Métricas</h2>
          <p className="text-light-muted dark:text-dark-muted">Acompanhe o desempenho do conteúdo e engajamento dos usuários</p>
        </div>
        
        <div className="flex gap-3">
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
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engajamento</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="content">Conteúdo</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{metrics.totalViews.toLocaleString()}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Total de Visualizações</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{metrics.completionRate}%</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Taxa de Conclusão</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{metrics.avgEngagementTime}min</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Tempo Médio</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-light-text dark:text-dark-text">{metrics.activeUsers}</div>
              <div className="text-xs text-light-muted dark:text-dark-muted">Usuários Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engajamento semanal */}
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Engajamento Semanal</h3>
            <Badge variant="outline" size="sm">Última semana</Badge>
          </div>
          <ChartContainer config={chartConfig}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stackId="1"
                stroke="var(--color-views)"
                fill="var(--color-views)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="completions"
                stackId="2"
                stroke="var(--color-completions)"
                fill="var(--color-completions)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Performance das trilhas */}
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Performance das Trilhas</h3>
            <Badge variant="outline" size="sm">Últimos 30 dias</Badge>
          </div>
          <ChartContainer config={chartConfig}>
            <BarChart data={trailPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" />
              <Bar dataKey="completions" fill="var(--color-completions)" />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Atividade dos usuários */}
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Atividade dos Usuários</h3>
            <Badge variant="outline" size="sm">Distribuição</Badge>
          </div>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={userActivityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {userActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Tipos de conteúdo */}
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Tipos de Conteúdo</h3>
            <Badge variant="outline" size="sm">Distribuição</Badge>
          </div>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={contentTypesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {contentTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* Tabela de métricas detalím
        <div className="bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-6">Métricas Detalhadas por Trilha</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Trilha</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Visualizações</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Conclusões</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Taxa</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Avaliação</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {trailPerformanceData.map((trail, index) => (
                  <tr key={index} className="border-b border-light-border/50 dark:border-dark-border/50">
                    <td className="py-3 text-light-text dark:text-dark-text font-medium">{trail.name}</td>
                    <td className="py-3 text-light-text dark:text-dark-text">{trail.views.toLocaleString()}</td>
                    <td className="py-3 text-light-text dark:text-dark-text">{trail.completions.toLocaleString()}</td>
                    <td className="py-3 text-light-text dark:text-dark-text">
                      {((trail.completions / trail.views) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-light-text dark:text-dark-text">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-yellow-500" />
                        {trail.rating}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={trail.rating >= 4.7 ? "success" : trail.rating >= 4.5 ? "warning" : "error"} 
                        size="sm"
                      >
                        {trail.rating >= 4.7 ? "Excelente" : trail.rating >= 4.5 ? "Bom" : "Regular"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
