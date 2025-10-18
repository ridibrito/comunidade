"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { LogOut, UserCircle } from "lucide-react";
import { mockUser } from "@/data/mock/data";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserEmail(data.user?.email ?? null);
      if (uid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", uid)
          .maybeSingle();
        setFullName(profile?.full_name ?? "");
        setAvatarUrl(profile?.avatar_url ?? null);
      }
    });
  }, []);

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
    await supabase.auth.signOut();
    setUserEmail(null);
    setOpen(false);
  }

  const displayName = fullName || mockUser.name || userEmail || "Usuário";
  const initial = (displayName?.[0] ?? "U").toUpperCase();
  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="h-10 w-56 rounded-full bg-[var(--surface)] border border-[var(--border)] text-white flex items-center gap-2 pl-1 pr-3 ring-1 ring-black/20 shadow">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[linear-gradient(180deg,#5061C6_0%,#2C3E97_100%)] flex items-center justify-center">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold">{initial}</span>
          )}
        </div>
        <span className="text-sm text-[var(--foreground)]/90 max-w-[140px] truncate">{displayName}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg py-2">
          <div className="px-3 pb-2">
            <div className="text-sm font-medium truncate">{displayName}</div>
            {userEmail && <div className="text-xs text-[var(--foreground)]/70 truncate">{userEmail}</div>}
          </div>
          <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover)] transition-colors">
            <UserCircle size={16} />
            <span className="text-sm">Perfil</span>
          </Link>
          <button onClick={userEmail ? handleSignOut : (handleSignIn as unknown as (e: React.FormEvent) => void)} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover)] transition-colors text-red-500">
            <LogOut size={16} />
            <span className="text-sm">{userEmail ? "Sair" : "Entrar"}</span>
          </button>
        </div>
      )}
    </div>
  );
}


