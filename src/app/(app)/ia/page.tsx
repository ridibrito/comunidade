"use client";

import { useState, useRef, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { Send, User, Loader2, Plus, MessageSquare, Trash2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Componente de animação de digitação
function TypingAnimation() {
  return (
    <div className="flex gap-1 px-1">
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

// Componente de mensagem com animação de digitação
function MessageBubble({ message, isTyping = false, userAvatar }: { message: Message; isTyping?: boolean; userAvatar?: string | null }) {
  const [displayedContent, setDisplayedContent] = useState(isTyping ? '' : message.content);
  const [showCursor, setShowCursor] = useState(isTyping);

  useEffect(() => {
    if (isTyping && message.content) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, 20); // Velocidade de digitação

      return () => clearInterval(interval);
    }
  }, [isTyping, message.content]);

  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex items-start gap-2 group",
      isUser ? "flex-row" : "flex-row"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src="/icone.png" 
            alt="Corujinha" 
            width={32} 
            height={32} 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      <div className="relative flex flex-col">
        <div className={cn(
          "max-w-[280px] sm:max-w-[400px] md:max-w-[500px] rounded-2xl px-4 py-3 shadow-sm relative",
          isUser 
            ? "bg-purple-600 text-white" 
            : "bg-white text-gray-900 border border-gray-200"
        )}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayedContent}
            {showCursor && (
              <span className="inline-block w-0.5 h-4 bg-purple-500 ml-1 animate-pulse" />
            )}
          </div>
        </div>
        {/* Tail do bubble */}
        <div className={cn(
          "absolute w-0 h-0",
          isUser 
            ? "right-0 top-4 -mr-2 border-l-[8px] border-l-purple-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
            : "left-0 top-4 -ml-2 border-r-[8px] border-r-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
        )} />
        {/* Tail border para mensagens do assistente */}
        {!isUser && (
          <div className="absolute left-0 top-4 -ml-[10px] w-0 h-0 border-r-[8px] border-r-gray-200 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent" />
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt="Avatar" 
              width={32} 
              height={32} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Tela inicial de boas-vindas
function WelcomeScreen({ 
  userName, 
  onCreateConversation, 
  onSuggestionClick 
}: { 
  userName: string | null; 
  onCreateConversation: () => void;
  onSuggestionClick: (suggestion: string) => void;
}) {
  const suggestions = [
    "Como identificar altas habilidades em crianças?",
    "Quais estratégias educacionais para crianças AHSD?",
    "Como lidar com a superdotação na escola?",
    "Desenvolvimento emocional de crianças superdotadas"
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo/Ícone grande */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl animate-pulse overflow-hidden">
              <img 
                src="/icone.png" 
                alt="Corujinha" 
                width={96} 
                height={96} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-ping" />
          </div>
        </div>

        {/* Saudação */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {userName ? `Olá, ${userName}!` : 'Olá!'}
          </h1>
          <p className="text-xl text-gray-600">
            Sou a Corujinha 🦉, sua mentora virtual especializada em AHSD
          </p>
        </div>

        {/* Sugestões */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 font-medium">Como posso ajudar hoje?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="p-4 text-left rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-sm text-gray-700 hover:text-purple-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IAPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
      
      const { data: profile } = await (supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single() as unknown as Promise<{ data: { avatar_url?: string | null; full_name?: string | null } | null }>);
      
      if (profile?.avatar_url) {
        setUserAvatar(profile.avatar_url);
      }
      
      if (profile?.full_name) {
        const firstName = profile.full_name.split(' ')[0];
        setUserFirstName(firstName);
      } else {
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
        setMessages([]);
        await loadConversations();
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    // Criar conversa se não existir
    let conversationId = currentConversation;
    if (!conversationId) {
      try {
        const response = await fetch('/api/ia/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: suggestion.slice(0, 50),
            firstMessage: null
          })
        });
        if (response.ok) {
          const newConversation = await response.json();
          conversationId = newConversation.id;
          setCurrentConversation(conversationId);
          await loadConversations();
        }
      } catch (error) {
        console.error('Erro ao criar conversa:', error);
        return;
      }
    }

    // Criar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: suggestion,
          conversation: [],
          conversationId: conversationId,
          userName: userFirstName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar mensagem');
      }

      const data = await response.json();
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.response || 'Não foi possível obter uma resposta.',
        timestamp: new Date()
      };

      setMessages([userMessage, assistantMessage]);
      setTypingMessageId(assistantMessageId);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Erro completo:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe, ocorreu um erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`,
        timestamp: new Date()
      };
      setMessages([userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setTypingMessageId(null), 100);
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
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
          setMessages([]);
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

    // Criar conversa se não existir
    let conversationId = currentConversation;
    if (!conversationId) {
      try {
        const response = await fetch('/api/ia/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: input.trim().slice(0, 50),
            firstMessage: null
          })
        });
        if (response.ok) {
          const newConversation = await response.json();
          conversationId = newConversation.id;
          setCurrentConversation(conversationId);
          await loadConversations();
        }
      } catch (error) {
        console.error('Erro ao criar conversa:', error);
      }
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation: messages,
          conversationId: conversationId,
          userName: userFirstName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar mensagem');
      }

      const data = await response.json();
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.response || 'Não foi possível obter uma resposta.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTypingMessageId(assistantMessageId);
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
      setTimeout(() => setTypingMessageId(null), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && !currentConversation;
  const shouldShowSidebar = sidebarOpen;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 bg-white border-r border-gray-200 hidden lg:flex flex-col",
        shouldShowSidebar ? 'w-64' : 'w-0 overflow-hidden'
      )}>
        {shouldShowSidebar && (
          <>
            {/* Header da Sidebar */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={createNewConversation}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Plus className="w-4 h-4" />
                Nova conversa
              </button>
            </div>

            {/* Lista de Conversas */}
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma conversa ainda</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => loadConversation(conversation.id)}
                      className={cn(
                        "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                        currentConversation === conversation.id
                          ? "bg-purple-50 border border-purple-200"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <MessageSquare className={cn(
                        "w-4 h-4 flex-shrink-0",
                        currentConversation === conversation.id ? "text-purple-600" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "flex-1 text-sm truncate",
                        currentConversation === conversation.id ? "text-purple-900 font-medium" : "text-gray-700"
                      )}>
                        {conversation.title}
                      </span>
                      <button
                        onClick={(e) => handleDeleteClick(conversation.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={sidebarOpen ? "Ocultar conversas" : "Mostrar conversas"}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/icone.png" 
                  alt="Corujinha" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Corujinha</h1>
                <p className="text-xs text-gray-500">Sua mentora virtual</p>
              </div>
            </div>
          </div>
          {!showWelcome && (
            <button
              onClick={createNewConversation}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Messages ou Welcome Screen */}
        {showWelcome ? (
          <WelcomeScreen 
            userName={userFirstName} 
            onCreateConversation={createNewConversation}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <MessageBubble
                  message={msg}
                  isTyping={typingMessageId === msg.id}
                  userAvatar={userAvatar}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/icone.png" 
                    alt="Corujinha" 
                    width={32} 
                    height={32} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm bg-white text-gray-900 placeholder-gray-500"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-3 rounded-2xl transition-all duration-200",
                  input.trim() && !isLoading
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Excluir conversa?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={deleteConversation}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
