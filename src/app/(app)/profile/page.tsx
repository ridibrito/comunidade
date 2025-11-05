"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPhoneBR, formatCEP, formatUF } from "@/lib/masks";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { UserCircle, UsersRound, ClipboardList, CalendarDays, BookOpen, Camera, Plus, FileText, TrendingUp, Eye, EyeOff } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Badge from "@/components/ui/Badge";
import MaskedInput from "@/components/ui/MaskedInput";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<"responsavel" | "familia">("responsavel");
  const { push } = useToast();

  useEffect(() => {
    async function loadProfile() {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || null);
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, phone, zip, street, number, complement, district, city, state")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName((profile as any).full_name || "");
        setAvatarUrl((profile as any).avatar_url);
        setPhone((profile as any).phone || "");
        setZip((profile as any).zip || "");
        setStreet((profile as any).street || "");
        setNumber((profile as any).number || "");
        setComplement((profile as any).complement || "");
        setDistrict((profile as any).district || "");
        setCity((profile as any).city || "");
        setStateUF((profile as any).state || "");
      }
    }

    loadProfile();
  }, []);

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      // Salva por usuário para evitar conflitos e facilitar políticas
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      
      {/* @ts-ignore */}
      const { error: updateError } = await (supabase
        .from("profiles") as any)
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      push({ title: "Avatar atualizado", message: "Sua foto de perfil foi atualizada com sucesso!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      push({ title: "Erro ao fazer upload", message: msg, variant: "error" });
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (pwd && pwd !== pwdConfirm) {
      push({ title: "Erro", message: "As senhas não coincidem", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: any = {
        full_name: fullName,
        phone,
        zip,
        street,
        number,
        complement,
        district,
        city,
        state: stateUF,
      };

      if (avatarUrl) updates.avatar_url = avatarUrl;

      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...updates });

      if (error) throw error;

      if (pwd) {
        const { error: pwdError } = await supabase.auth.updateUser({
          password: pwd
        });
        if (pwdError) throw pwdError;
      }

      push({ title: "Perfil atualizado", message: "Suas informações foram salvas com sucesso!" });
      setPwd("");
      setPwdConfirm("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      push({ title: "Erro ao salvar", message: msg, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container fullWidth>
      <div className="flex h-full">
        {/* Sidebar para navegação adicional - mesmo estilo do sidebar principal */}
        <aside className="hidden md:block shrink-0 h-screen bg-light-surface dark:bg-dark-surface transition-all duration-300 shadow-sm w-[240px] xl:w-[280px] p-4">
          <div className="mb-2" />
          <ul className="text-sm space-y-2">
            {/* Informações Pessoais */}
            <li>
              <a
                href="/profile"
                className={`flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left ${
                  "active-brand-subtle text-brand-accent"
                }`}
              >
                <UserCircle size={18} className={"text-purple-600 dark:text-purple-400"} />
                <span className={"text-purple-600 dark:text-purple-400"}>Responsável</span>
              </a>
            </li>
            
            {/* Comentado temporariamente - voltaremos a usar no futuro */}
            {/* <li>
              <a
                href="/profile/familia"
                className={`flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left hover-brand-subtle`}
              >
                <UsersRound size={18} className="text-light-muted dark:text-dark-muted" />
                <span className="text-light-text dark:text-dark-text">Família</span>
              </a>
            </li>

            <li className="my-4">
              <div className="h-px bg-light-border dark:bg-dark-border" />
            </li>

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
            </li> */}
          </ul>
        </aside>

        <Section>
          <PageHeader title="Meu perfil" subtitle="Gerencie seus dados pessoais, avatar e senha." />
          
          <div className="space-y-6">
            <Card className="shadow-md rounded-lg py-12 px-8 border-0">
              <div className="grid gap-8 xl:grid-cols-[300px_1fr]">
                <div className="flex flex-col items-center">
                  <div className="relative w-44 h-44 rounded-full overflow-hidden bg-light-border/30 dark:bg-dark-border/30 group shadow-md">
                    <Avatar className="w-full h-full">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                      <AvatarFallback className="text-2xl font-medium text-light-text dark:text-dark-text bg-light-border/50 dark:bg-dark-border/50">
                        {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '👤'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Spinner de upload */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 full flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      </div>
                    )}
                    {/* Botão de câmera sempre visível */}
                    <label className="absolute bottom-2 right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-accent text-white shadow-sm cursor-pointer hover:bg-brand-accent/90 transition-colors">
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-light-muted dark:text-dark-muted text-center">Clique no ícone para atualizar</p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input 
                      id="fullName"
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E‑mail</Label>
                    <Input 
                      id="email"
                      value={email ?? ""} 
                      disabled 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <MaskedInput value={phone} onChange={setPhone} mask={formatPhoneBR} placeholder="(00) 00000-0000" className="border-light-border/50 dark:border-dark-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <MaskedInput value={zip} onChange={setZip} mask={formatCEP} placeholder="00000-000" className="border-light-border/50 dark:border-dark-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20" />
                  </div>
                  
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input 
                      id="street"
                      value={street} 
                      onChange={(e) => setStreet(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input 
                      id="number"
                      value={number} 
                      onChange={(e) => setNumber(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input 
                      id="complement"
                      value={complement} 
                      onChange={(e) => setComplement(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">Bairro</Label>
                    <Input 
                      id="district"
                      value={district} 
                      onChange={(e) => setDistrict(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city"
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">UF</Label>
                    <MaskedInput value={stateUF} onChange={setStateUF} mask={formatUF} placeholder="UF" className="border-light-border/50 dark:border-dark-border/50 focus:border-brand-accent/50 focus:ring-brand-accent/20" />
                  </div>
                  
                  <div className="mt-6 lg:col-span-3">
                    <Button onClick={onSave} className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors w-full sm:w-auto">
                      Salvar alterações
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="shadow-md rounded-lg p-12 border-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Alterar senha</h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted">Defina uma nova senha segura para sua conta</p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova senha</Label>
                    <div className="relative">
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 8 caracteres" 
                        value={pwd} 
                        onChange={(e) => setPwd(e.target.value)} 
                        className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Digite a senha novamente" 
                        value={pwdConfirm} 
                        onChange={(e) => setPwdConfirm(e.target.value)} 
                        className="bg-light-surface dark:bg-dark-surface border-light-border/50 dark:border-dark-border/50 text-light-text dark:text-dark-text focus:border-brand-accent/50 focus:ring-brand-accent/20 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-light-muted dark:text-dark-muted">
                  A senha deve ter ao menos 8 caracteres.
                </div>
                
                <div className="lg:col-span-3">
                  <Button onClick={onSave} className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors w-full sm:w-auto">
                    Salvar senha
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Section>
      </div>
    </Container>
  );
}