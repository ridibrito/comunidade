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
      originalTime: "19:00",
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
      instructor: "Dr. Ana Costa",
      originalDate: "2024-01-07",
      originalTime: "19:00",
      participants: 25,
      maxParticipants: 25,
      status: "Realizada",
      topic: "Introdução",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600&auto=format&fit=crop",
      recordingUrl: "/recordings/primeiros-passos-ahsd.mp4",
      duration: "1h 45min",
      progress: 0,
      rating: 4.8
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
    <Container fullWidth>
      <Section>
        <PageHeader title="Rodas de conversa" />
        
        <div className="space-y-12">
          {/* Próximos Eventos */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                  Próximos Eventos
                </h2>
                <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                  Rodas de conversa com outros pais e especialistas
                </p>
              </div>
              <Badge variant="success" size="md">{upcomingEvents.length} eventos</Badge>
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
                  {upcomingEvents.map((event, idx) => (
                    <CarouselItem key={idx} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                      <CardAulaAoVivo
                        title={event.title}
                        description={event.description}
                        instructor={event.instructor || event.facilitator}
                        originalDate={event.originalDate || event.date}
                        originalTime={event.originalTime || event.time}
                        duration={event.duration || "1h 30min"}
                        participants={event.participants}
                        maxParticipants={event.maxParticipants}
                        progress={event.progress || 0}
                        rating={event.rating}
                        image={event.image}
                        recordingUrl={event.recordingUrl || event.zoomLink}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Eventos Passados */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                  Eventos Passados
                </h2>
                <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                  Gravações das rodas de conversa anteriores
                </p>
              </div>
              <Badge variant="info" size="md">{pastEvents.length} gravações</Badge>
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
                  {pastEvents.map((event, idx) => (
                    <CarouselItem key={idx} className="pl-2 sm:pl-4 basis-[280px] sm:basis-[320px] lg:basis-[350px]">
                      <CardAulaAoVivo
                        title={event.title}
                        description={event.description}
                        instructor={event.instructor || event.facilitator}
                        originalDate={event.originalDate || event.date}
                        originalTime={event.originalTime || event.time}
                        duration={event.duration || "1h 30min"}
                        participants={event.participants}
                        maxParticipants={event.maxParticipants}
                        progress={event.progress || 0}
                        rating={event.rating}
                        image={event.image}
                        recordingUrl={event.recordingUrl}
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


