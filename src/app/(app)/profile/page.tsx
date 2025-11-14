"use client";

import { useState, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPhoneBR, formatCEP, formatUF } from "@/lib/masks";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ModernCard from "@/components/ui/ModernCard";
import { UserCircle, UsersRound, ClipboardList, CalendarDays, BookOpen, Camera, Plus, FileText, TrendingUp, Eye, EyeOff, Mail, Phone, MapPin, Lock, Save, CheckCircle2 } from "lucide-react";
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
        <aside className="hidden md:block shrink-0 h-screen bg-light-surface transition-all duration-300 shadow-sm w-[240px] xl:w-[280px] p-4">
          <div className="mb-2" />
          <ul className="text-sm space-y-2">
            {/* Informações Pessoais */}
            <li>
              <a
                href="/profile"
                className={`flex items-center gap-3 rounded-xl transition-colors px-4 py-3 cursor-pointer w-full text-left ${
                  "active-brand-subtle text-purple-600"
                }`}
              >
                <UserCircle size={18} className={"text-purple-600"} />
                <span className={"text-purple-600"}>Responsável</span>
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
          <PageHeader 
            title="Meu Perfil" 
            subtitle="Gerencie suas informações pessoais, avatar e configurações de segurança" 
          />
          
          <div className="space-y-8">
            {/* Card de Informações Pessoais */}
            <ModernCard variant="elevated" className="overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50">
              <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                {/* Seção do Avatar */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative group">
                    <div className="relative w-48 h-48">
                      {/* Container do avatar com borda gradiente */}
                      <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <Avatar className="w-full h-full rounded-full">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover rounded-full" />}
                            <AvatarFallback className="text-4xl font-bold text-brand-accent bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 rounded-full">
                              {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '👤'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        {/* Overlay de upload */}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-full z-10">
                            <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-white animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      {/* Botão de upload moderno - posicionado fora do container com overflow */}
                      <label className="absolute bottom-0 right-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent text-white shadow-xl cursor-pointer hover:bg-brand-accent/90 hover:scale-110 hover:shadow-2xl transition-all duration-300 z-20 border-2 border-white">
                        <Camera size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
                      </label>
                    </div>
                    
                    <div className="mt-6 text-center lg:text-left">
                      <h2 className="text-2xl font-bold text-light-text mb-1">
                        {fullName || "Usuário"}
                      </h2>
                      <p className="text-sm text-light-muted flex items-center gap-2 justify-center lg:justify-start">
                        <Mail size={14} />
                        {email || "email@exemplo.com"}
                      </p>
                      <p className="text-xs text-light-muted mt-2">
                        Clique no ícone da câmera para atualizar sua foto
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Formulário de Informações */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-light-text mb-1 flex items-center gap-2">
                      <UserCircle size={20} className="text-brand-accent" />
                      Informações Pessoais
                    </h3>
                    <p className="text-sm text-light-muted mb-6">
                      Atualize suas informações de contato e endereço
                    </p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                        <UserCircle size={14} className="text-brand-accent" />
                        Nome completo
                      </Label>
                      <Input 
                        id="fullName"
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail size={14} className="text-brand-accent" />
                        E-mail
                      </Label>
                      <Input 
                        id="email"
                        value={email ?? ""} 
                        disabled 
                        className="h-11 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone size={14} className="text-brand-accent" />
                        Telefone
                      </Label>
                      <MaskedInput 
                        value={phone} 
                        onChange={setPhone} 
                        mask={formatPhoneBR} 
                        placeholder="(00) 00000-0000" 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-sm font-medium flex items-center gap-2">
                        <MapPin size={14} className="text-brand-accent" />
                        CEP
                      </Label>
                      <MaskedInput 
                        value={zip} 
                        onChange={setZip} 
                        mask={formatCEP} 
                        placeholder="00000-000" 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street" className="text-sm font-medium flex items-center gap-2">
                        <MapPin size={14} className="text-brand-accent" />
                        Logradouro
                      </Label>
                      <Input 
                        id="street"
                        value={street} 
                        onChange={(e) => setStreet(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-sm font-medium">Número</Label>
                      <Input 
                        id="number"
                        value={number} 
                        onChange={(e) => setNumber(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="123"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="complement" className="text-sm font-medium">Complemento</Label>
                      <Input 
                        id="complement"
                        value={complement} 
                        onChange={(e) => setComplement(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="Apto, Bloco, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-sm font-medium">Bairro</Label>
                      <Input 
                        id="district"
                        value={district} 
                        onChange={(e) => setDistrict(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="Nome do bairro"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                      <Input 
                        id="city"
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                        placeholder="Nome da cidade"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">UF</Label>
                      <MaskedInput 
                        value={stateUF} 
                        onChange={setStateUF} 
                        mask={formatUF} 
                        placeholder="UF" 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      onClick={onSave} 
                      disabled={loading}
                      className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-11 px-6"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Salvar alterações
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </ModernCard>

            {/* Card de Segurança */}
            <ModernCard variant="elevated" className="border-0 bg-gradient-to-br from-white to-gray-50/50">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-brand-accent/10">
                    <Lock size={24} className="text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-light-text mb-1">
                      Segurança e Senha
                    </h3>
                    <p className="text-sm text-light-muted">
                      Defina uma nova senha segura para proteger sua conta
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-gray-200" />
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock size={14} className="text-brand-accent" />
                      Nova senha
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 8 caracteres" 
                        value={pwd} 
                        onChange={(e) => setPwd(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-brand-accent" />
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Digite a senha novamente" 
                        value={pwdConfirm} 
                        onChange={(e) => setPwdConfirm(e.target.value)} 
                        className="h-11 bg-white border-gray-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
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
                
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <Lock size={14} className="mt-0.5 flex-shrink-0" />
                    <span>A senha deve ter ao menos 8 caracteres e conter letras, números e caracteres especiais para maior segurança.</span>
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={onSave} 
                    disabled={loading || (!pwd && !pwdConfirm)}
                    className="bg-brand-accent text-white hover:bg-brand-accent/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-11 px-6"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Lock size={18} className="mr-2" />
                        Salvar senha
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ModernCard>
          </div>
        </Section>
      </div>
    </Container>
  );
}