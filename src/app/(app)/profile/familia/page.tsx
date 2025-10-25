"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Plus, UsersRound, Baby, UserCircle, ClipboardList, CalendarDays, BookOpen, Camera } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";

export default function FamiliaPage() {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRel, setMemberRel] = useState("");
  const [showEditMember, setShowEditMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editMemberName, setEditMemberName] = useState("");
  const [editMemberRel, setEditMemberRel] = useState("");
  const [editMemberAvatarUrl, setEditMemberAvatarUrl] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [childBirth, setChildBirth] = useState("");
  const [showEditChild, setShowEditChild] = useState(false);
  const [editChildId, setEditChildId] = useState<string | null>(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildBirth, setEditChildBirth] = useState("");
  const [editChildAvatarUrl, setEditChildAvatarUrl] = useState<string | null>(null);
  const { push } = useToast();

  function getAvatarPathFromUrl(url: string | null): string | null {
    if (!url) return null;
    const marker = "/avatars/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
  }

  useEffect(() => {
    (async () => {
      try {
        const supabase = getBrowserSupabaseClient();
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: fam, error: famErr } = await supabase
          .from("family_members")
          .select("id, name, relationship, avatar_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (famErr) console.warn("family_members indisponível:", famErr.message);
        setFamilyMembers(fam || []);

        const { data: kids, error: kidsErr } = await supabase
          .from("children")
          .select("id, name, birth_date, avatar_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (kidsErr) console.warn("children indisponível:", kidsErr.message);
        setChildren(kids || []);
      } catch (e) {
        console.warn("Falha ao carregar família:", e);
      }
    })();
  }, []);

  async function addMember() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = { user_id: user.id, name: memberName.trim(), relationship: memberRel.trim() };
    const { data, error } = await supabase.from("family_members").insert(payload).select("id, name, relationship, avatar_url").single();
    if (error) return push({ title: "Erro", message: error.message.includes("relation") ? "Tabela family_members não encontrada. Aplique as migrações no Supabase." : error.message, variant: "error" });
    setFamilyMembers((prev) => [data!, ...prev]);
    setMemberName(""); setMemberRel(""); setShowAddMember(false);
    push({ title: "Membro adicionado", message: "Estrutura familiar atualizada." });
  }

  async function updateMember() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase || !editMemberId) return;
    const payload: any = { name: editMemberName.trim(), relationship: editMemberRel.trim() };
    if (editMemberAvatarUrl) payload.avatar_url = editMemberAvatarUrl;
    const { error } = await supabase.from("family_members").update(payload).eq("id", editMemberId);
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setFamilyMembers((prev) => prev.map((m) => (m.id === editMemberId ? { ...m, ...payload } : m)));
    setShowEditMember(false);
    push({ title: "Membro atualizado", message: "Estrutura familiar atualizada." });
  }

  async function deleteMember(id: string) {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    push({ title: "Removido", message: "Membro excluído com sucesso." });
  }

  async function removeMemberAvatar() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase || !editMemberId) return;
    try {
      const path = getAvatarPathFromUrl(editMemberAvatarUrl);
      if (path) {
        await supabase.storage.from('avatars').remove([path]);
      }
      const { error } = await supabase.from('family_members').update({ avatar_url: null }).eq('id', editMemberId);
      if (error) throw error;
      setEditMemberAvatarUrl(null);
      setFamilyMembers(prev => prev.map(m => m.id === editMemberId ? { ...m, avatar_url: null } : m));
      push({ title: 'Foto removida', message: 'Avatar do membro removido.' });
    } catch (err) {
      push({ title: 'Erro ao remover avatar', message: err instanceof Error ? err.message : String(err), variant: 'error' });
    }
  }

  async function addChild() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = { user_id: user.id, name: childName.trim(), birth_date: childBirth || null };
    const { data, error } = await supabase.from("children").insert(payload).select("id, name, birth_date, avatar_url").single();
    if (error) return push({ title: "Erro", message: error.message.includes("relation") ? "Tabela children não encontrada. Aplique as migrações no Supabase." : error.message, variant: "error" });
    setChildren((prev) => [data!, ...prev]);
    setChildName(""); setChildBirth(""); setShowAddChild(false);
    push({ title: "Filho(a) adicionado", message: "Lista de filhos atualizada." });
  }

  async function updateChild() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase || !editChildId) return;
    const payload: any = { name: editChildName.trim(), birth_date: editChildBirth || null };
    if (editChildAvatarUrl) payload.avatar_url = editChildAvatarUrl;
    const { error } = await supabase.from("children").update(payload).eq("id", editChildId);
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setChildren((prev) => prev.map((c) => (c.id === editChildId ? { ...c, ...payload } : c)));
    setShowEditChild(false);
    push({ title: "Atualizado", message: "Dados atualizados." });
  }

  async function onUploadEditMemberAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split('.').pop();
      const name = `${Date.now()}.${ext}`;
      const path = `${user.id}/family/${editMemberId ?? 'new'}/${name}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setEditMemberAvatarUrl(data.publicUrl);
    } catch (err) {
      push({ title: "Erro ao enviar avatar", message: err instanceof Error ? err.message : String(err), variant: 'error' });
    }
  }

  async function onUploadEditChildAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split('.').pop();
      const name = `${Date.now()}.${ext}`;
      const path = `${user.id}/children/${editChildId ?? 'new'}/${name}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setEditChildAvatarUrl(data.publicUrl);
    } catch (err) {
      push({ title: "Erro ao enviar avatar", message: err instanceof Error ? err.message : String(err), variant: 'error' });
    }
  }

  async function deleteChild(id: string) {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setChildren((prev) => prev.filter((c) => c.id !== id));
    push({ title: "Removido", message: "Filho(a) excluído com sucesso." });
  }

  async function removeChildAvatar() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase || !editChildId) return;
    try {
      const path = getAvatarPathFromUrl(editChildAvatarUrl);
      if (path) {
        await supabase.storage.from('avatars').remove([path]);
      }
      const { error } = await supabase.from('children').update({ avatar_url: null }).eq('id', editChildId);
      if (error) throw error;
      setEditChildAvatarUrl(null);
      setChildren(prev => prev.map(c => c.id === editChildId ? { ...c, avatar_url: null } : c));
      push({ title: 'Foto removida', message: 'Avatar do filho removido.' });
    } catch (err) {
      push({ title: 'Erro ao remover avatar', message: err instanceof Error ? err.message : String(err), variant: 'error' });
    }
  }

  return (
    <Container fullWidth>
      <div className="flex h-full">
        {/* Sidebar interno - mesmo padrão do profile */}
        <aside className="hidden md:block shrink-0 h-screen bg-light-surface dark:bg-dark-surface transition-all duration-300 shadow-sm w-[240px] xl:w-[280px] p-4">
          <div className="mb-2" />
          <ul className="text-sm space-y-2">
            {/* Responsável */}
            <li>
              <a
                href="/profile"
                className={`flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle`}
              >
                <UserCircle size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Responsável</span>
              </a>
            </li>

            {/* Família (ativa) */}
            <li>
              <a
                href="/profile/familia"
                className={`flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left active-brand-subtle text-brand-accent`}
              >
                <UsersRound size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400">Família</span>
              </a>
            </li>

            {/* Separador visual */}
            <li className="my-4">
              <div className="h-px bg-light-border dark:bg-dark-border" />
            </li>

            {/* Acompanhamento */}
            <li>
              <a
                href="/profile/anamnese"
                className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer hover-brand-subtle"
              >
                <ClipboardList size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Anamnese</span>
              </a>
            </li>
            
            <li>
              <a
                href="/profile/rotina"
                className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer hover-brand-subtle"
              >
                <CalendarDays size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Rotina</span>
              </a>
            </li>
            
            <li>
              <a
                href="/profile/diario"
                className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer hover-brand-subtle"
              >
                <BookOpen size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Diário</span>
              </a>
            </li>
          </ul>
        </aside>

        <Section>
          <PageHeader title="Família" subtitle="Gerencie membros da família e filhos." />

          <div className="space-y-6">
            <Card className="shadow-sm border border-light-border dark:border-dark-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Estrutura Familiar</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Gerencie os membros da sua família</p>
                </div>
                <Button onClick={() => setShowAddMember(true)} className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar membro
                </Button>
              </div>

              <div className="space-y-3">
                {familyMembers.length === 0 && (
                  <div className="text-center py-8 text-light-muted dark:text-dark-muted">
                    <UsersRound className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum membro cadastrado.</p>
                  </div>
                )}

                {familyMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.name} />}
                        <AvatarFallback>{m.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-light-text dark:text-dark-text">{m.name}</div>
                        <div className="text-sm text-light-muted dark:text-dark-muted">{m.relationship}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditMemberId(m.id); setEditMemberName(m.name); setEditMemberRel(m.relationship); setEditMemberAvatarUrl(m.avatar_url ?? null); setShowEditMember(true); }}
                      >
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteMember(m.id)}>Excluir</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="shadow-sm border border-light-border dark:border-dark-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Filhos</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Gerencie as informações dos seus filhos</p>
                </div>
                <Button onClick={() => setShowAddChild(true)} className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar filho
                </Button>
              </div>

              <div className="space-y-3">
                {children.length === 0 && (
                  <div className="text-center py-8 text-light-muted dark:text-dark-muted">
                    <Baby className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum filho cadastrado.</p>
                  </div>
                )}

                {children.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {c.avatar_url && <AvatarImage src={c.avatar_url} alt={c.name} />}
                        <AvatarFallback>{c.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-light-text dark:text-dark-text">{c.name}</div>
                        <div className="text-sm text-light-muted dark:text-dark-muted">{c.birth_date ? new Date(c.birth_date).toLocaleDateString() : "Sem data"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditChildId(c.id); setEditChildName(c.name); setEditChildBirth(c.birth_date || ""); setEditChildAvatarUrl(c.avatar_url ?? null); setShowEditChild(true); }}>Editar</Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteChild(c.id)}>Excluir</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>
      </div>

      {/* Modal adicionar membro */}
      <Modal open={showAddMember} onClose={() => setShowAddMember(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Adicionar membro</h3>
          <div className="space-y-2">
            <Label htmlFor="memberName">Nome completo</Label>
            <Input id="memberName" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberRel">Parentesco</Label>
            <Input id="memberRel" value={memberRel} onChange={(e) => setMemberRel(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancelar</Button>
            <Button onClick={addMember} className="bg-brand-accent text-white hover:bg-brand-accent/90">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal adicionar filho */}
      <Modal open={showAddChild} onClose={() => setShowAddChild(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Adicionar filho</h3>
          <div className="space-y-2">
            <Label htmlFor="childName">Nome completo</Label>
            <Input id="childName" value={childName} onChange={(e) => setChildName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="childBirth">Data de nascimento (opcional)</Label>
            <Input id="childBirth" type="date" value={childBirth} onChange={(e) => setChildBirth(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddChild(false)}>Cancelar</Button>
            <Button onClick={addChild} className="bg-brand-accent text-white hover:bg-brand-accent/90">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal editar membro */}
      <Modal open={showEditMember} onClose={() => setShowEditMember(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Editar membro</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-light-border dark:border-dark-border bg-light-border/30 dark:bg-dark-border/30">
              <Avatar className="w-full h-full">
                {editMemberAvatarUrl && <AvatarImage src={editMemberAvatarUrl} alt={editMemberName || 'Avatar'} />}
                <AvatarFallback>{(editMemberName || 'F').split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-accent text-white shadow-sm cursor-pointer hover:bg-brand-accent/90">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={onUploadEditMemberAvatar} />
              </label>
            </div>
            <div className="text-sm text-light-muted dark:text-dark-muted">Atualize a foto do membro</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editMemberName">Nome completo</Label>
            <Input id="editMemberName" value={editMemberName} onChange={(e) => setEditMemberName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editMemberRel">Parentesco</Label>
            <Input id="editMemberRel" value={editMemberRel} onChange={(e) => setEditMemberRel(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditMember(false)}>Cancelar</Button>
            <Button onClick={updateMember} className="bg-brand-accent text-white hover:bg-brand-accent/90">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal editar filho */}
      <Modal open={showEditChild} onClose={() => setShowEditChild(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Editar filho</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-light-border dark:border-dark-border bg-light-border/30 dark:bg-dark-border/30">
              <Avatar className="w-full h-full">
                {editChildAvatarUrl && <AvatarImage src={editChildAvatarUrl} alt={editChildName || 'Avatar'} />}
                <AvatarFallback>{(editChildName || 'C').split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-accent text-white shadow-sm cursor-pointer hover:bg-brand-accent/90">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={onUploadEditChildAvatar} />
              </label>
            </div>
            <div className="text-sm text-light-muted dark:text-dark-muted">Atualize a foto do filho</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editChildName">Nome completo</Label>
            <Input id="editChildName" value={editChildName} onChange={(e) => setEditChildName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editChildBirth">Data de nascimento (opcional)</Label>
            <Input id="editChildBirth" type="date" value={editChildBirth} onChange={(e) => setEditChildBirth(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditChild(false)}>Cancelar</Button>
            <Button onClick={updateChild} className="bg-brand-accent text-white hover:bg-brand-accent/90">Salvar</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}


