"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { askCorujinha } from "./actions";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import { 
  Bot, 
  Send, 
  Plus, 
  Mic, 
  Paperclip, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  MoreVertical,
  MessageSquare,
  Clock,
  User
} from "lucide-react";

type Message = { 
  id: string;
  role: "user" | "assistant"; 
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: "image" | "pdf" | "video";
    name: string;
    url: string;
  }>;
  rating?: "positive" | "negative";
};

type Conversation = { 
  id: string; 
  title: string; 
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export default function AIPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);



  useEffect(() => {
    const raw = localStorage.getItem("ai-conversations");
    if (raw) {
      const parsed: Conversation[] = JSON.parse(raw).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: c.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
      setConversations(parsed);
      setActiveId(parsed[0]?.id ?? null);
    } else {
      const first: Conversation = { 
        id: crypto.randomUUID(), 
        title: "Nova conversa", 
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConversations([first]);
      setActiveId(first.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ai-conversations", JSON.stringify(conversations));
  }, [conversations]);

  const activeConv = useMemo(() => conversations.find((c) => c.id === activeId) ?? null, [conversations, activeId]);
  const hasMessages = (activeConv?.messages.length ?? 0) > 0;

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConv?.messages, isThinking]);

  function newConversation() {
    const conv: Conversation = { 
      id: crypto.randomUUID(), 
      title: "Nova conversa", 
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setConversations((c) => [conv, ...c]);
    setActiveId(conv.id);
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    
    const question = input.trim();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date()
    };

    setInput("");
    setConversations((cs) => cs.map((c) => 
      c.id === activeConv.id 
        ? { 
            ...c, 
            title: c.title === "Nova conversa" ? question.slice(0, 48) : c.title, 
            messages: [...c.messages, userMessage],
            updatedAt: new Date()
          } 
        : c
    ));
    
    setIsThinking(true);
    const answer = await askCorujinha(question);
    setIsThinking(false);
    
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: answer,
      timestamp: new Date()
    };
    
    setConversations((cs) => cs.map((c) => 
      c.id === activeConv.id 
        ? { 
            ...c, 
            messages: [...c.messages, assistantMessage],
            updatedAt: new Date()
          } 
        : c
    ));
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e as unknown as React.FormEvent);
    }
  }

  function autoGrow() {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    const next = Math.min(inputRef.current.scrollHeight, 160);
    inputRef.current.style.height = `${next}px`;
  }

  function renameConversation(id: string) {
    const name = prompt("Renomear conversa:", conversations.find((c) => c.id === id)?.title || "");
    if (!name) return;
    setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, title: name.slice(0, 64) } : c)));
  }

  function deleteConversation(id: string) {
    setConversations((cs) => cs.filter((c) => c.id !== id));
    if (activeId === id) setActiveId((prev) => {
      const remaining = conversations.filter((c) => c.id !== id);
      return remaining[0]?.id ?? null;
    });
  }

  function rateMessage(messageId: string, rating: "positive" | "negative") {
    if (!activeConv) return;
    setConversations((cs) => cs.map((c) => 
      c.id === activeConv.id 
        ? {
            ...c,
            messages: c.messages.map((m) => 
              m.id === messageId ? { ...m, rating } : m
            )
          }
        : c
    ));
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
  }


  return (
    <div className="h-[calc(100vh-64px)] flex bg-white dark:bg-dark-bg">
      {/* Sidebar - Estilo Gemini */}
      <div className="w-80 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface flex flex-col">
        {/* Cabeçalho da Sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <button 
            onClick={newConversation}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
            <span className="text-gray-700 dark:text-dark-text font-medium">Nova conversa</span>
          </button>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div 
                key={conv.id}
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeId === conv.id 
                    ? "bg-gray-100 dark:bg-dark-border" 
                    : "hover:bg-gray-50 dark:hover:bg-dark-border/50"
                }`}
                onClick={() => setActiveId(conv.id)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-dark-text truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted">
                    {conv.messages.length} mensagens
                  </p>
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuFor(menuFor === conv.id ? null : conv.id);
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-border opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
                  </button>
                  {menuFor === conv.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-lg py-1 z-10">
                      <button 
                        onClick={() => { setMenuFor(null); renameConversation(conv.id); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-border/50"
                      >
                        Renomear
                      </button>
                      <button 
                        onClick={() => { setMenuFor(null); deleteConversation(conv.id); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-border/50 text-red-600 dark:text-red-400"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área Principal - Estilo Gemini */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text">Corujinha</h1>
              <p className="text-sm text-gray-600 dark:text-dark-muted">IA especializada em AHSD</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm">Online</Badge>
              <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasMessages && !isThinking && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-6">
                <div className="text-4xl mb-4">🦉</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-2">
                  Olá,
                </h2>
                <p className="text-gray-600 dark:text-dark-muted">
                  Corujinha para Coruss
                </p>
              </div>
            </div>
          )}

          {/* Mensagens */}
          <div className="space-y-6">
            {activeConv?.messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                  <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" 
                        ? "bg-brand-accent text-white" 
                        : "bg-brand-accent/10 text-brand-accent"
                    }`}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-brand-accent text-white"
                        : "bg-gray-100 dark:bg-dark-border text-gray-900 dark:text-dark-text"
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  
                  {/* Ações da Mensagem */}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-2 ml-11">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                        title="Copiar mensagem"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
                      </button>
                      <button
                        onClick={() => rateMessage(message.id, "positive")}
                        className={`p-1 rounded transition-colors ${
                          message.rating === "positive" 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-600 dark:text-dark-muted hover:text-green-600 dark:hover:text-green-400"
                        }`}
                        title="Útil"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rateMessage(message.id, "negative")}
                        className={`p-1 rounded transition-colors ${
                          message.rating === "negative" 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-gray-600 dark:text-dark-muted hover:text-red-600 dark:hover:text-red-400"
                        }`}
                        title="Não útil"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de Digitação */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-dark-border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={scrollRef} />
        </div>

        {/* Área de Input - Estilo Gemini */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-border">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onSend}>
              <div className="relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="w-full min-h-14 max-h-32 rounded-2xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted px-4 py-4 pr-16 resize-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
                  placeholder="Insira um comando para a Corujinha"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoGrow(); }}
                  onKeyDown={handleKey}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    title="Anexar arquivo"
                  >
                    <Paperclip className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording 
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
                        : "hover:bg-gray-100 dark:hover:bg-dark-border"
                    }`}
                    title="Gravar áudio"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-dark-muted">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Ferramentas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}