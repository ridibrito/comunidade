"use client";

import { mockUser, mockTrails, mockEvents, mockProgress } from "@/data/mock/data";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

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
          <Card className="col-span-12">
            <div className="grid gap-6 xl:grid-cols-[360px_1fr] items-center">
              {/* Pais/Responsáveis */}
                <div className="flex items-center gap-8">
                <div className="flex items-center -space-x-4">
                  <img src={avatarUrl ?? "/logo.png"} alt="Responsável" className="relative z-10 w-16 h-16 rounded-full object-cover border-2 border-white/80 dark:border-white/20" />
                  <img src={partnerAvatarUrl ?? "/logo.png"} alt="Parceiro(a)" className="relative z-0 w-16 h-16 rounded-full object-cover border-2 border-white/80 dark:border-white/20" />
                </div>
                <div className="ml-2">
                  <div className="text-lg font-semibold mb-1">{displayName}{partnerName ? ` & ${partnerName}` : ""}</div>
                  <div className="text-sm opacity-70">Família • {children.length} filho(s)</div>
                </div>
              </div>
              {/* Indicadores relevantes para os pais */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-sm opacity-70">Anamnese preenchida</div>
                  <div className="mt-2 text-2xl font-semibold">{avgAnamnese}%</div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--hover)]">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${avgAnamnese}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-sm opacity-70">Rotina de hoje</div>
                  <div className="mt-2 text-2xl font-semibold">{avgRoutine}%</div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--hover)]">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${avgRoutine}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-sm opacity-70">Diários nesta semana</div>
                  <div className="mt-2 text-2xl font-semibold">{diariesThisWeek}</div>
                  <div className="text-xs opacity-70 mt-1">Registros feitos pelos responsáveis</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filhos */}
        <div className="section-spacing">
          <h2 className="section-title">Filhos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {children.map((c, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3">
                  <img src={c.avatar ?? "/logo.png"} alt={c.name} className="w-14 h-14 rounded-full object-cover border border-[var(--border)]" />
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm opacity-70">Filho(a)</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  <a href="/profile/anamnese" className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--hover)]">
                    <span>Anamnese</span>
                    <span className="font-medium">{Math.round((c.anamnese ?? 0) * 100)}%</span>
                  </a>
                  <a href="/profile/rotina" className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--hover)]">
                    <span>Rotina hoje</span>
                    <span className="font-medium">{c.routineToday?.done ?? 0}/{c.routineToday?.total ?? 0}</span>
                  </a>
                  <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <span>Aulas concluídas</span>
                    <span className="font-medium">{c.lessonsDone}</span>
                  </div>
                  <a href="/profile/diario" className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--hover)]">
                    <span>Último diário</span>
                    <span className="font-medium">{c.lastDiary}</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Progresso geral */}
        <div className="section-spacing">
          <h2 className="section-title">Progresso</h2>
          <div className="grid-12">
            <Card className="col-span-12 xl:col-span-4 min-h-[220px]">
              <div className="text-sm opacity-70">Aulas concluídas</div>
              <div className="mt-2 text-3xl font-semibold">{mockProgress.completed}/{mockProgress.totalLessons}</div>
              <div className="mt-4 h-2 w-full rounded-full bg-[var(--hover)]">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${progressPct}%` }} />
              </div>
            </Card>
            <Card className="col-span-12 xl:col-span-4 min-h-[220px]">
              <div className="text-sm opacity-70">Próximo evento</div>
              <div className="mt-2 text-lg">{mockEvents[0]?.title}</div>
              <div className="text-xs opacity-70">{mockEvents[0]?.date}</div>
            </Card>
            <Card className="col-span-12 xl:col-span-4 min-h-[220px]">
              <div className="text-sm opacity-70">Trilhas disponíveis</div>
              <div className="mt-2 text-3xl font-semibold">{mockTrails.length}</div>
            </Card>
          </div>
        </div>

        <div className="section-spacing">
          <h2 className="section-title">Montanha do amanhã</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <Card>Trilha de Introdução</Card>
            <Card>Trilha Avançada</Card>
            <Card>Trilha Extra</Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}


