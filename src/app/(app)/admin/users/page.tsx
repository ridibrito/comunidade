"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { MoreVertical, Plus, Trash2, Pencil, Users, Mail, Shield } from "lucide-react";
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

  const getRoleBadge = (role: Role | null) => {
    switch (role) {
      case "admin":
        return <Badge variant="error" size="sm">Admin</Badge>;
      case "profissional":
        return <Badge variant="info" size="sm">Profissional</Badge>;
      case "aluno":
        return <Badge variant="success" size="sm">Aluno</Badge>;
      default:
        return <Badge variant="outline" size="sm">—</Badge>;
    }
  };

  return (
    <Container>
      <Section>
        <PageHeader title="Usuários" subtitle="Criar e administrar contas: admin, aluno e profissional." />
        
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">{list.length}</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Total de usuários</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {list.filter(u => u.role === "admin").length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Administradores</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {list.filter(u => u.role === "aluno").length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Alunos</div>
              </div>
            </div>
          </ModernCard>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Lista de usuários</h2>
          <button 
            onClick={()=>setOpenAdd(true)} 
            className="h-10 px-4 rounded-lg bg-brand-accent text-white inline-flex items-center gap-2 hover:bg-brand-accent/90 transition-colors"
          >
            <Plus size={14}/> Adicionar usuário
          </button>
        </div>

        <ModernCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Nome</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">E‑mail</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium">Permissão</th>
                  <th className="text-left py-3 text-light-muted dark:text-dark-muted font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.id} className="border-b border-light-border/50 dark:border-dark-border/50 hover:bg-light-border/20 dark:hover:bg-dark-border/20 transition-colors">
                    <td className="py-3 text-light-text dark:text-dark-text font-medium">{u.full_name || "—"}</td>
                    <td className="py-3 text-light-text dark:text-dark-text">{u.email || u.id}</td>
                    <td className="py-3">{getRoleBadge(u.role)}</td>
                    <td className="py-3 text-right">
                      <RowMenu onEdit={()=>{ setEditId(u.id); setEditName(u.full_name ?? ""); setEditRole((u.role as Role) ?? "aluno"); setOpenEdit(true); }} onDelete={()=>removeUser(u.id)} />
                    </td>
                  </tr>
                ))}
                {list.length===0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-light-muted dark:text-dark-muted">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <div className="text-lg font-medium mb-1">Nenhum usuário encontrado</div>
                      <div className="text-sm">Comece adicionando um novo usuário</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ModernCard>

        <Modal open={openAdd} onClose={()=>setOpenAdd(false)}>
          <div className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">Adicionar usuário</div>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">Nome completo</label>
              <input 
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
                placeholder="Digite o nome completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">E‑mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
                placeholder="usuario@exemplo.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">Permissão</label>
              <select 
                value={role} 
                onChange={(e)=>setRole(e.target.value as Role)} 
                className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              >
                <option value="aluno">Aluno</option>
                <option value="profissional">Profissional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={()=>setOpenAdd(false)} 
                className="h-10 px-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={createUser} 
                disabled={loading} 
                className="h-10 px-4 rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 disabled:opacity-50 transition-colors"
              >
                {loading?"Criando...":"Criar"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal open={openEdit} onClose={()=>setOpenEdit(false)}>
          <div className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">Editar usuário</div>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">Nome completo</label>
              <input 
                value={editName} 
                onChange={(e)=>setEditName(e.target.value)} 
                className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" 
                placeholder="Digite o nome completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">Permissão</label>
              <select 
                value={editRole} 
                onChange={(e)=>setEditRole(e.target.value as Role)} 
                className="mt-1 w-full h-11 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 text-light-text dark:text-dark-text focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              >
                <option value="aluno">Aluno</option>
                <option value="profissional">Profissional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={()=>setOpenEdit(false)} 
                className="h-10 px-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-light-text dark:text-dark-text transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={async ()=>{
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
                }} 
                className="h-10 px-4 rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors"
              >
                Salvar
              </button>
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
      <button 
        ref={btnRef} 
        onClick={toggle} 
        className="h-8 w-8 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 grid place-items-center transition-colors" 
        aria-haspopup="menu" 
        aria-expanded={open}
      >
        <MoreVertical size={14} className="text-light-muted dark:text-dark-muted" />
      </button>
      {open && coords && createPortal(
        <div className="fixed z-50 w-40 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-lg py-1" style={{ top: coords.top, left: coords.left }}>
          <button 
            onClick={()=>{ setOpen(false); onEdit(); }} 
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-sm text-light-text dark:text-dark-text transition-colors"
          >
            <Pencil size={14}/> Editar
          </button>
          <button 
            onClick={()=>{ setOpen(false); onDelete(); }} 
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-sm text-red-600 dark:text-red-400 transition-colors"
          >
            <Trash2 size={14}/> Excluir
          </button>
        </div>, document.body
      )}
    </>
  );
}