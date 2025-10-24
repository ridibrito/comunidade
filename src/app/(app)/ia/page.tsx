"use client";

import { useState, useRef, useEffect } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Button from "@/components/ui/Button";
import { Bot, Send, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function IAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu assistente especializado em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          conversation: messages
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
        content: 'Olá! Sou seu assistente especializado em Altas Habilidades/Superdotação (AHSD) e desenvolvimento infantil. Como posso ajudá-lo hoje?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <Container>
      <Section>
        <PageHeader
          title="Assistente de IA"
          description="Converse com nossa inteligência artificial para tirar dúvidas e obter ajuda"
          icon={<Bot className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <ModernCard className="h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-brand-subtle">
                  <Bot className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">
                    Assistente IA
                  </h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    Como posso ajudá-lo hoje?
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                disabled={messages.length === 0}
              >
                Limpar Chat
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-16 h-16 text-light-muted dark:text-dark-muted mb-4" />
                  <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                    Bem-vindo ao Assistente IA
                  </h3>
                  <p className="text-light-muted dark:text-dark-muted max-w-md">
                    Faça perguntas sobre AHSD, educação, desenvolvimento infantil ou qualquer outro tópico relacionado à nossa plataforma.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center">
                        <Bot className="w-4 h-4 text-brand-accent" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-brand-accent text-white'
                          : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-white/70' 
                          : 'text-light-muted dark:text-dark-muted'
                      }`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-light-muted dark:text-dark-muted">
                        Pensando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-light-border dark:border-dark-border">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                  disabled={isLoading}
                  className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="self-end"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </ModernCard>
        </div>
      </Section>
    </Container>
  );
}
