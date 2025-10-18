"use client";

import { useState } from "react";
import { askMentora } from "./actions";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { Bot, Send, MessageCircle, Users, TrendingUp, Heart, Share2, MoreHorizontal, Image, FileText, Video, Paperclip, Smile, MapPin, Clock, ThumbsUp, Reply, Calendar, Play, UserPlus, Star, Award } from "lucide-react";

export default function CommunityPage() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);
  const [newPost, setNewPost] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    const res = await askMentora(q);
    setA(res);
  }

  // Dados dos próximos eventos para a sidebar
  const upcomingEvents = [
    {
      id: 1,
      title: "Roda de Conversa: Ansiedade na Infância",
      date: "15/01/2024",
      time: "19:00",
      type: "Roda de Conversa",
      participants: 45,
      zoomLink: "#"
    },
    {
      id: 2,
      title: "Plantão de Dúvidas - Janeiro",
      date: "18/01/2024", 
      time: "20:00",
      type: "Plantão",
      participants: 32,
      zoomLink: "#"
    },
    {
      id: 3,
      title: "Workshop: Rotinas para Crianças AHSD",
      date: "22/01/2024",
      time: "19:30",
      type: "Workshop",
      participants: 28,
      zoomLink: "#"
    }
  ];

  // Dados de membros ativos
  const activeMembers = [
    { name: "Ana Costa", role: "Psicóloga", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" },
    { name: "Carlos Santos", role: "Pai", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" },
    { name: "Lucia Oliveira", role: "Mãe", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
    { name: "Dr. Roberto", role: "Pediatra", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop" }
  ];

  // Dados do feed da comunidade
  const communityPosts = [
    {
      id: 1,
      author: {
        name: "Maria Silva",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
        role: "Mãe",
        verified: true
      },
      content: "Meu filho de 8 anos está muito ansioso com as mudanças na escola. Alguém tem dicas para ajudar na transição?",
      timestamp: "2 horas atrás",
      location: "São Paulo, SP",
      likes: 12,
      comments: 8,
      shares: 3,
      attachments: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop",
          name: "foto-escola.jpg"
        }
      ],
      commentsList: [
        {
          id: 1,
          author: {
            name: "Dr. Ana Costa",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
            role: "Psicóloga",
            verified: true
          },
          content: "Maria, é normal essa ansiedade. Sugiro criar uma rotina visual e conversar sobre as mudanças positivas. Posso te enviar um material sobre isso.",
          timestamp: "1 hora atrás",
          likes: 5
        },
        {
          id: 2,
          author: {
            name: "Carlos Mendes",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
            role: "Pai",
            verified: false
          },
          content: "Passei por isso com minha filha. O que mais ajudou foi visitar a escola antes e conhecer a professora. Boa sorte!",
          timestamp: "30 min atrás",
          likes: 3
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Roberta Lima",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        role: "Mãe",
        verified: true
      },
      content: "Compartilhando uma atividade que funcionou muito bem com meu filho! Ele adora criar histórias com essas cartas. Quem quiser, posso enviar o PDF.",
      timestamp: "4 horas atrás",
      location: "Rio de Janeiro, RJ",
      likes: 24,
      comments: 15,
      shares: 8,
      attachments: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
          name: "atividade-cartas.jpg"
        },
        {
          type: "pdf",
          url: "/files/atividade-cartas-criativas.pdf",
          name: "Cartas Criativas.pdf"
        }
      ],
      commentsList: [
        {
          id: 3,
          author: {
            name: "Pedro Santos",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
            role: "Pai",
            verified: false
          },
          content: "Que legal! Meu filho também adora criar histórias. Pode me enviar o PDF?",
          timestamp: "3 horas atrás",
          likes: 2
        }
      ]
    },
    {
      id: 3,
      author: {
        name: "Dr. João Oliveira",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop",
        role: "Pediatra",
        verified: true
      },
      content: "Dica importante: Crianças AHSD podem ter necessidades nutricionais específicas. Aqui está um guia completo sobre alimentação adequada.",
      timestamp: "6 horas atrás",
      location: "Brasília, DF",
      likes: 45,
      comments: 12,
      shares: 18,
      attachments: [
        {
          type: "pdf",
          url: "/files/guia-nutricional-ahsd.pdf",
          name: "Guia Nutricional AHSD.pdf"
        }
      ],
      commentsList: []
    }
  ];
  return (
    <Container>
      <Section>
        <PageHeader title="Comunidade" />
        
        <div className="flex gap-6">
          {/* Conteúdo Principal - Feed */}
          <div className="flex-1 space-y-6">
          {/* Estatísticas da Comunidade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ModernCard variant="gradient" className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600 dark:text-dark-muted">Membros Ativos</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">1,247</div>
              <Badge variant="success" size="sm" className="mt-2">+12% este mês</Badge>
            </ModernCard>
            
            <ModernCard variant="gradient" className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600 dark:text-dark-muted">Posts Hoje</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">89</div>
              <Badge variant="info" size="sm" className="mt-2">+5% vs ontem</Badge>
            </ModernCard>
            
            <ModernCard variant="gradient" className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600 dark:text-dark-muted">Engajamento</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">94%</div>
              <Badge variant="default" size="sm" className="mt-2">Excelente</Badge>
            </ModernCard>
          </div>

          {/* Criar Novo Post */}
          <ModernCard variant="elevated" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="flex-1">
                <input
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  placeholder="Compartilhe uma dúvida, experiência ou dica com a comunidade..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted hover:text-brand-accent transition-colors">
                  <Image className="w-4 h-4" />
                  Foto
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted hover:text-brand-accent transition-colors">
                  <Video className="w-4 h-4" />
                  Vídeo
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted hover:text-brand-accent transition-colors">
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted hover:text-brand-accent transition-colors">
                  <Paperclip className="w-4 h-4" />
                  Anexo
                </button>
              </div>
              <button 
                className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
                disabled={!newPost.trim()}
              >
                Publicar
              </button>
            </div>
          </ModernCard>

          {/* Feed de Posts */}
          <div className="space-y-6">
            {communityPosts.map((post) => (
              <ModernCard key={post.id} variant="elevated" className="space-y-4">
                {/* Cabeçalho do Post */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text">{post.author.name}</h3>
                        {post.author.verified && (
                          <Badge variant="brand" size="sm">Verificado</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-muted">
                        <span>{post.author.role}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{post.location}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Conteúdo do Post */}
                <div className="text-gray-900 dark:text-dark-text">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Anexos */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="space-y-3">
                    {post.attachments.map((attachment, idx) => (
                      <div key={idx}>
                        {attachment.type === "image" && (
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="w-full max-w-md rounded-lg object-cover"
                          />
                        )}
                        {attachment.type === "pdf" && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-border/50 rounded-lg border border-gray-200 dark:border-dark-border">
                            <FileText className="w-8 h-8 text-red-500" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-dark-text">{attachment.name}</p>
                              <p className="text-sm text-gray-500 dark:text-dark-muted">PDF • Clique para baixar</p>
                            </div>
                            <button 
                              onClick={() => window.open(attachment.url, '_blank')}
                              className="px-3 py-1 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors text-sm"
                            >
                              Baixar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Ações do Post */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-border">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-dark-muted hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-dark-muted hover:text-brand-accent transition-colors">
                      <Reply className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-dark-muted hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>

                {/* Comentários */}
                {post.commentsList && post.commentsList.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                    {post.commentsList.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img 
                          src={comment.author.avatar} 
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-dark-text text-sm">{comment.author.name}</h4>
                            {comment.author.verified && (
                              <Badge variant="brand" size="sm" className="text-xs">Verificado</Badge>
                            )}
                            <span className="text-xs text-gray-500 dark:text-dark-muted">{comment.author.role}</span>
                            <span className="text-xs text-gray-500 dark:text-dark-muted">•</span>
                            <span className="text-xs text-gray-500 dark:text-dark-muted">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-dark-text mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-muted hover:text-red-500 transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-xs text-gray-500 dark:text-dark-muted hover:text-brand-accent transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Campo de Comentário */}
                <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <input
                      className="w-full h-8 px-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                      placeholder="Escreva um comentário..."
                    />
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {/* Chat com IA Mentora - Seção Fixa */}
          <ModernCard variant="elevated" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">Corujinha IA</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">Sua mentora virtual especializada em AHSD</p>
              </div>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            
            <form onSubmit={onAsk} className="space-y-4">
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  placeholder="Pergunte sobre desenvolvimento, educação, rotinas..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            {a && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border/50 border border-gray-200 dark:border-dark-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-dark-text whitespace-pre-wrap">{a}</p>
                  </div>
                </div>
              </div>
            )}
          </ModernCard>
          </div>

          {/* Sidebar Lateral */}
          <div className="w-80 space-y-6">
            {/* Próximos Eventos */}
            <ModernCard variant="elevated" className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-accent" />
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">Próximos Eventos</h3>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-gray-50 dark:bg-dark-border/50 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-dark-text line-clamp-2">
                        {event.title}
                      </h4>
                      <Badge variant="brand" size="sm">{event.type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-dark-muted mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.date} às {event.time}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-dark-muted">
                        <Users className="w-3 h-3" />
                        <span>{event.participants} participantes</span>
                      </div>
                      <button 
                        className="px-3 py-1 text-xs bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition-colors flex items-center gap-1"
                        onClick={() => window.open(event.zoomLink, '_blank')}
                      >
                        <Play className="w-3 h-3" />
                        Entrar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Membros Ativos */}
            <ModernCard variant="elevated" className="space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-accent" />
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">Membros Ativos</h3>
              </div>
              
              <div className="space-y-3">
                {activeMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{member.name}</p>
                      <p className="text-xs text-gray-600 dark:text-dark-muted">{member.role}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Destaques da Semana */}
            <ModernCard variant="elevated" className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-accent" />
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">Destaques</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-brand-accent/10 to-brand-accent/5 border border-brand-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-brand-accent" />
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text">Top Contribuidor</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-muted">Maria Silva ajudou 15 famílias esta semana</p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text">Crescimento</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-muted">+23 novos membros esta semana</p>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </Section>
    </Container>
  );
}


