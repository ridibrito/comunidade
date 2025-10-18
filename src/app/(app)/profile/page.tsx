"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPhoneBR, formatCEP, formatUF } from "@/lib/masks";
import MaskedInput from "@/components/ui/MaskedInput";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { UserCircle, UsersRound, ClipboardList, CalendarDays, BookOpen, Camera, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [section, setSection] = useState<"responsavel" | "familia">("responsavel");
  const searchParams = useSearchParams();

  const { push } = useToast();

  // Família (lista e modais)
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: string; name: string; relationship: string; avatar_url?: string | null }>>([]);
  const [childrenList, setChildrenList] = useState<Array<{ id: string; name: string; birth_date: string | null; avatar_url?: string | null }>>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRel, setMemberRel] = useState("");
  const [childName, setChildName] = useState("");
  const [childBirth, setChildBirth] = useState("");
  const [memberAvatarUploading, setMemberAvatarUploading] = useState(false);
  const [memberAvatarUrl, setMemberAvatarUrl] = useState<string | null>(null);
  const [childAvatarUploading, setChildAvatarUploading] = useState(false);
  const [childAvatarUrl, setChildAvatarUrl] = useState<string | null>(null);

  // Editar membro
  const [showEditMember, setShowEditMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editMemberName, setEditMemberName] = useState("");
  const [editMemberRel, setEditMemberRel] = useState("");
  const [editMemberAvatarUrl, setEditMemberAvatarUrl] = useState<string | null>(null);
  const [editMemberUploading, setEditMemberUploading] = useState(false);

  // Editar filho
  const [showEditChild, setShowEditChild] = useState(false);
  const [editChildId, setEditChildId] = useState<string | null>(null);
  const [editChildName, setEditChildName] = useState("");
  const [editChildBirth, setEditChildBirth] = useState("");
  const [editChildAvatarUrl, setEditChildAvatarUrl] = useState<string | null>(null);
  const [editChildUploading, setEditChildUploading] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
      if (!user) return;
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (error && status !== 406) throw error;
        if (!data) {
          await supabase.from("profiles").upsert({ id: user.id, full_name: "" });
          return;
        }
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url ?? null);
        setPhone(data.phone ?? "");
        setZip(data.zip ?? "");
        setStreet(data.street ?? "");
        setNumber(data.number ?? "");
        setComplement(data.complement ?? "");
        setDistrict(data.district ?? "");
        setCity(data.city ?? "");
        setStateUF(data.state ?? "");
      } catch (err: any) {
        console.warn("Falha ao carregar perfil:", err?.message ?? err);
      }
    }
    load();
  }, []);

  // Carrega família quando a aba é aberta
  useEffect(() => {
    if (section !== "familia") return;
    (async () => {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: members } = await supabase
        .from("family_members")
        .select("id, name, relationship, avatar_url")
        .eq("user_id", user.id);
      setFamilyMembers(members ?? []);
      const { data: kids } = await supabase
        .from("children")
        .select("id, name, birth_date, avatar_url")
        .eq("user_id", user.id);
      setChildrenList(kids ?? []);
    })();
  }, [section]);

  async function addMember() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error, data } = await supabase
      .from("family_members")
      .insert({ user_id: user.id, name: memberName.trim(), relationship: memberRel.trim(), avatar_url: memberAvatarUrl })
      .select("id, name, relationship, avatar_url")
      .maybeSingle();
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setFamilyMembers((prev) => data ? [data, ...prev] : prev);
    setMemberName(""); setMemberRel(""); setShowAddMember(false);
    push({ title: "Membro adicionado", message: "Estrutura familiar atualizada." });
  }

  async function addChild() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error, data } = await supabase
      .from("children")
      .insert({ user_id: user.id, name: childName.trim(), birth_date: childBirth || null, avatar_url: childAvatarUrl })
      .select("id, name, birth_date")
      .maybeSingle();
    if (error) return push({ title: "Erro", message: error.message, variant: "error" });
    setChildrenList((prev) => data ? [data, ...prev] : prev);
    setChildName(""); setChildBirth(""); setShowAddChild(false);
    push({ title: "Filho(a) adicionado", message: "Lista de filhos atualizada." });
  }

  useEffect(() => {
    const s = searchParams?.get("s");
    if (s === "familia") setSection("familia");
    if (s === "responsavel") setSection("responsavel");
  }, [searchParams]);

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    // preview imediato
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      // caminho dentro do bucket (sem repetir o nome do bucket)
      const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true, contentType: file.type });
      if (error) {
        push({ title: "Falha no upload", message: error.message, variant: "error" });
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(publicUrl);
      // persiste no perfil imediatamente
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: publicUrl,
          phone,
          zip,
          street,
          number,
          complement,
          district,
          city,
          state: stateUF,
        });
        await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: publicUrl } });
      }
      push({ title: "Avatar atualizado", message: "Sua foto foi atualizada com sucesso." });
    } finally {
      setUploading(false);
      // revoga o preview local para liberar memória
      try { URL.revokeObjectURL(localPreviewUrl); } catch {}
    }
  }

  async function onSave() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        phone,
        zip,
        street,
        number,
        complement,
        district,
        city,
        state: stateUF,
      });
      if (upsertErr) throw upsertErr;
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      if (pwd && pwd.length >= 8 && pwd === pwdConfirm) {
        await supabase.auth.updateUser({ password: pwd });
        setPwd(""); setPwdConfirm("");
      }
      push({ title: "Perfil salvo", message: "Dados do responsável atualizados." });
    } catch (err: any) {
      push({ title: "Erro ao salvar", message: err?.message ?? String(err), variant: "error" });
    }
  }

  return (
    <main className="p-0 h-[calc(100vh-64px)] overflow-hidden ">
      <div className="flex h-full">
        <aside className="hidden md:block shrink-0 h-full bg-[var(--surface)] transition-all duration-300 border-r border-[var(--border)] w-[280px] xl:w-[340px] p-4">
          <ul className="text-sm space-y-1">
            <li>
              <button onClick={() => setSection("responsavel")} className={`flex w-full items-center gap-3 rounded-xl transition-colors px-4 py-3 ${section === "responsavel" ? "bg-[var(--hover)] text-[var(--accent-purple)]" : "hover:bg-[var(--hover)]"}`}>
                <UserCircle size={18} className={section === "responsavel" ? "text-[var(--accent-purple)]" : "text-[var(--foreground)]/80"} />
                <span className="text-[var(--foreground)]">Responsável</span>
              </button>
            </li>
            <li>
              <button onClick={() => setSection("familia")} className={`flex w-full items-center gap-3 rounded-xl transition-colors px-4 py-3 ${section === "familia" ? "bg-[var(--hover)] text-[var(--accent-purple)]" : "hover:bg-[var(--hover)]"}`}>
                <UsersRound size={18} className={section === "familia" ? "text-[var(--accent-purple)]" : "text-[var(--foreground)]/80"} />
                <span className="text-[var(--foreground)]">Família</span>
              </button>
            </li>
            <li className="pt-2 mt-2 border-t border-[var(--border)]" />
            <li>
              <a href="/profile/anamnese" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 hover:bg-[var(--hover)]">
                <ClipboardList size={18} className="text-[var(--foreground)]/80" />
                <span className="text-[var(--foreground)]">Anamnese</span>
              </a>
            </li>
            <li>
              <a href="/profile/rotina" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 hover:bg-[var(--hover)]">
                <CalendarDays size={18} className="text-[var(--foreground)]/80" />
                <span className="text-[var(--foreground)]">Rotina</span>
              </a>
            </li>
            <li>
              <a href="/profile/diario" className="flex items-center gap-3 rounded-xl transition-colors px-4 py-3 hover:bg-[var(--hover)]">
                <BookOpen size={18} className="text-[var(--foreground)]/80" />
                <span className="text-[var(--foreground)]">Diário</span>
              </a>
            </li>
          </ul>
        </aside>

        <section className="flex-1 p-8 overflow-y-auto">
          <PageHeader title="Meu perfil" subtitle="Gerencie seus dados pessoais, avatar e senha." />
          <div className="space-y-6">
            {section === "responsavel" && (
              <div className="space-y-6">
                <Card>
                  <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
                    <div>
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)] group">
                        {avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--foreground)]/60">Sem foto</div>
                        )}
                        {/* Spinner de upload */}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 grid place-items-center">
                            <div className="w-7 h-7 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          </div>
                        )}
                        {/* Botão de câmera sobreposto */}
                        <label className="absolute bottom-2 right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand text-white shadow-soft cursor-pointer hover:brightness-110 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={16} />
                          <input type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
                        </label>
                      </div>
                      <div className="mt-2 text-xs text-[var(--foreground)]/70">Clique no ícone para atualizar</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-sm">Nome completo</label>
                        <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                      </div>
                      <div>
                        <label className="text-sm">E‑mail</label>
                        <input value={email ?? ""} disabled className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3 opacity-70" />
                      </div>
                      <div>
                        <label className="text-sm">Telefone</label>
                        <MaskedInput value={phone} onChange={setPhone} mask={formatPhoneBR} placeholder="(00) 00000-0000" />
                      </div>
                      <div>
                        <label className="text-sm">CEP</label>
                        <MaskedInput value={zip} onChange={setZip} mask={formatCEP} placeholder="00000-000" />
                      </div>
                      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-sm">Logradouro</label>
                          <input value={street} onChange={(e)=>setStreet(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                        </div>
                        <div>
                          <label className="text-sm">Número</label>
                          <input value={number} onChange={(e)=>setNumber(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                        </div>
                        <div>
                          <label className="text-sm">Complemento</label>
                          <input value={complement} onChange={(e)=>setComplement(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                        </div>
                        <div>
                          <label className="text-sm">Bairro</label>
                          <input value={district} onChange={(e)=>setDistrict(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                        </div>
                        <div>
                          <label className="text-sm">Cidade</label>
                          <input value={city} onChange={(e)=>setCity(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
                        </div>
                        <div>
                          <label className="text-sm">UF</label>
                          <MaskedInput value={stateUF} onChange={setStateUF} mask={formatUF} placeholder="UF" />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button onClick={onSave} className="h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--accent-purple)] text-white hover:brightness-110">Salvar</button>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-sm font-medium">Alterar senha</div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <input type="password" placeholder="Nova senha" value={pwd} onChange={(e)=>setPwd(e.target.value)} className="h-11 rounded-xl bg-transparent border px-3" />
                    <input type="password" placeholder="Confirmar senha" value={pwdConfirm} onChange={(e)=>setPwdConfirm(e.target.value)} className="h-11 rounded-xl bg-transparent border px-3" />
                  </div>
                  <div className="text-xs text-[var(--foreground)]/60 mt-2">A senha deve ter ao menos 8 caracteres.</div>
                  <div className="mt-4">
                    <button onClick={onSave} className="h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--accent-purple)] text-white hover:brightness-110">Salvar senha</button>
                  </div>
                </Card>
              </div>
            )}
            {section === "familia" && (
              <div className="grid gap-6">
                <Card>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Estrutura Familiar</h3>
                    <button onClick={() => setShowAddMember(true)} className="px-3 h-9 rounded-xl bg-brand text-white">➕ Adicionar membro</button>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {familyMembers.length === 0 && (
                      <li className="text-[var(--foreground)]/60">Nenhum membro cadastrado.</li>
                    )}
                    {familyMembers.map((m) => (
                      <li key={m.id} className="rounded-xl border border-[var(--border)] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                            {m.avatar_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium">{m.name}</div>
                            <div className="text-[var(--foreground)]/60 text-xs">{m.relationship}</div>
                          </div>
                        </div>
                        <button onClick={() => { setEditMemberId(m.id); setEditMemberName(m.name); setEditMemberRel(m.relationship); setEditMemberAvatarUrl(null); setShowEditMember(true); }} className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 hover:bg-[var(--hover)]">Editar</button>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filhos</h3>
                    <button onClick={() => setShowAddChild(true)} className="px-3 h-9 rounded-xl bg-brand text-white inline-flex items-center gap-2"><Plus size={14} /> Adicionar filho</button>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {childrenList.length === 0 && (
                      <li className="text-[var(--foreground)]/60">Nenhum filho cadastrado.</li>
                    )}
                    {childrenList.map((c) => (
                      <li key={c.id} className="rounded-xl border border-[var(--border)] p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                            {c.avatar_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={c.avatar_url} alt={c.name} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            {c.birth_date && <div className="text-[var(--foreground)]/60 text-xs">Nascimento: {c.birth_date}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href="/profile/anamnese" className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 hover:bg-[var(--hover)]">Abrir</a>
                          <button onClick={() => { setEditChildId(c.id); setEditChildName(c.name); setEditChildBirth(c.birth_date ?? ""); setEditChildAvatarUrl(c.avatar_url ?? null); setShowEditChild(true); }} className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 hover:bg-[var(--hover)]">Editar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
            {/* seção "filhos" removida: agora está combinada dentro de "Família" */}
          </div>
          
        </section>

        {/* Modal adicionar membro */}
        <Modal open={showAddMember} onClose={() => setShowAddMember(false)}>
          <div className="text-lg font-semibold mb-2">Adicionar membro</div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                {memberAvatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={memberAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full grid place-items-center text-xs opacity-60">Foto</div>}
                {memberAvatarUploading && <div className="absolute inset-0 bg-black/40 grid place-items-center"><div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /></div>}
              </div>
              <label className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 cursor-pointer hover:bg-[var(--hover)]">
                Enviar foto
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const supabase = getBrowserSupabaseClient(); if (!supabase) return;
                  setMemberAvatarUploading(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const path = `${user.id}/family/${crypto.randomUUID()}-${file.name}`;
                  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
                  if (!error) {
                    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
                    setMemberAvatarUrl(publicUrl);
                  }
                  setMemberAvatarUploading(false);
                }} />
              </label>
            </div>
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={memberName} onChange={(e)=>setMemberName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Parentesco</label>
              <input value={memberRel} onChange={(e)=>setMemberRel(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" placeholder="Parceiro(a), Pai, Mãe, etc." />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowAddMember(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={addMember} className="h-10 px-4 rounded-lg bg-brand text-white hover:brightness-110">Adicionar</button>
            </div>
          </div>
        </Modal>

        {/* Modal adicionar filho */}
        <Modal open={showAddChild} onClose={() => setShowAddChild(false)}>
          <div className="text-lg font-semibold mb-2">Adicionar filho(a)</div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                {childAvatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={childAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full grid place-items-center text-xs opacity-60">Foto</div>}
                {childAvatarUploading && <div className="absolute inset-0 bg-black/40 grid place-items-center"><div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /></div>}
              </div>
              <label className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 cursor-pointer hover:bg-[var(--hover)]">
                Enviar foto
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const supabase = getBrowserSupabaseClient(); if (!supabase) return;
                  setChildAvatarUploading(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const path = `${user.id}/children/${crypto.randomUUID()}-${file.name}`;
                  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
                  if (!error) {
                    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
                    setChildAvatarUrl(publicUrl);
                  }
                  setChildAvatarUploading(false);
                }} />
              </label>
            </div>
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={childName} onChange={(e)=>setChildName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Data de nascimento</label>
              <input type="date" value={childBirth} onChange={(e)=>setChildBirth(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowAddChild(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={addChild} className="h-10 px-4 rounded-lg bg-brand text-white hover:brightness-110">Adicionar</button>
            </div>
          </div>
        </Modal>

        {/* Modal editar membro */}
        <Modal open={showEditMember} onClose={() => setShowEditMember(false)}>
          <div className="text-lg font-semibold mb-2">Editar membro</div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                {editMemberAvatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={editMemberAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full grid place-items-center text-xs opacity-60">Foto</div>}
                {editMemberUploading && <div className="absolute inset-0 bg-black/40 grid place-items-center"><div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /></div>}
              </div>
              <label className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 cursor-pointer hover:bg-[var(--hover)]">
                Enviar foto
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const supabase = getBrowserSupabaseClient(); if (!supabase) return;
                  setEditMemberUploading(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const path = `${user.id}/family/${crypto.randomUUID()}-${file.name}`;
                  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
                  if (!error) {
                    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
                    setEditMemberAvatarUrl(publicUrl);
                  }
                  setEditMemberUploading(false);
                }} />
              </label>
            </div>
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={editMemberName} onChange={(e)=>setEditMemberName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Parentesco</label>
              <input value={editMemberRel} onChange={(e)=>setEditMemberRel(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowEditMember(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={async () => {
                const supabase = getBrowserSupabaseClient(); if (!supabase || !editMemberId) return;
                const payload: any = { name: editMemberName.trim(), relationship: editMemberRel.trim() };
                if (editMemberAvatarUrl) payload.avatar_url = editMemberAvatarUrl;
                const { error } = await supabase.from("family_members").update(payload).eq("id", editMemberId);
                if (error) return push({ title: "Erro", message: error.message, variant: "error" });
                setFamilyMembers((prev) => prev.map((m) => m.id === editMemberId ? { ...m, name: editMemberName.trim(), relationship: editMemberRel.trim() } : m));
                setShowEditMember(false);
                push({ title: "Membro atualizado", message: "Estrutura familiar atualizada." });
              }} className="h-10 px-4 rounded-lg bg-brand text-white hover:brightness-110">Salvar</button>
            </div>
          </div>
        </Modal>

        {/* Modal editar filho */}
        <Modal open={showEditChild} onClose={() => setShowEditChild(false)}>
          <div className="text-lg font-semibold mb-2">Editar filho(a)</div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--hover)]">
                {editChildAvatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={editChildAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full grid place-items-center text-xs opacity-60">Foto</div>}
                {editChildUploading && <div className="absolute inset-0 bg-black/40 grid place-items-center"><div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /></div>}
              </div>
              <label className="text-xs rounded-lg border border-[var(--border)] px-3 py-1 cursor-pointer hover:bg-[var(--hover)]">
                Enviar foto
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const supabase = getBrowserSupabaseClient(); if (!supabase) return;
                  setEditChildUploading(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const path = `${user.id}/children/${crypto.randomUUID()}-${file.name}`;
                  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
                  if (!error) {
                    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
                    setEditChildAvatarUrl(publicUrl);
                  }
                  setEditChildUploading(false);
                }} />
              </label>
            </div>
            <div>
              <label className="text-sm">Nome completo</label>
              <input value={editChildName} onChange={(e)=>setEditChildName(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div>
              <label className="text-sm">Data de nascimento</label>
              <input type="date" value={editChildBirth} onChange={(e)=>setEditChildBirth(e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-transparent border px-3" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowEditChild(false)} className="h-10 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--hover)]">Cancelar</button>
              <button onClick={async () => {
                const supabase = getBrowserSupabaseClient(); if (!supabase || !editChildId) return;
                const payload: any = { name: editChildName.trim(), birth_date: editChildBirth || null };
                if (editChildAvatarUrl) payload.avatar_url = editChildAvatarUrl;
                const { error } = await supabase.from("children").update(payload).eq("id", editChildId);
                if (error) return push({ title: "Erro", message: error.message, variant: "error" });
                setChildrenList((prev) => prev.map((c) => c.id === editChildId ? { ...c, name: editChildName.trim(), birth_date: editChildBirth || null, avatar_url: editChildAvatarUrl ?? c.avatar_url } : c));
                setShowEditChild(false);
                push({ title: "Filho(a) atualizado", message: "Lista de filhos atualizada." });
              }} className="h-10 px-4 rounded-lg bg-brand text-white hover:brightness-110">Salvar</button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}


