"use client";

import { useState, useRef, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Particles } from "@/components/ui/animations/Particles";
import { BlurFade } from "@/components/ui/animations/BlurFade";
import { BorderBeam } from "@/components/ui/animations/BorderBeam";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { Send, User, Loader2, Plus, MessageSquare, Trash2, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  ai_messages?: Message[];
}

export default function IAPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
    loadUserProfile();
  }, []);

  useEffect(() => {
    // Só cria a mensagem quando o perfil foi carregado 
    // userFirstName === null significa que já tentou carregar mas não tem nome
    // userFirstName === undefined significa que ainda não tentou carregar
    if (messages.length === 0 && userFirstName !== undefined) {
      const welcomeMessage = userFirstName 
        ? `Olá, ${userFirstName}! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?`
        : 'Olá! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?';
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [userFirstName]);

  const loadUserProfile = async () => {
    try {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) {
        setUserFirstName(null);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserFirstName(null);
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single();
      
      if (profile?.avatar_url) {
        setUserAvatar(profile.avatar_url);
      }
      
      if (profile?.full_name) {
        const firstName = profile.full_name.split(' ')[0];
        setUserFirstName(firstName);
      } else {
        // Se não tiver nome, seta null para indicar que já tentou carregar
        setUserFirstName(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setUserFirstName(null);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/ia/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/ia/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Nova Conversa',
          firstMessage: null
        })
      });

      if (response.ok) {
        const newConversation = await response.json();
        setCurrentConversation(newConversation.id);
        const welcomeMessage = userFirstName 
          ? `Olá, ${userFirstName}! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?`
          : 'Olá! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?';
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date()
          }
        ]);
        await loadConversations();
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/ia/conversations/${conversationId}`);
      if (response.ok) {
        const conversation = await response.json();
        setCurrentConversation(conversationId);
        
        if (conversation.ai_messages && conversation.ai_messages.length > 0) {
          const formattedMessages = conversation.ai_messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at)
          }));
          setMessages(formattedMessages);
        } else {
          const welcomeMessage = userFirstName 
            ? `Olá, ${userFirstName}! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?`
            : 'Olá! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?';
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: welcomeMessage,
              timestamp: new Date()
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setShowDeleteConfirm(true);
  };

  const deleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      const response = await fetch(`/api/ia/conversations/${conversationToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadConversations();
        if (currentConversation === conversationToDelete) {
          setCurrentConversation(null);
          const welcomeMessage = userFirstName 
            ? `Olá, ${userFirstName}! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?`
            : 'Olá! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?';
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: welcomeMessage,
              timestamp: new Date()
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
    } finally {
      setShowDeleteConfirm(false);
      setConversationToDelete(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Enviando mensagem:', input.trim());
      
      const response = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation: messages,
          conversationId: currentConversation,
          userName: userFirstName
        }),
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.error || 'Erro ao processar mensagem');
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Não foi possível obter uma resposta.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro completo:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe, ocorreu um erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage = userFirstName 
      ? `Olá, ${userFirstName}! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?`
      : 'Olá! Sou a Corujinha 🦉, sua mentora virtual. Como posso ajudá-la hoje?';
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-light-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-light-surface shadow-md border-r-0 hidden lg:block relative overflow-hidden`}>
        <Particles 
          className="absolute inset-0 z-0" 
          quantity={30}
          ease={50}
          color="#9333ea"
          size={0.3}
        />
        <div className="relative z-10 p-4 border-b-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text">Conversas</h2>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative z-10 flex-1 overflow-y-auto p-2">
          {conversations.map((conversation, index) => (
            <BlurFade key={conversation.id} delay={index * 0.05} direction="left">
              <div
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors group relative ${
                  currentConversation === conversation.id
                    ? 'bg-gray-100 text-light-text'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => loadConversation(conversation.id)}
              >
                <BorderBeam 
                  colorFrom="#9333ea" 
                  colorTo="#ec4899" 
                  delay={0}
                  duration={3}
                  size={50}
                />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{conversation.title}</span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(conversation.id);
                    }}
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-light-bg relative overflow-hidden">
        {/* Particles Background */}
        <Particles 
          className="absolute inset-0 z-0" 
          quantity={50}
          ease={50}
          color="#9333ea"
          size={0.3}
        />
        
        {/* Header */}
        <div className="relative z-10 p-4 border-b-0 bg-light-surface shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="/icone.png" 
                    alt="Corujinha" 
                    width={40} 
                    height={40} 
                    style={{ 
                      width: 40, 
                      height: 'auto'
                    }} 
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-light-text">
                    Corujinha
                  </h1>
                  <p className="text-sm text-light-muted">
                    Especializada em AHSD e desenvolvimento infantil
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={createNewConversation}
                size="sm"
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 shadow-sm lg:hidden"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {messages.map((msg, index) => (
            <BlurFade key={msg.id} delay={index * 0.1} direction={msg.role === 'user' ? 'right' : 'left'}>
              <div
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <img 
                      src="/icone.png" 
                      alt="Corujinha" 
                      width={32} 
                      height={32} 
                      style={{ 
                        width: 32, 
                        height: 'auto'
                      }} 
                    />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg shadow-sm ${
                    msg.role === 'user'
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white text-light-text"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-xs block mt-1 text-right ${
                    msg.role === 'user' ? 'text-gray-600' : 'text-light-muted'
                  }`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="flex-shrink-0 w-8 h-8">
                    <AvatarImage src={userAvatar || ""} alt="Avatar" />
                    <AvatarFallback>
                      <User className="w-4 h-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </BlurFade>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <img 
                  src="/icone.png" 
                  alt="Corujinha" 
                  width={32} 
                  height={32} 
                  style={{ 
                    width: 32, 
                    height: 'auto'
                  }} 
                />
              </div>
              <div className="max-w-[85%] sm:max-w-[70%] p-3 rounded-lg bg-white text-light-text shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative z-10 p-3 sm:p-4 border-t-0 bg-light-surface shadow-md">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 border-0 rounded-lg bg-white text-light-text placeholder-light-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 resize-none text-sm shadow-sm"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="self-end bg-brand-accent hover:bg-brand-accent/90 flex-shrink-0 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-light-text mb-2">
            Excluir Conversa
          </h2>
          <p className="text-light-muted mb-6">
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={deleteConversation}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
