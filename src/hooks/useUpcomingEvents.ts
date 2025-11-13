import { useState, useEffect } from 'react';

export interface UpcomingEvent {
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

export function useUpcomingEvents() {
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // TODO: Substituir por chamada real à API quando disponível
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        // Mock de eventos - substituir por API real
        const mockEvents: UpcomingEvent[] = [
          {
            id: '1',
            title: 'Roda de Conversa: Ansiedade na Infância',
            description: 'Discussão sobre estratégias para lidar com ansiedade em crianças AHSD',
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
            description: 'Espaço para tirar dúvidas sobre desenvolvimento infantil',
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
            description: 'Como criar rotinas eficazes para crianças com altas habilidades',
            date: new Date(currentYear, currentMonth, today.getDate() + 7),
            time: '19:30',
            type: 'encontro',
            zoomLink: '#',
            status: 'upcoming'
          },
          {
            id: '4',
            title: 'Live: Identificação Precoce de AHSD',
            description: 'Aprenda a identificar sinais de altas habilidades em crianças pequenas',
            date: new Date(currentYear, currentMonth, today.getDate() + 10),
            time: '18:30',
            type: 'live',
            zoomLink: '#',
            status: 'upcoming'
          },
          {
            id: '5',
            title: 'Webinar: Educação Domiciliar para AHSD',
            description: 'Estratégias e recursos para famílias que optam pela educação domiciliar',
            date: new Date(currentYear, currentMonth, today.getDate() + 12),
            time: '20:00',
            type: 'webinar',
            zoomLink: '#',
            status: 'upcoming'
          },
        ];

        setEvents(mockEvents);

        // Filtrar eventos nos próximos 7 dias
        const upcoming = mockEvents.filter(e => {
          const daysUntil = Math.ceil(
            (e.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return e.status === 'upcoming' && daysUntil >= 0 && daysUntil <= 7;
        });

        setUpcomingEvents(upcoming);
        setUpcomingEventsCount(upcoming.length);
      } catch (error) {
        console.error("Erro ao buscar eventos próximos:", error);
        setUpcomingEventsCount(0);
        setEvents([]);
        setUpcomingEvents([]);
      }
    };

    fetchUpcomingEvents();
    // Atualizar a cada minuto
    const interval = setInterval(fetchUpcomingEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  return { upcomingEventsCount, events, upcomingEvents };
}

