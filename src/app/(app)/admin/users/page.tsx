"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { MoreVertical, Plus, Trash2, Pencil } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";

type Role = "admin" | "aluno" | "profissional";

export default function AdminUsersPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  const [list, setList] = useState<Array<{ id: string; email: string; full_name: string | null; role: Role | null }>>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("aluno");
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("aluno");
  const { confirm } = useConfirm();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/admin/users");
        const json = await resp.json();
        setList(json.users ?? []);
      } catch {}
    })();
  }, []);

  async function createUser() {
    if (!email) { push({ title: "Informe o e‑mail", message: "Campo e‑mail é obrigatório.", variant: "error" }); return; }
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, role }) });
      if (!resp.ok) throw new Error(await resp.text());
      push({ title: "Usuário criado", message: "E‑mail de confirmação enviado." });
      setEmail(""); setName(""); setRole("aluno"); setOpenAdd(false);
      // refresh lista
      const listResp = await fetch("/api/admin/users");
      const json = await listResp.json();
      setList(json.users ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      push({ title: "Erro", message: msg, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function removeUser(id: string) {
    if (!supabase) return;
    const ok = await confirm({ title: "Remover usuário?", message: "Esta ação é permanente.", confirmText: "Excluir", cancelText: "Cancelar" });
    if (!ok) return;
    // Remove do auth e do profiles
    try {
      const resp = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error(await resp.text());
      setList((prev) => prev.filter((u) => u.id !== id));
      push({ title: "Usuário removido", message: "Registro excluído com sucesso." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      push({ title: "Erro ao excluir", message: msg, variant: "error" });
    }
  }

  return (
    <Container>
      <Section>
        <PageHeader title="Usuários" subtitle="Criar e administrar contas: admin, aluno e profissional." />
        <div className="flex items-center justify-end mb-3">
          <button onClick={()=>setOpenAdd(true)} className="h-10 px-4 rounded-lg bg-[var(--accent-purple)] text-white inline-flex items-center gap-2"><Plus size={14}/> Adicionar usuário</button>
        </div>
        <Card>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--foreground)]/70">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E‑mail</th>
                  <th className="py-2 pr-4">Permissão</th>
                  <th className="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.id} className="border-t border-[var(--border)]">
                    <td className="py-2 pr-4">{u.full_name || "—"}</td>
                    <td className="py-2 pr-4">{u.email || u.id}</td>
                    <td className="py-2 pr-4">{u.role || "—"}</td>
                    <td className="py-2 text-right">
                      <RowMenu onEdit={()=>{ setEditId(u.id); setEditName(u.full_name ?? ""); setEditRole((u.role as Role) ?? "aluno"); setOpenEdit(true); }} onDelete={()=>removeUser(u.id)} />
                    </td>
                  </tr>
                ))}
                {list.length===0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[var(--foreground)]/60">Nenhum usuário listado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal open={openAdd} onClose={()=>setOpenAdd(false)}>
          <div className="text-lg font-semibold mb-2">Adicionar usuário</div>
          <div className="grid gap-3">
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">E‑mail</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Permissão</label>
              <select value={role} onChange={(e)=>setRole(e.target.value as Role)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3">
                <option value="aluno">Aluno</option>
                <option value="profissional">Profissional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={()=>setOpenAdd(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={createUser} disabled={loading} className="h-10 px-4 rounded-lg bg-[var(--accent-purple)] text-white hover:brightness-110 disabled:opacity-50">{loading?"Criando...":"Criar"}</button>
            </div>
          </div>
        </Modal>

        <Modal open={openEdit} onClose={()=>setOpenEdit(false)}>
          <div className="text-lg font-semibold mb-2">Editar usuário</div>
          <div className="grid gap-3">
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={editName} onChange={(e)=>setEditName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Permissão</label>
              <select value={editRole} onChange={(e)=>setEditRole(e.target.value as Role)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3">
                <option value="aluno">Aluno</option>
                <option value="profissional">Profissional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={()=>setOpenEdit(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={async ()=>{
                if (!editId) return;
                try {
                  const resp = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, full_name: editName, role: editRole }) });
                  if (!resp.ok) throw new Error(await resp.text());
                  setOpenEdit(false);
                  // refresh lista
                  const listResp = await fetch("/api/admin/users");
                  const json = await listResp.json();
                  setList(json.users ?? []);
                  push({ title: "Usuário atualizado", message: "Alterações salvas." });
                } catch (e) {
                  const msg = e instanceof Error ? e.message : String(e);
                  push({ title: "Erro ao atualizar", message: msg, variant: "error" });
                }
              }} className="h-10 px-4 rounded-lg bg-[var(--accent-purple)] text-white hover:brightness-110">Salvar</button>
            </div>
          </div>
        </Modal>
      </Section>
    </Container>
  );
}

function RowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }){
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  function toggle() {
    const anchor = btnRef.current;
    if (!anchor) return setOpen((v)=>!v);
    const r = anchor.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.right - 150 });
    setOpen((v)=>!v);
  }

  // close on outside click / escape / scroll
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const anchor = btnRef.current as Node | null;
      if (anchor && e.target instanceof Node && anchor.contains(e.target)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent){ if (e.key === "Escape") setOpen(false); }
    function onScroll(){ setOpen(false); }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  return (
    <>
      <button ref={btnRef as any} onClick={toggle} className="h-8 w-8 rounded-lg hover:bg-[var(--hover)] grid place-items-center" aria-haspopup="menu" aria-expanded={open}>
        <MoreVertical size={14} />
      </button>
      {open && coords && createPortal(
        <div className="fixed z-50 w-40 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-soft py-1" style={{ top: coords.top, left: coords.left }}>
          <button onClick={()=>{ setOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover)] text-sm"><Pencil size={14}/> Editar</button>
          <button onClick={()=>{ setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover)] text-sm text-red-600"><Trash2 size={14}/> Excluir</button>
        </div>, document.body
      )}
    </>
  );
}


