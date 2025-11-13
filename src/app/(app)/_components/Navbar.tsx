"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./UserMenu";

import { Calendar, Menu, Clock, AlertCircle } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationSystem";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import Badge from "@/components/ui/Badge";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { Popover } from "@/components/ui/Popover";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { upcomingEventsCount, upcomingEvents } = useUpcomingEvents();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, role")
          .eq("id", user.id)
          .single();

        const userIsAdmin = Boolean(profile?.is_admin) || (profile?.role === "admin");
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-light-surface dark:bg-dark-bg/95 backdrop-blur shadow-sm">
        <div className="px-3 sm:px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            >
              <Menu size={20} className="text-light-muted dark:text-dark-muted" />
            </button>
            
            <Link href="/" className="flex items-center pl-1 cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Singulari" 
                width={200} 
                height={28} 
                style={{ width: 200, height: "auto" }}
                className="hidden lg:block"
              />
              <img 
                src="/logo.png" 
                alt="Singulari" 
                width={160} 
                height={24} 
                style={{ width: 160, height: "auto" }}
                className="block lg:hidden"
              />
            </Link>
          </div>
          
          <nav className="flex items-center gap-3 pr-1">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Ícone de Calendário - apenas para admins */}
              {!loading && isAdmin && (
                <Popover
                  content={
                    <div className="w-80 p-4 bg-light-surface dark:bg-dark-surface">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                          Próximos Eventos
                        </h3>
                        <Link 
                          href="/events/calendar"
                          className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver todos
                        </Link>
                      </div>
                      {upcomingEvents.length === 0 ? (
                        <div className="text-center py-6 text-light-muted dark:text-dark-muted">
                          <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                          <p className="text-sm">Nenhum evento próximo</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {upcomingEvents.slice(0, 5).map(event => {
                            const daysUntil = Math.ceil(
                              (event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                            );

                            const getTypeColor = (type: string) => {
                              const colors = {
                                live: 'bg-purple-600 text-white',
                                webinar: 'bg-blue-600 text-white',
                                encontro: 'bg-green-600 text-white',
                                outro: 'bg-gray-600 text-white'
                              };
                              return colors[type as keyof typeof colors] || colors.outro;
                            };

                            const getTypeLabel = (type: string) => {
                              const labels = {
                                live: 'Live',
                                webinar: 'Webinar',
                                encontro: 'Encontro',
                                outro: 'Outro'
                              };
                              return labels[type as keyof typeof labels] || type;
                            };

                            return (
                              <Link
                                key={event.id}
                                href="/events/calendar"
                                className="group block rounded-lg bg-light-bg dark:bg-dark-bg hover:bg-light-surface dark:hover:bg-dark-surface transition-all overflow-hidden border border-gray-100 dark:border-gray-800"
                                onClick={(e) => e.stopPropagation()}
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
                                
                                <div className="p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-xs font-semibold",
                                      getTypeColor(event.type)
                                    )}>
                                      {getTypeLabel(event.type)}
                                    </span>
                                    {daysUntil <= 7 && daysUntil >= 0 && (
                                      <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                                        <AlertCircle size={10} />
                                        {daysUntil}d
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-semibold text-light-text dark:text-dark-text mb-1 text-sm leading-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {event.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mt-1">
                                    <Calendar size={10} />
                                    {event.date.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                    <Clock size={10} />
                                    {event.time}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  }
                >
                  <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer hover-brand-subtle text-light-muted dark:text-dark-muted"
                    title="Calendário de Eventos"
                  >
                    <Calendar size={18} />
                    {isAdmin && upcomingEventsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                      >
                        {upcomingEventsCount > 9 ? "9+" : upcomingEventsCount}
                      </Badge>
                    )}
                  </button>
                </Popover>
              )}
              
              {/* Sistema de Notificações */}
              <NotificationBell />
              
              <UserMenu />
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <NotificationBell />
              <UserMenu />
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}


