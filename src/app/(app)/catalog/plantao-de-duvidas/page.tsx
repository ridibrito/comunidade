'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Carousel from "@/components/ui/Carousel";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { MessageCircle, Clock, Users, Calendar, Play, Video } from "lucide-react";

export default function DoubtsPage() {
  // Próximas sessões (ao vivo via Zoom)
  const upcomingSessions = [
    {
      title: "Desenvolvimento Cognitivo",
      description: "Tire suas dúvidas sobre estimulação intelectual",
      expert: "Dr. Maria Silva",
      date: "2024-01-15",
      time: "19:00",
      participants: 24,
      maxParticipants: 30,
      status: "Agendada",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/111222333"
    },
    {
      title: "Aspectos Socioemocionais",
      description: "Conversa sobre inteligência emocional e relacionamentos",
      expert: "Psicóloga Ana Costa",
      date: "2024-01-18",
      time: "20:00",
      participants: 18,
      maxParticipants: 25,
      status: "Agendada",
      image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/444555666"
    },
    {
      title: "Criatividade e Inovação",
      description: "Desenvolvendo o potencial criativo das crianças",
      expert: "Prof. Roberto Lima",
      date: "2024-01-20",
      time: "19:30",
      participants: 12,
      maxParticipants: 20,
      status: "Disponível",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/777888999"
    }
  ];

  // Sessões passadas (com gravações disponíveis)
  const pastSessions = [
    {
      title: "Rotinas e Organização",
      description: "Estratégias para estruturar o dia a dia",
      expert: "Pedagoga Carla Santos",
      date: "2024-01-12",
      time: "18:30",
      participants: 30,
      maxParticipants: 30,
      status: "Realizada",
      image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/rotinas-organizacao.mp4",
      duration: "1h 30min"
    },
    {
      title: "Desenvolvimento Motor",
      description: "Atividades físicas e coordenação motora",
      expert: "Fisioterapeuta João Oliveira",
      date: "2024-01-08",
      time: "18:00",
      participants: 15,
      maxParticipants: 20,
      status: "Realizada",
      image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/desenvolvimento-motor.mp4",
      duration: "1h 20min"
    },
    {
      title: "Primeira Consulta AHSD",
      description: "Orientações iniciais para famílias",
      expert: "Dr. Carlos Mendes",
      date: "2024-01-05",
      time: "19:00",
      participants: 22,
      maxParticipants: 25,
      status: "Realizada",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/primeira-consulta-ahsd.mp4",
      duration: "1h 40min"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível": return "success";
      case "Agendada": return "info";
      case "Realizada": return "info";
      case "Lotada": return "warning";
      default: return "default";
    }
  };

  return (
    <Container>
      <Section>
        <PageHeader title="Plantão de dúvidas" />
        
        <div className="space-y-12">
          {/* Próximas Sessões */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                Próximas Sessões
              </h2>
              <Badge variant="success" size="md">{upcomingSessions.length} sessões</Badge>
            </div>
            
            <Carousel cardWidth={320} gap={24}>
              {upcomingSessions.map((session, idx) => (
                <ModernCard key={idx} variant="elevated" className="h-full space-y-4">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                      <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant={getStatusColor(session.status) as any} size="sm">{session.status}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                        <Users className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">{session.participants}/{session.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">{session.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <MessageCircle className="w-3 h-3" />
                        <span>{session.expert}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(session.date).toLocaleDateString('pt-BR')} às {session.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline" size="sm">
                        {session.participants} participantes
                      </Badge>
                      <button 
                        onClick={() => window.open(session.zoomLink, '_blank')}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Entrar no Zoom
                      </button>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </Carousel>
          </div>

          {/* Sessões Passadas */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                Sessões Passadas
              </h2>
              <Badge variant="info" size="md">{pastSessions.length} gravações</Badge>
            </div>
            
            <Carousel cardWidth={320} gap={24}>
              {pastSessions.map((session, idx) => (
                <ModernCard key={idx} variant="elevated" className="h-full space-y-4">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                      <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant={getStatusColor(session.status) as any} size="sm">{session.status}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">{session.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">{session.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <MessageCircle className="w-3 h-3" />
                        <span>{session.expert}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(session.date).toLocaleDateString('pt-BR')} às {session.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline" size="sm">
                        {session.participants} participantes
                      </Badge>
                      <button 
                        onClick={() => window.open(session.recordingUrl, '_blank')}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Assistir
                      </button>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </Carousel>
          </div>
        </div>
      </Section>
    </Container>
  );
}


