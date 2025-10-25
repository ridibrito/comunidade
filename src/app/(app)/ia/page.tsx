"use client";

import { useState, useRef, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import { Bot, Send, User, Loader2, Plus, MessageSquare, Trash2, Edit3, MoreHorizontal } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou a Corujinha 🦉, sua mentora virtual especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Estou aqui para ajudar famílias como a sua a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades. Como posso ajudá-la hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

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
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Olá! Sou a Corujinha 🦉, sua mentora virtual especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Estou aqui para ajudar famílias como a sua a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades. Como posso ajudá-la hoje?',
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
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: 'Olá! Sou a Corujinha 🦉, sua mentora virtual especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Estou aqui para ajudar famílias como a sua a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades. Como posso ajudá-la hoje?',
              timestamp: new Date()
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/ia/conversations/${conversationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadConversations();
        if (currentConversation === conversationId) {
          setCurrentConversation(null);
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: 'Olá! Sou a Corujinha 🦉, sua mentora virtual especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Estou aqui para ajudar famílias como a sua a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades. Como posso ajudá-la hoje?',
              timestamp: new Date()
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
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
          conversationId: currentConversation
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
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! Sou a Corujinha 🦉, sua mentora virtual especializada em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Estou aqui para ajudar famílias como a sua a navegar pelos desafios e oportunidades do desenvolvimento de altas habilidades. Como posso ajudá-la hoje?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-light-surface dark:bg-dark-surface">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-light-surface-secondary dark:bg-dark-surface-secondary border-r border-light-border dark:border-dark-border hidden lg:block`}>
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Conversas</h2>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="bg-brand-accent hover:bg-brand-accent/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors group ${
                currentConversation === conversation.id
                  ? 'bg-brand-accent text-white'
                  : 'bg-light-surface dark:bg-dark-surface hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary'
              }`}
              onClick={() => loadConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{conversation.title}</span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs opacity-70 mt-1">
                {new Date(conversation.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
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
              <div>
                <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Assistente IA - Corujinha 🦉
                </h1>
                <p className="text-sm text-light-muted dark:text-dark-muted">
                  Especializada em AHSD e desenvolvimento infantil
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={createNewConversation}
                size="sm"
                className="bg-brand-accent hover:bg-brand-accent/90 lg:hidden"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? "bg-brand-accent text-white"
                    : "bg-light-surface-secondary dark:bg-dark-surface-secondary text-light-text dark:text-dark-text"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-70 block mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[85%] sm:max-w-[70%] p-3 rounded-lg bg-light-surface-secondary dark:bg-dark-surface-secondary text-light-text dark:text-dark-text">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none text-sm"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="self-end bg-brand-accent hover:bg-brand-accent/90 flex-shrink-0"
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
    </div>
  );
}
