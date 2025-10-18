"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface LessonForm { title: string; description: string; videoUrl: string; materialsUrl?: string }
interface ModuleForm { title: string; lessons: LessonForm[] }
interface TrailForm { title: string; modules: ModuleForm[] }

export default function AdminTrailsPage() {
  const [trails, setTrails] = useState<TrailForm[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<TrailForm>({ title: "", modules: [{ title: "Módulo 1", lessons: [{ title: "Aula 1", description: "", videoUrl: "", materialsUrl: "" }] }] });

  function addModule() {
    setForm((f) => ({ ...f, modules: [...f.modules, { title: `Módulo ${f.modules.length + 1}`, lessons: [{ title: "Aula 1", description: "", videoUrl: "", materialsUrl: "" }] }] }));
  }

  function addLesson(modIdx: number) {
    setForm((f) => {
      const copy = structuredClone(f);
      copy.modules[modIdx].lessons.push({ title: `Aula ${copy.modules[modIdx].lessons.length + 1}`, description: "", videoUrl: "", materialsUrl: "" });
      return copy;
    });
  }

  function saveTrail() {
    if (!form.title.trim()) return;
    setTrails((t) => [...t, form]);
    setForm({ title: "", modules: [{ title: "Módulo 1", lessons: [{ title: "Aula 1", description: "", videoUrl: "", materialsUrl: "" }] }] });
    setIsCreating(false);
  }

  return (
    <main className="p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trilhas</h1>
          <p className="text-[var(--foreground)]/70 mt-1">Crie trilhas, módulos e aulas em um fluxo único.</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] inline-flex items-center gap-1">
          <Plus size={14}/> Criar trilha
        </button>
      </div>

      {isCreating && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div>
            <label className="text-sm">Nome da trilha</label>
            <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="mt-1 w-full h-10 rounded-xl bg-transparent border px-3" placeholder="Ex.: Introdução" />
          </div>
          <div className="mt-4 space-y-4">
            {form.modules.map((m, mi)=> (
              <div key={mi} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm">Nome do módulo</label>
                    <input value={m.title} onChange={(e)=>{
                      const copy = structuredClone(form); copy.modules[mi].title = e.target.value; setForm(copy);
                    }} className="mt-1 w-full h-10 rounded-xl bg-transparent border px-3" placeholder="Módulo A" />
                  </div>
                  <button onClick={()=>addLesson(mi)} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Adicionar aula</button>
                </div>
                <div className="mt-3 space-y-3">
                  {m.lessons.map((l, li)=> (
                    <div key={li} className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm">Nome da aula</label>
                        <input value={l.title} onChange={(e)=>{
                          const copy = structuredClone(form); copy.modules[mi].lessons[li].title = e.target.value; setForm(copy);
                        }} className="mt-1 w-full h-10 rounded-xl bg-transparent border px-3" placeholder="Aula 1" />
                      </div>
                      <div>
                        <label className="text-sm">Link do vídeo (YouTube/Vimeo)</label>
                        <input value={l.videoUrl} onChange={(e)=>{
                          const copy = structuredClone(form); copy.modules[mi].lessons[li].videoUrl = e.target.value; setForm(copy);
                        }} className="mt-1 w-full h-10 rounded-xl bg-transparent border px-3" placeholder="https://..." />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm">Descrição</label>
                        <textarea value={l.description} onChange={(e)=>{
                          const copy = structuredClone(form); copy.modules[mi].lessons[li].description = e.target.value; setForm(copy);
                        }} className="mt-1 w-full h-24 rounded-xl bg-transparent border px-3 py-2 resize-none" placeholder="Sobre a aula" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm">Materiais complementares (URL)</label>
                        <input value={l.materialsUrl || ""} onChange={(e)=>{
                          const copy = structuredClone(form); copy.modules[mi].lessons[li].materialsUrl = e.target.value; setForm(copy);
                        }} className="mt-1 w-full h-10 rounded-xl bg-transparent border px-3" placeholder="https://...pdf" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={addModule} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] inline-flex items-center gap-1"><Plus size={14}/> Adicionar módulo</button>
            <button onClick={saveTrail} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Salvar trilha</button>
            <button onClick={()=>setIsCreating(false)} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
          </div>
        </div>
      )}

      {/* Tabela de trilhas */}
      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-lg font-semibold">Trilhas criadas</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[var(--foreground)]/60">
              <tr>
                <th className="text-left py-2">Trilha</th>
                <th className="text-left py-2">Módulos</th>
                <th className="text-left py-2">Aulas</th>
              </tr>
            </thead>
            <tbody>
              {trails.map((t, i)=> {
                const modulesCount = t.modules.length;
                const lessonsCount = t.modules.reduce((acc,m)=> acc + m.lessons.length, 0);
                return (
                  <tr key={i} className="border-t border-[var(--border)]">
                    <td className="py-2 font-medium">{t.title}</td>
                    <td className="py-2">{modulesCount}</td>
                    <td className="py-2">{lessonsCount}</td>
                  </tr>
                );
              })}
              {trails.length===0 && (
                <tr className="border-t border-[var(--border)]">
                  <td className="py-3 text-[var(--foreground)]/60" colSpan={3}>Nenhuma trilha cadastrada ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}


