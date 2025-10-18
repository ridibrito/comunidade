'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Carousel from "@/components/ui/Carousel";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { Users, MessageCircle, Calendar, Clock, Play, Video } from "lucide-react";

export default function RodasDeConversaPage() {
  // Próximos eventos (ao vivo via Zoom)
  const upcomingEvents = [
    {
      title: "Desafios da Educação AHSD",
      description: "Compartilhe experiências sobre educação de crianças superdotadas",
      facilitator: "Maria Eduarda",
      date: "2024-01-16",
      time: "19:30",
      participants: 15,
      maxParticipants: 20,
      status: "Aberta",
      topic: "Educação",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/123456789"
    },
    {
      title: "Rotinas e Organização Familiar",
      description: "Como estruturar o dia a dia com crianças AHSD",
      facilitator: "Ana Paula",
      date: "2024-01-19",
      time: "20:00",
      participants: 12,
      maxParticipants: 15,
      status: "Aberta",
      topic: "Família",
      image: "https://images.unsplash.com/photo-1523246191891-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/987654321"
    },
    {
      title: "Criatividade e Inovação",
      description: "Desenvolvendo o potencial criativo das crianças",
      facilitator: "Roberta Silva",
      date: "2024-01-21",
      time: "19:00",
      participants: 8,
      maxParticipants: 12,
      status: "Aberta",
      topic: "Criatividade",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      zoomLink: "https://zoom.us/j/456789123"
    }
  ];

  // Eventos passados (com gravações disponíveis)
  const pastEvents = [
    {
      title: "Desenvolvimento Socioemocional",
      description: "Conversa sobre inteligência emocional e relacionamentos",
      facilitator: "Carlos Mendes",
      date: "2024-01-14",
      time: "18:30",
      participants: 20,
      maxParticipants: 20,
      status: "Realizada",
      topic: "Desenvolvimento",
      image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/desenvolvimento-socioemocional.mp4",
      duration: "1h 25min"
    },
    {
      title: "Atividades Extracurriculares",
      description: "Explorando hobbies e interesses específicos",
      facilitator: "João Pedro",
      date: "2024-01-10",
      time: "18:00",
      participants: 16,
      maxParticipants: 20,
      status: "Realizada",
      topic: "Atividades",
      image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/atividades-extracurriculares.mp4",
      duration: "1h 15min"
    },
    {
      title: "Primeiros Passos com AHSD",
      description: "Introdução para famílias recém-diagnosticadas",
      facilitator: "Dr. Ana Costa",
      date: "2024-01-07",
      time: "19:00",
      participants: 25,
      maxParticipants: 25,
      status: "Realizada",
      topic: "Introdução",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/primeiros-passos-ahsd.mp4",
      duration: "1h 45min"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta": return "success";
      case "Lotada": return "warning";
      case "Realizada": return "info";
      case "Encerrada": return "default";
      default: return "default";
    }
  };

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case "Educação": return "info";
      case "Família": return "brand";
      case "Desenvolvimento": return "success";
      case "Criatividade": return "warning";
      case "Atividades": return "default";
      case "Introdução": return "brand";
      default: return "default";
    }
  };

  return (
    <Container>
      <Section>
        <PageHeader title="Rodas de conversa" />
        
        <div className="space-y-12">
          {/* Próximos Eventos */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                Próximos Eventos
              </h2>
              <Badge variant="success" size="md">{upcomingEvents.length} eventos</Badge>
            </div>
            
            <Carousel cardWidth={320} gap={24}>
              {upcomingEvents.map((event, idx) => (
                <ModernCard key={idx} variant="elevated" className="h-full space-y-4">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant={getStatusColor(event.status) as any} size="sm">{event.status}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={getTopicColor(event.topic) as any} size="sm">{event.topic}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                        <Users className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">{event.participants}/{event.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">{event.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <MessageCircle className="w-3 h-3" />
                        <span>Facilitador: {event.facilitator}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline" size="sm">
                        {event.participants} participantes
                      </Badge>
                      <button 
                        onClick={() => window.open(event.zoomLink, '_blank')}
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

          {/* Eventos Passados */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                Eventos Passados
              </h2>
              <Badge variant="info" size="md">{pastEvents.length} gravações</Badge>
            </div>
            
            <Carousel cardWidth={320} gap={24}>
              {pastEvents.map((event, idx) => (
                <ModernCard key={idx} variant="elevated" className="h-full space-y-4">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-border">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant={getStatusColor(event.status) as any} size="sm">{event.status}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={getTopicColor(event.topic) as any} size="sm">{event.topic}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-dark-surface/90 rounded px-2 py-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">{event.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-muted">{event.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <MessageCircle className="w-3 h-3" />
                        <span>Facilitador: {event.facilitator}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline" size="sm">
                        {event.participants} participantes
                      </Badge>
                      <button 
                        onClick={() => window.open(event.recordingUrl, '_blank')}
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


