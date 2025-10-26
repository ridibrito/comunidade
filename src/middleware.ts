import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Aplica cabeçalhos de segurança a uma resposta
function setSecurityHeaders(response: NextResponse) {
  const cspHeader = (
    `default-src 'self'; ` +
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; ` +
    `style-src 'self' 'unsafe-inline' https:; ` +
    `connect-src 'self' https: wss: ws:; ` +
    `img-src 'self' blob: data: https:; ` +
    `font-src 'self' data:; ` +
    `frame-src 'self' https://player.vimeo.com https://vimeo.com; ` +
    `object-src 'none'; ` +
    `base-uri 'self'; ` +
    `form-action 'self'; ` +
    `frame-ancestors 'none'; ` +
    `upgrade-insecure-requests;`
  ).trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const res = NextResponse.next();
  
  // Permitir acesso à página de change-password se há token na URL
  if (url.pathname === "/auth/change-password" && url.searchParams.has("token")) {
    return setSecurityHeaders(res);
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
    return setSecurityHeaders(redirectRes);
  }

  // Sistema de tracking de login - atualizar last_login_at e login_count
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_login_at, login_count")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      const now = new Date().toISOString();
      const lastLogin = profile.last_login_at;
      const loginCount = profile.login_count || 0;
      
      // Atualizar apenas se não fez login hoje ou se é o primeiro login
      const shouldUpdate = !lastLogin || 
        new Date(lastLogin).toDateString() !== new Date().toDateString();
      
      if (shouldUpdate) {
        await supabase
          .from("profiles")
          .update({
            last_login_at: now,
            login_count: loginCount + 1
          })
          .eq("id", data.user.id);
      }
    }
  } catch (error) {
    // Log do erro mas não interrompe o fluxo
    console.error("Erro ao atualizar tracking de login:", error);
  }

  // Verificar se usuário tem senha temporária e redirecionar para troca
  if (data.user.user_metadata?.temp_password && !url.pathname.startsWith("/auth/change-password")) {
    url.pathname = "/auth/change-password";
    const redirectRes = NextResponse.redirect(url);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return setSecurityHeaders(redirectRes);
  }
  // Restringe /admin a administradores
  if (url.pathname.startsWith("/admin")) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role, full_name")
        .eq("id", data.user.id)
        .maybeSingle();
      
      const isAdmin = Boolean(profile?.is_admin) || (profile?.role === "admin");
      
      if (!isAdmin) {
        // Log da tentativa de acesso não autorizado
        console.log(`🚫 Acesso negado: ${profile?.full_name || 'Usuário'} (${profile?.role || 'sem role'}) tentou acessar ${url.pathname}`);
        
        // Redirecionar para dashboard com parâmetro de erro
        url.pathname = "/dashboard";
        url.searchParams.set("error", "access_denied");
        const redirectRes = NextResponse.redirect(url);
        res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
        return setSecurityHeaders(redirectRes);
      }
    } catch (error) {
      console.error("Erro ao verificar permissões de admin:", error);
      url.pathname = "/dashboard";
      url.searchParams.set("error", "access_denied");
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
      return setSecurityHeaders(redirectRes);
    }
  }
  return setSecurityHeaders(res);
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


