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

export default function Reports({ trails = [] }: ReportsProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  // Dados mock para os gráficos
  const userGrowthData = [
    { name: "Jan", users: 120, sessions: 240 },
    { name: "Fev", users: 150, sessions: 300 },
    { name: "Mar", users: 180, sessions: 360 },
    { name: "Abr", users: 220, sessions: 440 },
    { name: "Mai", users: 280, sessions: 560 },
    { name: "Jun", users: 320, sessions: 640 },
  ];

  const completionData = [
    { name: "Montanha do Amanhã", value: 85, color: "#43085E" },
    { name: "Acervo Digital", value: 72, color: "#6B46C1" },
    { name: "Rodas de Conversa", value: 68, color: "#8B5CF6" },
    { name: "Plantão de Dúvidas", value: 91, color: "#A855F7" },
  ];

  const activityData = [
    { day: "Seg", lessons: 45, discussions: 23 },
    { day: "Ter", lessons: 52, discussions: 31 },
    { day: "Qua", lessons: 38, discussions: 19 },
    { day: "Qui", lessons: 61, discussions: 42 },
    { day: "Sex", lessons: 48, discussions: 28 },
    { day: "Sáb", lessons: 35, discussions: 15 },
    { day: "Dom", lessons: 28, discussions: 12 },
  ];

  const chartConfig = {
    users: {
      label: "Usuários",
      color: "#43085E",
    },
    sessions: {
      label: "Sessões",
      color: "#6B46C1",
    },
  };

  const metrics = [
    {
      title: "Usuários Ativos",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Aulas Concluídas",
      value: "8,456",
      change: "+8.2%",
      trend: "up",
      icon: Play,
    },
    {
      title: "Tempo Médio",
      value: "2h 34min",
      change: "+5.1%",
      trend: "up",
      icon: Clock,
    },
    {
      title: "Taxa de Conclusão",
      value: "78.5%",
      change: "+2.3%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const topTrails = [
    { name: "Montanha do Amanhã", completion: 85, users: 234, rating: 4.8 },
    { name: "Acervo Digital", completion: 72, users: 189, rating: 4.6 },
    { name: "Rodas de Conversa", completion: 68, users: 156, rating: 4.4 },
    { name: "Plantão de Dúvidas", completion: 91, users: 298, rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="sessions">Sessões</SelectItem>
              <SelectItem value="completion">Conclusão</SelectItem>
              <SelectItem value="engagement">Engajamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {metric.value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </p>
                </div>
                <div className="p-3 bg-brand-accent/10 rounded-lg">
                  <Icon className="w-6 h-6 text-brand-accent" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento de Usuários */}
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            Crescimento de Usuários
          </h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#43085E"
                fill="#43085E"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Conclusão por Trilha */}
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            Taxa de Conclusão por Trilha
          </h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* Atividade Semanal */}
      <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Atividade Semanal
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="lessons" fill="#43085E" name="Aulas" />
            <Bar dataKey="discussions" fill="#6B46C1" name="Discussões" />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Performance das Trilhas */}
      <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Performance das Trilhas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-light-text dark:text-dark-text">
                  Trilha
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-light-text dark:text-dark-text">
                  Usuários
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-light-text dark:text-dark-text">
                  Conclusão
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-light-text dark:text-dark-text">
                  Avaliação
                </th>
              </tr>
            </thead>
            <tbody>
              {topTrails.map((trail, index) => (
                <tr key={index} className="border-b border-light-border dark:border-dark-border">
                  <td className="py-3 px-4 text-sm text-light-text dark:text-dark-text">
                    {trail.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-light-text dark:text-dark-text">
                    {trail.users}
                  </td>
                  <td className="py-3 px-4 text-sm text-light-text dark:text-dark-text">
                    {trail.completion}%
                  </td>
                  <td className="py-3 px-4 text-sm">
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