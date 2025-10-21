'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { CardAulaAoVivo } from "@/components/ui/CardModels";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/CarouselNew";

export default function DoubtsPage() {
  // Próximas sessões (ao vivo via Zoom)
  const upcomingSessions = [
    {
      title: "Desenvolvimento Cognitivo",
      description: "Tire suas dúvidas sobre estimulação intelectual",
      instructor: "Dr. Maria Silva",
      originalDate: "2024-01-15",
      originalTime: "19:00",
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
      originalTime: "19:00",
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
    <Container fullWidth>
      <Section>
        <PageHeader title="Plantão de dúvidas" />
        
        <div className="space-y-12">
          {/* Próximas Sessões */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                  Próximas Sessões
                </h2>
                <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                  Sessões ao vivo com especialistas para tirar suas dúvidas
                </p>
              </div>
              <Badge variant="success" size="md">{upcomingSessions.length} sessões</Badge>
            </div>
            
            <div className="relative pt-8 pb-0">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  slidesToScroll: 1,
                  dragFree: true,
                  containScroll: "trimSnaps",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {upcomingSessions.map((session, idx) => (
                    <CarouselItem key={idx} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                      <CardAulaAoVivo
                        title={session.title}
                        description={session.description}
                        instructor={session.instructor || session.expert}
                        originalDate={session.originalDate || session.date}
                        originalTime={session.originalTime || session.time}
                        duration={session.duration || "1h 30min"}
                        participants={session.participants}
                        maxParticipants={session.maxParticipants}
                        progress={session.progress || 0}
                        rating={session.rating}
                        image={session.image}
                        recordingUrl={session.recordingUrl || session.zoomLink}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Sessões Passadas */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                  Sessões Passadas
                </h2>
                <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                  Gravações das sessões anteriores disponíveis para assistir
                </p>
              </div>
              <Badge variant="info" size="md">{pastSessions.length} gravações</Badge>
            </div>
            
            <div className="relative pt-8 pb-0">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  slidesToScroll: 1,
                  dragFree: true,
                  containScroll: "trimSnaps",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {pastSessions.map((session, idx) => (
                    <CarouselItem key={idx} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                      <CardAulaAoVivo
                        title={session.title}
                        description={session.description}
                        instructor={session.instructor || session.expert}
                        originalDate={session.originalDate || session.date}
                        originalTime={session.originalTime || session.time}
                        duration={session.duration || "1h 30min"}
                        participants={session.participants}
                        maxParticipants={session.maxParticipants}
                        progress={session.progress || 0}
                        rating={session.rating}
                        image={session.image}
                        recordingUrl={session.recordingUrl}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}


