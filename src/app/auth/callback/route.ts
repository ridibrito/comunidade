import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token = searchParams.get('token')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type')

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('Auth callback - Code:', code ? 'Present' : 'Missing')
  console.log('Auth callback - Token:', token ? 'Present' : 'Missing')
  console.log('Auth callback - Next:', next)
  console.log('Auth callback - Type:', type)
  console.log('Auth callback - Origin:', origin)
  console.log('Auth callback - Full URL:', request.url)

  if (code) {
    const response = NextResponse.next()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
    }

    if (data.session) {
      console.log('Auth callback - Session created successfully')
      console.log('Auth callback - User metadata:', data.session.user.user_metadata)
      
      // Verificar se é um convite (type=invite) e se tem temp_password
      if (type === 'invite' || data.session.user.user_metadata?.temp_password) {
        console.log('Auth callback - Redirecting to change password')
        const redirectUrl = `${origin}/auth/change-password`
        const redirectResponse = NextResponse.redirect(redirectUrl)
        
        // Propagar todos os cookies
        response.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie)
        })
        
        return redirectResponse
      }
      
      // Redirecionamento normal
      const redirectUrl = `${origin}${next}`
      const redirectResponse = NextResponse.redirect(redirectUrl)
      
      // Propagar todos os cookies
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie)
      })
      
      return redirectResponse
    }
  } else if (token) {
    // Para tokens, apenas redirecionar para change-password
    // O token será verificado na página de change-password
    console.log('Token present, redirecting to change-password')
    return NextResponse.redirect(`${origin}/auth/change-password?token=${token}`)
  }

  // return the user to an error page with instructions
  console.log('Auth callback - No code or session creation failed')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}