"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { LogOut, UserCircle, Mail } from "lucide-react";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    async function loadUser() {
      const supabase = getBrowserSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Erro ao carregar usuário:", error);
          setLoading(false);
          return;
        }
        
        if (user) {
          setUserEmail(user.email);
          
          // Buscar perfil do usuário com query mais simples
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Erro ao carregar perfil:", profileError);
          }
          
          if (profile) {
            setFullName(profile.full_name || "");
            setAvatarUrl(profile.avatar_url || null);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [mounted]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signInWithOtp({ email });
    setEmail("");
    setOpen(false);
  }

  async function handleSignOut() {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
      setFullName("");
      setAvatarUrl(null);
      setOpen(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  // Evitar hidratação mismatch
  if (!mounted) {
    return (
      <div className="h-10 w-12 lg:w-56 rounded-full bg-light-surface dark:bg-dark-surface  flex items-center gap-2 pl-1 pr-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded hidden lg:block"></div>
      </div>
    );
  }

  const displayName = fullName || userEmail || "Usuário";
  const initial = (displayName?.[0] ?? "U").toUpperCase();
  
  if (loading) {
    return (
      <div className="h-10 w-12 lg:w-56 rounded-full bg-light-surface dark:bg-dark-surface  flex items-center gap-2 pl-1 pr-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded hidden lg:block"></div>
      </div>
    );
  }
  
  return (
    <div ref={menuRef} className="relative">
      <button 
        onClick={() => setOpen((v) => !v)} 
        className="h-10 rounded-full bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text flex items-center gap-2 pl-1 pr-3 hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors w-12 lg:w-56"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
          {avatarUrl && avatarUrl.trim() !== "" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarUrl} 
              alt="avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Se a imagem falhar ao carregar, esconder e mostrar inicial
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`text-sm font-semibold text-white ${avatarUrl && avatarUrl.trim() !== "" ? 'hidden' : ''}`}>
            {initial}
          </span>
        </div>
        <span className="text-sm text-light-text dark:text-dark-text max-w-[140px] truncate hidden lg:block">{displayName}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl  bg-light-surface dark:bg-dark-surface shadow-lg py-2 z-50">
          <div className="px-3 pb-2 border-b border-light-border dark:border-dark-border">
            <div className="text-sm font-medium text-light-text dark:text-dark-text truncate">{displayName}</div>
            {userEmail && <div className="text-xs text-light-muted dark:text-dark-muted truncate">{userEmail}</div>}
          </div>
          
          {userEmail ? (
            <>
              <Link 
                href="/profile" 
                onClick={() => setOpen(false)} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors text-light-text dark:text-dark-text"
              >
                <UserCircle size={16} />
                <span className="text-sm">Perfil</span>
              </Link>
              <button 
                onClick={handleSignOut} 
                className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors text-red-500"
              >
                <LogOut size={16} />
                <span className="text-sm">Sair</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleSignIn} className="px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-light-muted dark:text-dark-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-accent text-white text-sm py-1 px-2 rounded hover:bg-brand-accent/90 transition-colors"
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}


