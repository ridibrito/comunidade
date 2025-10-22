import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const res = NextResponse.next();
  
  // Permitir acesso à página de change-password se há token na URL
  if (url.pathname === "/auth/change-password" && url.searchParams.has("token")) {
    return res;
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    url.pathname = "/auth/login";
    const redirectRes = NextResponse.redirect(url);
    // Propaga cookies potencialmente atualizados (ex.: refresh de sessão)
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  // Verificar se usuário tem senha temporária e redirecionar para troca
  if (data.user.user_metadata?.temp_password && !url.pathname.startsWith("/auth/change-password")) {
    url.pathname = "/auth/change-password";
    const redirectRes = NextResponse.redirect(url);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }
  // Restringe /admin a administradores
  if (url.pathname.startsWith("/admin")) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", data.user.id)
        .maybeSingle();
      const isAdmin = Boolean(profile?.is_admin) || (profile?.role === "admin");
      if (!isAdmin) {
        url.pathname = "/dashboard";
        const redirectRes = NextResponse.redirect(url);
        res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
        return redirectRes;
      }
    } catch {
      url.pathname = "/dashboard";
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
      return redirectRes;
    }
  }
  return res;
}

export const config = {
  // Protege apenas os caminhos definidos abaixo; outras rotas (auth, marketing, estáticos) não passam aqui
  matcher: [
    "/dashboard/:path*",
    "/catalog/:path*",
    "/community/:path*",
    "/events/:path*",
    "/admin/:path*",
    "/auth/change-password",
  ],
};


