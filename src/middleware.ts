import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  // Routes to protect
  const protectedPrefixes = ["/dashboard", "/catalog", "/community", "/events", "/admin"];
  const isProtected = protectedPrefixes.some((p) => url.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
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
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\..*).*)"],
};


