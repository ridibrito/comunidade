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
import { MoreVertical, Plus, Trash2, Pencil, Users, Mail, Shield, TrendingUp, Activity, Clock, CheckCircle, AlertCircle, Send, UserCheck, Key, Copy } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToastContext } from "@/components/providers/ToastProvider";
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
  const { success, error, warning, info } = useToastContext();
  const { confirm } = useConfirm();
  
  // Estados para dados reais do Supabase
  const [realUsers, setRealUsers] = useState<User[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Estado para abas de filtro
  const [activeTab, setActiveTab] = useState<"all" | "admin" | "aluno" | "profissional">("all");
  
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
        
        warning("Usando dados de demonstração", "Não foi possível conectar com o banco de dados. Exibindo dados mockados.");
      } finally {
        setLoading(false);
      }
    })();
  }, [warning]);

  async function createUser() {
    if (!email) { error("Informe o e‑mail", "Campo e‑mail é obrigatório."); return; }
    
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
      
        if (result.success) {
          const emailStatus = result.emailSent ? 
            "📧 Email com credenciais enviado automaticamente" : 
            "📧 Email não foi enviado";
          
          const credentials = result.credentials ? 
            `\n\n🔑 Credenciais Geradas:\nEmail: ${result.credentials.email}\nSenha: ${result.credentials.tempPassword}` : 
            "";
          
          success("Usuário criado com sucesso", `${result.message}\n\n${emailStatus}${credentials}\n\nO usuário receberá um email com as credenciais e poderá fazer login imediatamente.`);
        } else {
          error("Erro", result.error || "Erro ao criar usuário");
        }
      setEmail(""); setName(""); setRole("aluno"); setOpenAdd(false);
      // refresh lista
      const listResp = await fetch("/api/admin/users");
      const json = await listResp.json();
      setRealUsers(json.users ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error("Erro", msg);
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
      success("Usuário removido", "Registro excluído com sucesso.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error("Erro ao excluir", msg);
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
      case "pending":
        return (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-500" />
            <Badge variant="warning" size="sm">Convite Pendente</Badge>
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

  async function removeUser(id: string) {
    const ok = await confirm({ title: "Excluir usuário", message: "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita." });
    if (!ok) return;
    
    if (useMockData) {
      await mockUsersHook.removeUser(id);
      return;
    }
    
    try {
      const resp = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error(await resp.text());
      // refresh lista
      const listResp = await fetch("/api/admin/users");
      const json = await listResp.json();
      setRealUsers(json.users ?? []);
      success("Usuário excluído", "Usuário removido com sucesso.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error("Erro ao excluir", msg);
    }
  }

  async function toggleUserActive(id: string, currentStatus: boolean) {
    const action = currentStatus ? "desativar" : "ativar";
    const ok = await confirm({ 
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} usuário`, 
      message: `Tem certeza que deseja ${action} este usuário?` 
    });
    if (!ok) return;
    
    try {
      const resp = await fetch("/api/admin/users", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id, action: "toggle_active" }) 
      });
      if (!resp.ok) throw new Error(await resp.text());
      const result = await resp.json();
      
      // refresh lista
      const listResp = await fetch("/api/admin/users");
      const json = await listResp.json();
      setRealUsers(json.users ?? []);
      
      success(result.message, `Usuário ${result.is_active ? 'ativado' : 'desativado'} com sucesso.`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error("Erro ao alterar status", msg);
    }
  }

  async function resetUserPassword(id: string) {
    const ok = await confirm({ 
      title: "Resetar senha", 
      message: "Tem certeza que deseja enviar um link de reset de senha para este usuário?" 
    });
    if (!ok) return;
    
    try {
      const resp = await fetch("/api/admin/users", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id, action: "reset_password" }) 
      });
      if (!resp.ok) throw new Error(await resp.text());
      const result = await resp.json();
      
      if (result.ok) {
        success(result.message, "Link de reset de senha enviado por email para o usuário.");
      } else {
        error("Erro ao enviar link de reset", result.message || "Não foi possível enviar o link de reset de senha.");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error("Erro ao resetar senha", msg);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      success("Copiado", "Senha copiada para a área de transferência.");
    }).catch(() => {
      error("Erro", "Não foi possível copiar a senha.");
    });
  }

  // Função para filtrar usuários por aba
  const getFilteredUsers = () => {
    if (activeTab === "all") {
      return list;
    }
    return list.filter(user => user.role === activeTab);
  };

  const filteredUsers = getFilteredUsers();

  return (
    <Container fullWidth>
      <Section>
        <PageHeader title="Usuários" subtitle="Criar e administrar contas. Novos usuários recebem email de convite para definir senha." />
        
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
        
        
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <ModernCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-light-text dark:text-dark-text">{filteredUsers.length}</div>
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
                  {filteredUsers.filter(u => u.invite_status === "accepted").length}
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
                  {filteredUsers.filter(u => u.invite_status === "pending").length}
                </div>
                <div className="text-sm text-light-muted dark:text-dark-muted">Convites Pendentes</div>
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
                  {filteredUsers.filter(u => u.last_login_at && new Date(u.last_login_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
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

        {/* Abas de Filtro */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Todos ({list.length})
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "admin"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Administradores ({list.filter(u => u.role === "admin").length})
              </button>
              <button
                onClick={() => setActiveTab("aluno")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "aluno"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Alunos ({list.filter(u => u.role === "aluno").length})
              </button>
              <button
                onClick={() => setActiveTab("profissional")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profissional"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Profissionais ({list.filter(u => u.role === "profissional").length})
              </button>
            </nav>
          </div>
        </div>

        <ModernCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E‑mail</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{u.full_name || "—"}</span>
                      {u.is_active === false && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full">
                          Inativo
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{u.email || u.id}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getInviteStatusBadge(u)}
                      {u.is_active === false && (
                        <span className="text-xs text-red-600 dark:text-red-400">Usuário desativado</span>
                      )}
                    </div>
                  </TableCell>
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
                    <RowMenu 
                      onEdit={()=>{ setEditId(u.id); setEditName(u.full_name ?? ""); setEditRole((u.role as Role) ?? "aluno"); setOpenEdit(true); }} 
                      onDelete={()=>removeUser(u.id)}
                      onToggleActive={()=>toggleUserActive(u.id, u.is_active)}
                      onResetPassword={()=>resetUserPassword(u.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length===0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-light-muted dark:text-dark-muted">
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
                    success("Usuário atualizado", "Alterações salvas.");
                  } catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    error("Erro ao atualizar", msg);
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

function RowMenu({ onEdit, onDelete, onToggleActive, onResetPassword }: { 
  onEdit: () => void; 
  onDelete: () => void; 
  onToggleActive?: () => void;
  onResetPassword?: () => void;
}){
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
        <div className="fixed z-50 w-48 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-lg py-1" style={{ top: coords.top, left: coords.left }}>
          <button 
            onClick={()=>{ setOpen(false); onEdit(); }} 
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-sm text-light-text dark:text-dark-text transition-colors"
          >
            <Pencil size={14}/> Editar
          </button>
          {onToggleActive && (
            <button 
              onClick={()=>{ setOpen(false); onToggleActive(); }} 
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-sm text-orange-600 dark:text-orange-400 transition-colors"
            >
              <UserCheck size={14}/> Ativar/Desativar
            </button>
          )}
          {onResetPassword && (
            <button 
              onClick={()=>{ setOpen(false); onResetPassword(); }} 
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 text-sm text-blue-600 dark:text-blue-400 transition-colors"
            >
              <Key size={14}/> Resetar Senha
            </button>
          )}
          <div className="border-t border-light-border dark:border-dark-border my-1"></div>
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