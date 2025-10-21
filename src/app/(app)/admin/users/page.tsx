"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { MoreVertical, Plus, Trash2, Pencil, Users, Mail, Shield, TrendingUp, Activity, Clock, CheckCircle, AlertCircle, Send, UserCheck } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import DebugSupabase from "@/components/ui/DebugSupabase";
import { useMockUsers } from "@/components/ui/MockUsers";

type Role = "admin" | "aluno" | "profissional";
type InviteStatus = "pending" | "sent" | "accepted" | "expired";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: Role | null;
  invite_status?: InviteStatus;
  invite_sent_at?: string;
  last_login_at?: string;
  login_count?: number;
  invited_by?: string;
  invite_email?: string;
}

export default function AdminUsersPage() {
  const supabase = getBrowserSupabaseClient();
  const { push } = useToast();
  const { confirm } = useConfirm();
  
  // Estados para dados reais do Supabase
  const [realUsers, setRealUsers] = useState<User[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Hook para dados mockados
  const mockUsersHook = useMockUsers();
  
  // Estados para modais e formulários
  const [openAdd, setOpenAdd] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("aluno");
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("aluno");
  
  // Usar dados mockados se não conseguir conectar com o banco
  const list = useMockData ? mockUsersHook.users : realUsers;
  const isLoading = useMockData ? mockUsersHook.loading : loading;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/admin/users");
        
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
        
        const json = await resp.json();
        console.log("Users API response:", json);
        
        if (json.users) {
          setRealUsers(json.users);
          setUseMockData(false);
          setDbError(null);
          console.log(`Carregados ${json.users.length} usuários do banco de dados`);
        } else {
          // Se não há usuários reais, usar dados mockados
          console.log("Nenhum usuário encontrado no banco, usando dados mockados");
          setUseMockData(true);
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setDbError(error instanceof Error ? error.message : "Erro desconhecido");
        setUseMockData(true);
        
        push({ 
          title: "Usando dados de demonstração", 
          message: "Não foi possível conectar com o banco de dados. Exibindo dados mockados.", 
          variant: "warning" 
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [push]);

  async function createUser() {
    if (!email) { push({ title: "Informe o e‑mail", message: "Campo e‑mail é obrigatório.", variant: "error" }); return; }
    
    if (useMockData) {
      // Usar dados mockados
      await mockUsersHook.createUser({ email, full_name: name, role });
      setEmail(""); setName(""); setRole("aluno"); setOpenAdd(false);
      return;
    }
    
    setLoading(true);
    try {
      const resp = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, role }) });
      if (!resp.ok) throw new Error(await resp.text());
      const result = await resp.json();
      
      if (result.emailSent) {
        push({ title: "Convite enviado", message: result.message || "E‑mail de convite enviado com sucesso via Supabase." });
      } else if (result.supabaseError) {
        // Se houve erro no Supabase, mostrar o link para envio manual
        const linkText = result.inviteLink ? `\n\nLink de convite: ${result.inviteLink}` : '';
        push({ 
          title: "Usuário criado", 
          message: `${result.message}${linkText}`,
          variant: "warning"
        });
      } else {
        push({ title: "Convite enviado", message: result.message || "E‑mail de convite enviado com sucesso." });
      }
      setEmail(""); setName(""); setRole("aluno"); setOpenAdd(false);
      // refresh lista
      const listResp = await fetch("/api/admin/users");
      const json = await listResp.json();
      setRealUsers(json.users ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      push({ title: "Erro", message: msg, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function removeUser(id: string) {
    const ok = await confirm({ title: "Remover usuário?", message: "Esta ação é permanente.", confirmText: "Excluir", cancelText: "Cancelar" });
    if (!ok) return;
    
    if (useMockData) {
      // Usar dados mockados
      await mockUsersHook.deleteUser(id);
      return;
    }
    
    // Remove do auth e do profiles
    try {
      const resp = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error(await resp.text());
      setRealUsers((prev) => prev.filter((u) => u.id !== id));
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

  const getInviteStatusBadge = (user: User) => {
    const status = user.invite_status || 'pending';
    
    switch (status) {
      case "sent":
        return (
          <div className="flex items-center gap-1">
            <Send className="w-3 h-3 text-blue-500" />
            <Badge variant="outline" size="sm">Convite Enviado</Badge>
          </div>
        );
      case "accepted":
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <Badge variant="success" size="sm">Ativo</Badge>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <Badge variant="error" size="sm">Convite Expirado</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-500" />
            <Badge variant="warning" size="sm">Pendente</Badge>
          </div>
        );
    }
  };

  const getLastActivity = (user: User) => {
    if (user.last_login_at) {
      const lastLogin = new Date(user.last_login_at);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));
      
      if (diffHours < 24) {
        return `${diffHours}h atrás`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d atrás`;
      }
    }
    return "Nunca";
  };

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Usuários" subtitle="Criar e administrar contas: admin, aluno e profissional." />
        
        {useMockData && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Modo Demonstração:</strong> Exibindo dados mockados. Configure o banco de dados para usar dados reais.
              </span>
            </div>
          </div>
        )}
        
        {!useMockData && realUsers.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800 dark:text-green-200">
                <strong>Conectado ao Banco:</strong> Exibindo {realUsers.length} usuário{realUsers.length !== 1 ? 's' : ''} real{realUsers.length !== 1 ? 'is' : ''} do banco de dados.
              </span>
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {list.filter(u => u.invite_status === "accepted").length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Usuários Ativos</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Send className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {list.filter(u => u.invite_status === "sent").length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Convites Enviados</div>
              </div>
            </div>
          </ModernCard>
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {list.filter(u => u.last_login_at && new Date(u.last_login_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Ativos (24h)</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E‑mail</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Status do Convite</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                  <TableCell>{u.email || u.id}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>{getInviteStatusBadge(u)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-light-muted dark:text-dark-muted">
                        {getLastActivity(u)}
                      </span>
                      {u.login_count && u.login_count > 0 && (
                        <span className="text-xs text-light-muted dark:text-dark-muted">
                          {u.login_count} login{u.login_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowMenu onEdit={()=>{ setEditId(u.id); setEditName(u.full_name ?? ""); setEditRole((u.role as Role) ?? "aluno"); setOpenEdit(true); }} onDelete={()=>removeUser(u.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {list.length===0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-light-muted dark:text-dark-muted">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="text-lg font-medium mb-1">Nenhum usuário encontrado</div>
                    <div className="text-sm">Comece adicionando um novo usuário</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                disabled={isLoading} 
                className="h-10 px-4 rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 disabled:opacity-50 transition-colors"
              >
                {isLoading?"Criando...":"Criar"}
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
                  
                  if (useMockData) {
                    // Usar dados mockados
                    await mockUsersHook.updateUser(editId, { full_name: editName, role: editRole });
                    setOpenEdit(false);
                    return;
                  }
                  
                  try {
                    const resp = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, full_name: editName, role: editRole }) });
                    if (!resp.ok) throw new Error(await resp.text());
                    setOpenEdit(false);
                    // refresh lista
                    const listResp = await fetch("/api/admin/users");
                    const json = await listResp.json();
                    setRealUsers(json.users ?? []);
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

        <DebugSupabase />
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