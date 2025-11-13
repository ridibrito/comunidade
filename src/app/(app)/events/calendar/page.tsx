"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ModernCard from "@/components/ui/ModernCard";
import { Calendar, Clock, Video, Bell, AlertCircle, ChevronLeft, ChevronRight, User, MapPin } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  date: Date;
  time: string;
  type: 'live' | 'webinar' | 'encontro' | 'outro';
  zoomLink?: string;
  status: 'upcoming' | 'completed';
  instructor?: string;
  duration?: string;
  location?: string;
}

export default function EventsCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  // Mock de eventos - substituir por chamada à API quando disponível
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Exemplo de eventos agendados - distribuídos ao longo do mês
    const mockEvents: Event[] = [
      // Eventos próximos (esta semana)
      {
        id: '1',
        title: 'Roda de Conversa: Ansiedade na Infância',
        description: 'Discussão sobre estratégias para lidar com ansiedade em crianças AHSD. Venha compartilhar experiências e aprender com outras famílias.',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        date: new Date(currentYear, currentMonth, today.getDate() + 2),
        time: '19:00',
        type: 'live',
        zoomLink: '#',
        status: 'upcoming',
        instructor: 'Dra. Maria Silva',
        duration: '1h 30min',
        location: 'Online - Zoom'
      },
      {
        id: '2',
        title: 'Plantão de Dúvidas - Janeiro',
        description: 'Espaço para tirar dúvidas sobre desenvolvimento infantil, educação e estratégias para crianças com altas habilidades.',
        image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
        date: new Date(currentYear, currentMonth, today.getDate() + 5),
        time: '20:00',
        type: 'webinar',
        zoomLink: '#',
        status: 'upcoming',
        instructor: 'Equipe Pedagógica',
        duration: '1h',
        location: 'Online - Zoom'
      },
      {
        id: '3',
        title: 'Workshop: Rotinas para Crianças AHSD',
        description: 'Como criar rotinas eficazes para crianças com altas habilidades. Estratégias práticas e personalizadas.',
        date: new Date(currentYear, currentMonth, today.getDate() + 7),
        time: '19:30',
        type: 'encontro',
        zoomLink: '#',
        status: 'upcoming'
      },
      // Mais eventos ao longo do mês
      {
        id: '4',
        title: 'Live: Identificação Precoce de AHSD',
        description: 'Aprenda a identificar sinais de altas habilidades em crianças pequenas.',
        date: new Date(currentYear, currentMonth, today.getDate() + 10),
        time: '18:30',
        type: 'live',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '5',
        title: 'Webinar: Educação Domiciliar para AHSD',
        description: 'Estratégias e recursos para famílias que optam pela educação domiciliar.',
        date: new Date(currentYear, currentMonth, today.getDate() + 12),
        time: '20:00',
        type: 'webinar',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '6',
        title: 'Encontro: Networking de Famílias',
        description: 'Momento de conexão entre famílias para troca de experiências e apoio mútuo.',
        date: new Date(currentYear, currentMonth, today.getDate() + 15),
        time: '19:00',
        type: 'encontro',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '7',
        title: 'Live: Desenvolvimento Socioemocional',
        description: 'Como apoiar o desenvolvimento socioemocional de crianças com altas habilidades.',
        date: new Date(currentYear, currentMonth, today.getDate() + 18),
        time: '19:00',
        type: 'live',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '8',
        title: 'Workshop: Criatividade e Inovação',
        description: 'Técnicas para estimular a criatividade e o pensamento inovador em crianças AHSD.',
        date: new Date(currentYear, currentMonth, today.getDate() + 20),
        time: '19:30',
        type: 'webinar',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '9',
        title: 'Plantão de Dúvidas - Fim do Mês',
        description: 'Última oportunidade do mês para esclarecer dúvidas sobre AHSD.',
        date: new Date(currentYear, currentMonth, today.getDate() + 25),
        time: '20:00',
        type: 'webinar',
        zoomLink: '#',
        status: 'upcoming'
      },
      // Eventos em dias específicos (múltiplos eventos no mesmo dia)
      {
        id: '10',
        title: 'Roda de Conversa: Bullying e AHSD',
        description: 'Discussão sobre como prevenir e lidar com situações de bullying.',
        date: new Date(currentYear, currentMonth, today.getDate() + 14),
        time: '18:00',
        type: 'live',
        zoomLink: '#',
        status: 'upcoming'
      },
      {
        id: '11',
        title: 'Workshop: Gestão de Tempo',
        description: 'Estratégias para ajudar crianças AHSD a gerenciar melhor seu tempo.',
        date: new Date(currentYear, currentMonth, today.getDate() + 14),
        time: '20:00',
        type: 'webinar',
        zoomLink: '#',
        status: 'upcoming'
      },
    ];

    setEvents(mockEvents);
    setUpcomingEvents(mockEvents.filter(e => e.status === 'upcoming' && e.date >= new Date()));
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTypeLabel = (type: Event['type']) => {
    const labels = {
      live: 'Live',
      webinar: 'Webinar',
      encontro: 'Encontro',
      outro: 'Outro'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: Event['type']) => {
    const colors = {
      live: 'bg-purple-600 text-white dark:bg-purple-700 dark:text-white',
      webinar: 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white',
      encontro: 'bg-green-600 text-white dark:bg-green-700 dark:text-white',
      outro: 'bg-gray-600 text-white dark:bg-gray-700 dark:text-white'
    };
    return colors[type] || colors.outro;
  };

  // Gerar dias do mês - sempre 6 semanas (42 dias) para manter tamanho fixo
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days = [];
  // Dias vazios no início
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear, currentMonth, i));
  }
  // Preencher até completar 6 semanas (42 dias)
  const totalDays = days.length;
  const daysToAdd = 42 - totalDays;
  for (let i = 0; i < daysToAdd; i++) {
    days.push(null);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const selectedDateEvents = getEventsForDate(selectedDate);
  const eventsThisWeek = upcomingEvents.filter(e => {
    const daysUntil = Math.ceil(
      (e.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 7 && daysUntil >= 0;
  });

  return (
    <Container>
      <Section>
        <PageHeader 
          title="Calendário de Eventos" 
          subtitle="Acompanhe lives, webinários e próximos eventos"
        />

        {/* Layout principal: Calendário compacto + Cards de eventos em destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Calendário compacto - Ocupa 4 colunas */}
          <div className="lg:col-span-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1.5 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1.5 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-light-muted dark:text-dark-muted py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayEvents = getEventsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "aspect-square rounded-lg p-1 text-xs transition-all relative",
                        "hover:bg-light-surface dark:hover:bg-dark-surface hover:scale-105",
                        isToday && !isSelected && "ring-2 ring-purple-500 ring-offset-1",
                        isSelected && "bg-purple-600 dark:bg-purple-700 font-semibold",
                        !isToday && !isSelected && "text-light-text dark:text-dark-text"
                      )}
                    >
                      <div className={cn(
                        "font-medium",
                        isSelected && "text-white",
                        isToday && !isSelected && "text-purple-600 dark:text-purple-400"
                      )}>
                        {date.getDate()}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 justify-center flex-wrap mt-0.5">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={cn(
                                "w-1 h-1 rounded-full",
                                isSelected 
                                  ? "bg-white" 
                                  : event.type === 'live' && "bg-purple-500",
                                !isSelected && event.type === 'webinar' && "bg-blue-500",
                                !isSelected && event.type === 'encontro' && "bg-green-500"
                              )}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className={cn(
                              "text-[8px] font-medium",
                              isSelected ? "text-white" : "text-light-muted dark:text-dark-muted"
                            )}>
                              +{dayEvents.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Sidebar - Próximos Eventos */}
            <div className="mt-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="text-purple-600 dark:text-purple-400" size={18} />
                  <h2 className="text-base font-semibold text-light-text dark:text-dark-text">
                    Próximos Eventos
                  </h2>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-4 text-light-muted dark:text-dark-muted">
                    <AlertCircle className="mx-auto mb-2 opacity-50" size={20} />
                    <p className="text-xs">Nenhum evento próximo</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingEvents.slice(0, 5).map(event => {
                      const daysUntil = Math.ceil(
                        (event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={event.id}
                          className="group rounded-lg bg-light-surface dark:bg-dark-surface hover:bg-light-bg dark:hover:bg-dark-bg transition-all cursor-pointer overflow-hidden"
                          onClick={() => setSelectedDate(event.date)}
                        >
                          {/* Mini preview da imagem */}
                          {event.image_url ? (
                            <div className="relative w-full h-16 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                              <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                              <Calendar className="text-purple-400 dark:text-purple-500" size={16} />
                            </div>
                          )}
                          
                          <div className="p-2">
                            <div className="flex items-start justify-between mb-1">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-semibold",
                                getTypeColor(event.type)
                              )}>
                                {getTypeLabel(event.type)}
                              </span>
                              {daysUntil <= 7 && daysUntil >= 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                                  <AlertCircle size={8} />
                                  {daysUntil}d
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-light-text dark:text-dark-text mb-1 text-xs leading-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-light-muted dark:text-dark-muted mt-1">
                              <Calendar size={8} />
                              {event.date.toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                              <Clock size={8} />
                              {event.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Cards de eventos em destaque - Ocupa 8 colunas */}
          <div className="lg:col-span-8">
            {selectedDateEvents.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                    Eventos em {selectedDate.toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDateEvents.map(event => (
                    <ModernCard 
                      key={event.id}
                      variant="elevated" 
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      {/* Imagem do evento */}
                      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                        {event.image_url ? (
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="text-purple-400 dark:text-purple-500" size={48} />
                          </div>
                        )}
                        {/* Badge sobreposto */}
                        <div className="absolute top-3 left-3">
                          <span className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg",
                            getTypeColor(event.type)
                          )}>
                            {getTypeLabel(event.type)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Conteúdo do evento */}
                      <div className="p-4">
                        <h3 className="font-bold text-xl text-light-text dark:text-dark-text mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {event.title}
                        </h3>
                        
                        {event.description && (
                          <p className="text-sm text-light-muted dark:text-dark-muted mb-4 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                        
                        {/* Informações adicionais */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                            <Clock size={14} className="text-purple-600 dark:text-purple-400" />
                            <span>{event.time}</span>
                            {event.duration && (
                              <>
                                <span>•</span>
                                <span>{event.duration}</span>
                              </>
                            )}
                          </div>
                          
                          {event.instructor && (
                            <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                              <User size={14} className="text-purple-600 dark:text-purple-400" />
                              <span>{event.instructor}</span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                              <MapPin size={14} className="text-purple-600 dark:text-purple-400" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.zoomLink && (
                          <a
                            href={event.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                          >
                            <Video size={18} />
                            Participar do Evento
                          </a>
                        )}
                      </div>
                    </ModernCard>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-light-surface dark:bg-dark-surface rounded-xl">
                <Calendar className="mx-auto mb-4 text-light-muted dark:text-dark-muted opacity-50" size={64} />
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                  Nenhum evento agendado
                </h3>
                <p className="text-light-muted dark:text-dark-muted">
                  Selecione uma data no calendário para ver os eventos
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Container>
  );
}
