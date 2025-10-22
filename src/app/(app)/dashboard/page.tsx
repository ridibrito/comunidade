"use client";

import { mockUser, mockTrails, mockEvents, mockProgress } from "@/data/mock/data";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
// import Card from "@/components/ui/Card";
import ModernCard from "@/components/ui/ModernCard";
import MetricCard from "@/components/ui/MetricCard";
import ProgressCard from "@/components/ui/ProgressCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { BookOpen, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function DashboardPage() {
  const { push } = useToast();
  const [displayName, setDisplayName] = useState<string>(mockUser.name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  type Kid = { id: string; name: string; avatar?: string | null; anamnese?: number; routineToday?: { done: number; total: number }; lessonsDone?: number; lastDiary?: string };
  const [children, setChildren] = useState<Kid[]>([]);
  const [selectedChild, setSelectedChild] = useState<Kid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Verificar se há erro de acesso negado
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'access_denied') {
      push({
        title: "Acesso Negado",
        message: "Você não tem permissão para acessar a área administrativa. Apenas administradores podem acessar essa área.",
        variant: "error"
      });
      // Limpar o parâmetro da URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [push]);

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

  // Funções determinísticas para evitar hydration mismatch (sem Math.random no render)
  function hashStringToInt(input: string, seed = 0): number {
    let hash = 2166136261 ^ seed;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      // FNV-1a like
      hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
    }
    return hash >>> 0;
  }

  function deterministicPercent(label: string, index: number): number {
    const h = hashStringToInt(`${label}#${index}`, 1337);
    return h % 101; // 0..100
  }
  const avgAnamnese = children.length ? Math.round(children.reduce((a,c)=> a + (c.anamnese ?? 0), 0) / children.length * 100) : 0;
  const avgRoutine = children.length ? Math.round(children.reduce((a,c)=> a + ((c.routineToday?.done ?? 0) / Math.max(1,(c.routineToday?.total ?? 1))), 0) / children.length * 100) : 0;
  const diariesThisWeek = 5; // mock

  const openChildDetails = (child: Kid) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChild(null);
  };
  return (
    <Container>
      <Section>
        <PageHeader title={`Bem-vindo, ${displayName}!`} subtitle="Visão geral da sua família e progresso." />

        {/* Card da Família */}
        <div className="grid-12">
          <div className="col-span-12">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900/30 dark:via-purple-800/20 dark:to-dark-surface border border-light-border/20 dark:border-dark-border/20 shadow-xl">
              <div className="relative p-8">
                <div className="grid gap-8 lg:grid-cols-2 items-center">
                  {/* Lado Esquerdo - Família */}
                  <div className="space-y-6">
                    {/* Informações dos Pais */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center -space-x-4">
                        <img src={avatarUrl ?? "/logo.png"} alt="Responsável" className="relative z-10 w-20 h-20 rounded-full object-cover border-3 border-white/90 dark:border-white/30 shadow-lg" />
                        <img src={partnerAvatarUrl ?? "/logo.png"} alt="Parceiro(a)" className="relative z-0 w-20 h-20 rounded-full object-cover border-3 border-white/90 dark:border-white/30 shadow-lg" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
                          {displayName.split(' ')[0]}{partnerName ? ` & ${partnerName.split(' ')[0]}` : ""}
                        </div>
                        <div className="text-base text-light-muted dark:text-dark-muted">Família • {children.length} filho(s)</div>
                        <div className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium">Jornada do Amanhã</div>
                      </div>
                    </div>
                    
                    {/* Informações dos Filhos */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Filhos</h3>
                      <div className="flex items-center gap-3">
                        {children.map((child, index) => (
                          <div 
                            key={index} 
                            onClick={() => openChildDetails(child)}
                            className="relative cursor-pointer hover:scale-110 transition-transform duration-200"
                          >
                            <img 
                              src={child.avatar ?? "/logo.png"} 
                              alt={child.name} 
                              className="w-16 h-16 rounded-full object-cover border-3 border-white/90 dark:border-white/30 shadow-lg" 
                            />
                            {/* Tooltip com nome */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {child.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Lado Direito - Métricas */}
                  <div className="flex items-center">
                    {/* Métricas de Progresso */}
                    <div className="space-y-3 w-full">
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Métricas de Progresso</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm rounded-lg border border-light-border/5 dark:border-dark-border/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-light-text dark:text-dark-text">Anamnese</span>
                            </div>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{avgAnamnese}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${avgAnamnese}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="p-3 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm rounded-lg border border-light-border/5 dark:border-dark-border/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-light-text dark:text-dark-text">Rotina</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{avgRoutine}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${avgRoutine}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="p-3 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm rounded-lg border border-light-border/5 dark:border-dark-border/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-light-text dark:text-dark-text">Diários</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{diariesThisWeek}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(diariesThisWeek * 20, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

        {/* Trilhas de Aprendizado */}
        <div className="section-spacing">
          <h2 className="section-title">Trilhas de Aprendizado</h2>
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
                      {deterministicPercent(trail.title, index)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-light-border/20 dark:bg-dark-border/20 rounded-full h-2 shadow-sm">
                    <div 
                      className="bg-brand-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${deterministicPercent(trail.title + ':bar', index)}%` }}
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

      {/* Modal de Detalhes do Filho */}
      {selectedChild && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">Detalhes - {selectedChild.name}</h2>
            <div className="space-y-6">
            {/* Header do Filho */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl">
              <img 
                src={selectedChild.avatar ?? "/logo.png"} 
                alt={selectedChild.name} 
                className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-dark-border shadow-lg" 
              />
              <div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{selectedChild.name}</h3>
                <p className="text-light-muted dark:text-dark-muted">Progresso e evolução</p>
              </div>
            </div>

            {/* Métricas de Progresso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProgressCard
                title="Anamnese"
                progress={Math.round((selectedChild.anamnese ?? 0) * 100)}
                color="success"
                size="md"
                showPercentage={true}
                description="Formulários de avaliação completados"
              />
              
              <ProgressCard
                title="Rotina de Hoje"
                progress={selectedChild.routineToday?.done ?? 0}
                total={selectedChild.routineToday?.total ?? 0}
                color="info"
                size="md"
                showPercentage={true}
                description="Tarefas diárias concluídas"
              />
            </div>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-light-text dark:text-dark-text">Aulas Concluídas</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedChild.lessonsDone || 0}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-light-text dark:text-dark-text">Último Diário</div>
                    <div className="text-sm text-light-muted dark:text-dark-muted">{selectedChild.lastDiary || "Nenhum"}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-light-text dark:text-dark-text">Progresso Geral</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.round((((selectedChild.anamnese ?? 0) + ((selectedChild.routineToday?.done ?? 0) / Math.max(1, selectedChild.routineToday?.total ?? 1))) / 2) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Atividades */}
            <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
              <h4 className="font-semibold text-light-text dark:text-dark-text mb-3">Atividades Recentes</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-light-border/10 dark:bg-dark-border/10 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-light-text dark:text-dark-text">Anamnese atualizada</div>
                    <div className="text-xs text-light-muted dark:text-dark-muted">Há 2 dias</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-light-border/10 dark:bg-dark-border/10 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-light-text dark:text-dark-text">Aula concluída</div>
                    <div className="text-xs text-light-muted dark:text-dark-muted">Ontem</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-light-border/10 dark:bg-dark-border/10 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-light-text dark:text-dark-text">Rotina diária completada</div>
                    <div className="text-xs text-light-muted dark:text-dark-muted">Hoje</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}


