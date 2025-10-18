"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { askCorujinha } from "./actions";
import { OwlIcon } from "@/components/icons/OwlIcon";
import { MoreVertical, Mic, Plus, SlidersHorizontal } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; messages: Msg[] };

export default function AIPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ai-conversations");
    if (raw) {
      const parsed: Conversation[] = JSON.parse(raw);
      setConversations(parsed);
      setActiveId(parsed[0]?.id ?? null);
    } else {
      const first: Conversation = { id: crypto.randomUUID(), title: "Nova conversa", messages: [] };
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
    const conv: Conversation = { id: crypto.randomUUID(), title: "Nova conversa", messages: [] };
    setConversations((c) => [conv, ...c]);
    setActiveId(conv.id);
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    const q = input.trim();
    setInput("");
    setConversations((cs) => cs.map((c) => c.id === activeConv.id ? { ...c, title: c.title === "Nova conversa" ? q.slice(0, 48) : c.title, messages: [...c.messages, { role: "user", content: q }] } : c));
    setIsThinking(true);
    const a = await askCorujinha(q);
    setIsThinking(false);
    setConversations((cs) => cs.map((c) => c.id === activeConv.id ? { ...c, messages: [...c.messages, { role: "assistant", content: a }] } : c));
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
    const next = Math.min(inputRef.current.scrollHeight, 160); // max-h ~40
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

  return (
    <main className="p-0 h-[calc(100vh-64px)] overflow-hidden -m-4">
      <div className="flex h-full">
        <aside className="hidden md:block w-[320px] border-r-2 border-[var(--border)] bg-[var(--surface)]">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--hover)] flex items-center justify-center"><OwlIcon /></div>
              <div className="font-medium">Corujinha</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={newConversation} className="text-xs px-2 h-8 rounded-lg border border-[var(--border)] bg-[var(--hover)] hover:bg-[#1a2030]">Nova</button>
            </div>
          </div>
          <ul className="px-2 py-2 space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <div className={`group flex items-center gap-2 rounded-xl px-2 py-1 ${activeId === c.id ? "bg-[#1f2537]" : "hover:bg-[#1a2030]"}`}>
                  <button onClick={() => setActiveId(c.id)} className="flex-1 text-left rounded-lg px-2 py-1 text-sm">
                    {c.title}
                  </button>
                  <div className="relative">
                    <button onClick={() => setMenuFor(menuFor === c.id ? null : c.id)} className="h-7 w-7 rounded-md hover:bg-[#1a2030] flex items-center justify-center" aria-label="Mais opções">
                      <MoreVertical size={14} />
                    </button>
                    {menuFor === c.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg py-1">
                        <button onClick={() => { setMenuFor(null); renameConversation(c.id); }} className="w-full text-left px-3 py-2 text-sm hover:bg-[#1a2030]">Renomear</button>
                        <button onClick={() => { setMenuFor(null); deleteConversation(c.id); }} className="w-full text-left px-3 py-2 text-sm hover:bg-[#1a2030] text-red-600">Excluir</button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-1 p-4 grid grid-rows-[1fr_auto] h-full">
          <div className={`mx-auto w-full transition-[max-width] duration-300 ease-out ${hasMessages ? "max-w-[1100px]" : "max-w-[720px]"}`}>
            <div className="border-2 border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 space-y-4 overflow-y-auto h-full">
                {!hasMessages && !isThinking && (
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-semibold">Olá,</div>
                    <div className="text-[#9aa3b2] text-sm">Faça uma pergunta para começar.</div>
                  </div>
                )}
                {activeConv?.messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className={
                      m.role === "user"
                        ? "inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-[#1f2537] text-[var(--foreground)]"
                        : "inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-[var(--hover)] border border-[var(--border)] text-[var(--foreground)]"
                    }>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="text-left">
                    <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-[var(--hover)] border border-[var(--border)] text-[var(--foreground)]">
                      <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
            </div>
          </div>
          <div className={`mx-auto w-full transition-[max-width] duration-300 ease-out ${hasMessages ? "max-w-[1100px]" : "max-w-[720px]"}`}>
            <form onSubmit={onSend} className="mt-3 flex gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="flex-1 min-h-12 max-h-40 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[#9aa3b2] px-3 py-2 resize-none"
                  placeholder="Insira um comando para a Corujinha"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoGrow(); }}
                  onKeyDown={handleKey}
                />
                <button className="h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--hover)] hover:bg-[#1a2030]">Enviar</button>
            </form>
            <div className="mt-2 flex items-center gap-3 text-sm text-[#9aa3b2]">
              <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--hover)]"><Plus size={14} /></button>
              <div className="inline-flex items-center gap-2"><SlidersHorizontal size={14} /> Ferramentas</div>
              <div className="ml-auto inline-flex items-center gap-2"><Mic size={14} /> Falar</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


