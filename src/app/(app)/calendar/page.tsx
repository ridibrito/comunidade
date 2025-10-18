"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Play, 
  Video, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  Search,
  CalendarPlus,
  ExternalLink
} from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Dados dos eventos
  const events = [
    {
      id: 1,
      title: "Roda de Conversa: Ansiedade na Infância",
      date: new Date(2024, 0, 15), // 15 de janeiro
      time: "19:00",
      type: "Roda de Conversa",
      participants: 45,
      zoomLink: "#",
      description: "Discussão sobre estratégias para lidar com ansiedade em crianças AHSD"
    },
    {
      id: 2,
      title: "Plantão de Dúvidas - Janeiro",
      date: new Date(2024, 0, 18), // 18 de janeiro
      time: "20:00",
      type: "Plantão",
      participants: 32,
      zoomLink: "#",
      description: "Sessão de perguntas e respostas com especialistas"
    },
    {
      id: 3,
      title: "Workshop: Rotinas para Crianças AHSD",
      date: new Date(2024, 0, 22), // 22 de janeiro
      time: "19:30",
      type: "Workshop",
      participants: 28,
      zoomLink: "#",
      description: "Aprenda a criar rotinas eficazes para o desenvolvimento"
    },
    {
      id: 4,
      title: "Lives realizadas - Replay",
      date: new Date(2024, 0, 10), // 10 de janeiro
      time: "18:00",
      type: "Gravado",
      participants: 156,
      recordingUrl: "#",
      description: "Sessão gravada sobre desenvolvimento cognitivo"
    }
  ];

  // Função para obter o nome do mês
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Função para obter os dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Função para obter eventos de uma data específica
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Função para navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Função para obter a cor do badge baseada no tipo
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "Roda de Conversa":
        return "brand";
      case "Plantão":
        return "info";
      case "Workshop":
        return "success";
      case "Gravado":
        return "warning";
      default:
        return "default";
    }
  };

  // Função para gerar link do Google Calendar
  const generateGoogleCalendarLink = (event: any) => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Duração padrão de 1 hora
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `${event.description}\n\nLink do Zoom: ${event.zoomLink || 'Será enviado por email'}\n\nParticipantes: ${event.participants}`,
      location: 'Online - Zoom',
      trp: 'false'
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Função para gerar link do Outlook Calendar
  const generateOutlookLink = (event: any) => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    
    const formatDate = (date: Date) => {
      return date.toISOString();
    };
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: formatDate(startDate),
      enddt: formatDate(endDate),
      body: `${event.description}\n\nLink do Zoom: ${event.zoomLink || 'Será enviado por email'}\n\nParticipantes: ${event.participants}`,
      location: 'Online - Zoom'
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  // Função para gerar arquivo .ics (iCalendar)
  const generateICSFile = (event: any) => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const description = event.description + '\n\nLink do Zoom: ' + (event.zoomLink || 'Será enviado por email') + '\n\nParticipantes: ' + event.participants;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Coruss//Event//PT',
      'BEGIN:VEVENT',
      'UID:' + event.id + '@coruss.com',
      'DTSTART:' + formatDate(startDate),
      'DTEND:' + formatDate(endDate),
      'SUMMARY:' + event.title,
      'DESCRIPTION:' + description,
      'LOCATION:Online - Zoom',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Calendário de Eventos" 
        subtitle="Acompanhe rodas de conversa, plantões de dúvidas e workshops"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário Principal */}
        <div className="lg:col-span-2">
          <ModernCard variant="elevated" className="p-6">
            {/* Cabeçalho do Calendário */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                {getMonthName(currentDate)}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors"
                >
                  Hoje
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
                </button>
              </div>
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-dark-muted">
                  {day}
                </div>
              ))}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-16"></div>;
                }
                
                const dayEvents = getEventsForDate(day);
                const isToday = day.toDateString() === today.toDateString();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={day.getTime()}
                    className={`h-16 p-1 border border-gray-200 dark:border-dark-border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-brand-accent/10 border-brand-accent" 
                        : isToday 
                          ? "bg-brand-accent/5 border-brand-accent/30" 
                          : "hover:bg-gray-50 dark:hover:bg-dark-border/50"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? "text-brand-accent" : "text-gray-900 dark:text-dark-text"
                    }`}>
                      {day.getDate()}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="h-1 bg-brand-accent rounded-full"
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-dark-muted">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ModernCard>
        </div>

        {/* Sidebar - Eventos do Dia Selecionado */}
        <div className="space-y-6">
          {/* Eventos do Dia */}
          <ModernCard variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })
                  : 'Selecione uma data'
                }
              </h4>
              {selectedDate && (
                <Badge variant="info" size="sm">
                  {selectedDateEvents.length} eventos
                </Badge>
              )}
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-4 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-dark-text text-sm">
                        {event.title}
                      </h5>
                      <Badge variant={getEventBadgeColor(event.type) as any} size="sm">
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600 dark:text-dark-muted">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>{event.participants} participantes</span>
                      </div>
                      <p className="text-xs">{event.description}</p>
                    </div>

                    <div className="space-y-2 mt-3">
                      {/* Botões de Ação Principal */}
                      <div className="flex gap-2">
                        {event.zoomLink && (
                          <button 
                            className="flex-1 px-3 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-1"
                            onClick={() => window.open(event.zoomLink, '_blank')}
                          >
                            <Play className="w-3 h-3" />
                            Entrar
                          </button>
                        )}
                        {event.recordingUrl && (
                          <button 
                            className="flex-1 px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                            onClick={() => window.open(event.recordingUrl, '_blank')}
                          >
                            <Video className="w-3 h-3" />
                            Assistir
                          </button>
                        )}
                      </div>
                      
                      {/* Botões de Adicionar à Agenda */}
                      <div className="border-t border-gray-200 dark:border-dark-border pt-2">
                        <p className="text-xs text-gray-500 dark:text-dark-muted mb-2">Adicionar à agenda:</p>
                        <div className="flex gap-1">
                          <button 
                            className="flex-1 px-2 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-1"
                            onClick={() => window.open(generateGoogleCalendarLink(event), '_blank')}
                            title="Adicionar ao Google Calendar"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            Google
                          </button>
                          <button 
                            className="flex-1 px-2 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-1"
                            onClick={() => window.open(generateOutlookLink(event), '_blank')}
                            title="Adicionar ao Outlook"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Outlook
                          </button>
                          <button 
                            className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                            onClick={() => generateICSFile(event)}
                            title="Baixar arquivo .ics"
                          >
                            <Calendar className="w-3 h-3" />
                            .ics
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500 dark:text-dark-muted">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum evento agendado para este dia</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-dark-muted">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Clique em uma data para ver os eventos</p>
              </div>
            )}
          </ModernCard>

          {/* Próximos Eventos */}
          <ModernCard variant="elevated" className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-4">
              Próximos Eventos
            </h4>
            <div className="space-y-4">
              {events
                .filter(event => event.date >= today)
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="p-3 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-border/50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-brand-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                          {event.date.toLocaleDateString('pt-BR')} às {event.time}
                        </p>
                      </div>
                      <Badge variant={getEventBadgeColor(event.type) as any} size="sm">
                        {event.type}
                      </Badge>
                    </div>
                    
                    {/* Botões de Adicionar à Agenda */}
                    <div className="flex gap-1">
                      <button 
                        className="flex-1 px-2 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-1"
                        onClick={() => window.open(generateGoogleCalendarLink(event), '_blank')}
                        title="Adicionar ao Google Calendar"
                      >
                        <CalendarPlus className="w-3 h-3" />
                        Google
                      </button>
                      <button 
                        className="flex-1 px-2 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-1"
                        onClick={() => window.open(generateOutlookLink(event), '_blank')}
                        title="Adicionar ao Outlook"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Outlook
                      </button>
                      <button 
                        className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                        onClick={() => generateICSFile(event)}
                        title="Baixar arquivo .ics"
                      >
                        <Calendar className="w-3 h-3" />
                        .ics
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}