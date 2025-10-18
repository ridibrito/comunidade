"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";

interface Trail { id: string; title: string; slug: string; position: number }
interface Module { id: string; title: string; slug: string; trail_id: string; position: number }
interface Lesson { id: string; title: string; slug: string; module_id: string; video_url: string | null; position: number }

export function MountainBuilder() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();

  const [trails, setTrails] = useState<Trail[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [activeTrailId, setActiveTrailId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Form state
  const [newTrailTitle, setNewTrailTitle] = useState("");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState("");

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      // ensure a default mountain exists
      const slug = "montanha-do-amanha";
      const { data: mountain } = await supabase
        .from("mountains")
        .upsert({ slug, title: "Montanha do amanhã", description: "Programa" }, { onConflict: "slug" })
        .select("id")
        .maybeSingle();
      if (!mountain?.id) return;

      const { data: t } = await supabase.from("trails").select("id, title, slug, position").eq("mountain_id", mountain.id).order("position");
      setTrails(t ?? []);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!supabase || !activeTrailId) { setModules([]); setActiveModuleId(null); return; }
    (async () => {
      const { data: m } = await supabase.from("modules").select("id, title, slug, trail_id, position").eq("trail_id", activeTrailId).order("position");
      setModules(m ?? []);
    })();
  }, [activeTrailId]);

  useEffect(() => {
    if (!supabase || !activeModuleId) { setLessons([]); return; }
    (async () => {
      const { data: l } = await supabase.from("lessons").select("id, title, slug, module_id, video_url, position").eq("module_id", activeModuleId).order("position");
      setLessons(l ?? []);
    })();
  }, [activeModuleId]);

  async function addTrail() {
    if (!supabase) return;
    const title = newTrailTitle.trim();
    if (!title) return;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data, error } = await supabase
      .from("trails")
      .insert({ title, slug, mountain_id: (await supabase.from("mountains").select("id").eq("slug", "montanha-do-amanha").maybeSingle()).data?.id })
      .select("id, title, slug, position")
      .maybeSingle();
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setTrails((prev) => [...prev, data!]);
    setNewTrailTitle("");
    setActiveTrailId(data!.id);
    push({ title: "Trilha criada" });
  }

  async function addModule() {
    if (!supabase || !activeTrailId) return;
    const title = newModuleTitle.trim();
    if (!title) return;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data, error } = await supabase
      .from("modules")
      .insert({ title, slug, trail_id: activeTrailId })
      .select("id, title, slug, trail_id, position")
      .maybeSingle();
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setModules((prev) => [...prev, data!]);
    setNewModuleTitle("");
    setActiveModuleId(data!.id);
    push({ title: "Módulo criado" });
  }

  async function addLesson() {
    if (!supabase || !activeModuleId) return;
    const title = newLessonTitle.trim();
    if (!title) return;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data, error } = await supabase
      .from("lessons")
      .insert({ title, slug, module_id: activeModuleId, video_url: newLessonVideo || null })
      .select("id, title, slug, module_id, video_url, position")
      .maybeSingle();
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setLessons((prev) => [...prev, data!]);
    setNewLessonTitle("");
    setNewLessonVideo("");
    push({ title: "Aula criada" });
  }

  const modulesOfTrail = modules.filter((m) => m.trail_id === activeTrailId);
  const lessonsOfModule = lessons.filter((l) => l.module_id === activeModuleId);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {/* Trilhas */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trilhas</h2>
          <div className="flex items-center gap-2">
            <input value={newTrailTitle} onChange={(e)=>setNewTrailTitle(e.target.value)} placeholder="Nome da trilha" className="h-9 rounded-xl bg-transparent border px-3 text-sm" />
            <button onClick={addTrail} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] inline-flex items-center gap-1"><Plus size={14}/> Nova</button>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {trails.map((t) => (
            <li key={t.id}>
              <button onClick={() => { setActiveTrailId(t.id); setActiveModuleId(null); }} className={`w-full text-left px-3 py-2 rounded-xl ${activeTrailId===t.id?"bg-[var(--hover)] text-[var(--accent-purple)]":"hover:bg-[var(--hover)]"}`}>{t.title}</button>
            </li>
          ))}
          {trails.length===0 && <li className="text-[var(--foreground)]/60">Nenhuma trilha criada.</li>}
        </ul>
      </div>

      {/* Módulos da trilha selecionada */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Módulos</h2>
          <div className="flex items-center gap-2">
            <input value={newModuleTitle} onChange={(e)=>setNewModuleTitle(e.target.value)} placeholder="Nome do módulo" className="h-9 rounded-xl bg-transparent border px-3 text-sm" />
            <button onClick={addModule} disabled={!activeTrailId} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] disabled:opacity-50 inline-flex items-center gap-1"><Plus size={14}/> Novo</button>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {modulesOfTrail.map((m) => (
            <li key={m.id}>
              <button onClick={() => setActiveModuleId(m.id)} className={`w-full text-left px-3 py-2 rounded-xl ${activeModuleId===m.id?"bg-[var(--hover)] text-[var(--accent-purple)]":"hover:bg-[var(--hover)]"}`}>{m.title}</button>
            </li>
          ))}
          {activeTrailId && modulesOfTrail.length===0 && <li className="text-[var(--foreground)]/60">Nenhum módulo nesta trilha.</li>}
          {!activeTrailId && <li className="text-[var(--foreground)]/60">Selecione uma trilha.</li>}
        </ul>
      </div>

      {/* Aulas do módulo selecionado */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Aulas</h2>
          <div className="flex items-center gap-2">
            <input value={newLessonTitle} onChange={(e)=>setNewLessonTitle(e.target.value)} placeholder="Nome da aula" className="h-9 rounded-xl bg-transparent border px-3 text-sm" />
            <input value={newLessonVideo} onChange={(e)=>setNewLessonVideo(e.target.value)} placeholder="URL do vídeo (Vimeo)" className="h-9 rounded-xl bg-transparent border px-3 text-sm w-48" />
            <button onClick={addLesson} disabled={!activeModuleId} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] disabled:opacity-50 inline-flex items-center gap-1"><Plus size={14}/> Nova</button>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {lessonsOfModule.map((l) => (
            <li key={l.id} className="px-3 py-2 rounded-xl hover:bg-[var(--hover)]">{l.title}</li>
          ))}
          {activeModuleId && lessonsOfModule.length===0 && <li className="text-[var(--foreground)]/60">Nenhuma aula neste módulo.</li>}
          {!activeModuleId && <li className="text-[var(--foreground)]/60">Selecione um módulo.</li>}
        </ul>
      </div>
    </div>
  );
}


