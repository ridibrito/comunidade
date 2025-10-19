"use client";

import { mockUser, mockTrails, mockEvents, mockProgress } from "@/data/mock/data";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ModernCard from "@/components/ui/ModernCard";
import MetricCard from "@/components/ui/MetricCard";
import ProgressCard from "@/components/ui/ProgressCard";
import Badge from "@/components/ui/Badge";
import { Users, BookOpen, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState<string>(mockUser.name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  type Kid = { id: string; name: string; avatar?: string | null; anamnese?: number; routineToday?: { done: number; total: number }; lessonsDone?: number; lastDiary?: string };
  const [children, setChildren] = useState<Kid[]>([]);
  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", uid).maybeSingle();
      if (profile?.full_name) setDisplayName(profile.full_name);
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      else if (userData.user?.user_metadata?.avatar_url) setAvatarUrl(userData.user.user_metadata.avatar_url);

      // parceiro(a): busca primeiro membro de família com relationship típico
      const { data: fams } = await supabase
        .from("family_members")
        .select("name, relationship, avatar_url")
        .eq("user_id", uid)
        .order("created_at", { ascending: true })
        .limit(1);
      if (fams && fams.length > 0) {
        setPartnerName(fams[0].name ?? null);
        setPartnerAvatarUrl(fams[0].avatar_url ?? null);
      }

      // filhos dinâmicos
      const { data: kids } = await supabase
        .from("children")
        .select("id, name, birth_date, avatar_url")
        .eq("user_id", uid);
      if (kids) {
        const mapped = kids.map((k: { id: string; name: string; avatar_url?: string | null }) => ({ id: k.id, name: k.name, avatar: k.avatar_url ?? null }));
        setChildren(mapped);
      }
    })();
  }, []);
  const progressPct = Math.round((mockProgress.completed / mockProgress.totalLessons) * 100);
  const avgAnamnese = children.length ? Math.round(children.reduce((a,c)=> a + (c.anamnese ?? 0), 0) / children.length * 100) : 0;
  const avgRoutine = children.length ? Math.round(children.reduce((a,c)=> a + ((c.routineToday?.done ?? 0) / Math.max(1,(c.routineToday?.total ?? 1))), 0) / children.length * 100) : 0;
  const diariesThisWeek = 5; // mock
  return (
    <Container>
      <Section>
        <PageHeader title="Início" subtitle={`Olá, ${displayName}. Visão geral da sua família e progresso.`} />

        {/* Família */}
        <div className="grid-12">
          <ModernCard className="col-span-12">
            <div className="grid gap-6 xl:grid-cols-[360px_1fr] items-center">
              {/* Pais/Responsáveis */}
                <div className="flex items-center gap-8">
                <div className="flex items-center -space-x-4">
                  <img src={avatarUrl ?? "/logo.png"} alt="Responsável" className="relative z-10 w-16 h-16 rounded-full object-cover border-2 border-white/80 dark:border-white/20" />
                  <img src={partnerAvatarUrl ?? "/logo.png"} alt="Parceiro(a)" className="relative z-0 w-16 h-16 rounded-full object-cover border-2 border-white/80 dark:border-white/20" />
                </div>
                <div className="ml-2">
                  <div className="text-lg font-semibold mb-1 text-light-text dark:text-dark-text">{displayName}{partnerName ? ` & ${partnerName}` : ""}</div>
                  <div className="text-sm text-light-muted dark:text-dark-muted">Família • {children.length} filho(s)</div>
                </div>
              </div>
              {/* Indicadores relevantes para os pais */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <MetricCard
                  title="Anamnese preenchida"
                  value={`${avgAnamnese}%`}
                  description="Formulários completos"
                  icon={<CheckCircle className="w-5 h-5" />}
                  variant="default"
                  trend={{
                    value: 12,
                    label: "vs. semana passada",
                    positive: true
                  }}
                />
                <MetricCard
                  title="Rotina de hoje"
                  value={`${avgRoutine}%`}
                  description="Tarefas concluídas"
                  icon={<Clock className="w-5 h-5" />}
                  variant="default"
                  trend={{
                    value: 8,
                    label: "vs. ontem",
                    positive: true
                  }}
                />
                <MetricCard
                  title="Diários desta semana"
                  value={diariesThisWeek}
                  description="Registros dos responsáveis"
                  icon={<BookOpen className="w-5 h-5" />}
                  variant="default"
                />
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Filhos */}
        <div className="section-spacing">
          <h2 className="section-title">Filhos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {children.map((c, i) => (
              <ModernCard key={i} variant="gradient" className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={c.avatar ?? "/logo.png"} 
                    alt={c.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-dark-border shadow-sm" 
                  />
                  <div>
                    <div className="font-semibold text-light-text dark:text-dark-text">{c.name}</div>
                    <Badge variant="outline" size="sm">Filho(a)</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ProgressCard
                    title="Anamnese"
                    progress={Math.round((c.anamnese ?? 0) * 100)}
                    color="success"
                    size="sm"
                    showPercentage={true}
                  />
                  
                  <ProgressCard
                    title="Rotina hoje"
                    progress={c.routineToday?.done ?? 0}
                    total={c.routineToday?.total ?? 0}
                    color="info"
                    size="sm"
                    showPercentage={true}
                  />
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/20 dark:bg-dark-border/20 shadow-sm">
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Aulas concluídas</span>
                    <Badge variant="default" size="sm">{c.lessonsDone || 0}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/20 dark:bg-dark-border/20 shadow-sm">
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Último diário</span>
                    <span className="text-xs text-light-muted dark:text-dark-muted">{c.lastDiary || "Nenhum"}</span>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>

        {/* Progresso geral */}
        <div className="section-spacing">
          <h2 className="section-title">Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <MetricCard
              title="Aulas concluídas"
              value={`${mockProgress.completed}/${mockProgress.totalLessons}`}
              description={`${progressPct}% do total`}
              icon={<BookOpen className="w-5 h-5" />}
              variant="brand"
              trend={{
                value: 15,
                label: "vs. mês passado",
                positive: true
              }}
            />
            
            <ModernCard variant="gradient" className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-accent" />
                <h4 className="font-medium text-light-text dark:text-dark-text">Próximo evento</h4>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {mockEvents[0]?.title}
                </h3>
                <p className="text-sm text-light-muted dark:text-dark-muted">
                  {mockEvents[0]?.date}
                </p>
                <Badge variant="info" size="sm">Próximo</Badge>
              </div>
            </ModernCard>
            
            <MetricCard
              title="Trilhas disponíveis"
              value={mockTrails.length}
              description="Cursos ativos"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="success"
            />
          </div>
        </div>

        <div className="section-spacing">
          <h2 className="section-title">Montanha do amanhã</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockTrails.map((trail, index) => (
              <ModernCard key={index} variant="elevated" className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-text dark:text-dark-text">{trail.title}</h3>
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                      {trail.modules.length} módulos
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-light-muted dark:text-dark-muted">Progresso</span>
                    <Badge variant="outline" size="sm">
                      {Math.round(Math.random() * 100)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-light-border/20 dark:bg-dark-border/20 rounded-full h-2 shadow-sm">
                    <div 
                      className="bg-brand-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(Math.random() * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="success" size="sm">Ativo</Badge>
                  <Badge variant="outline" size="sm">
                    {trail.modules.reduce((acc, module) => acc + module.lessons.length, 0)} aulas
                  </Badge>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      </Section>
    </Container>
  );
}


