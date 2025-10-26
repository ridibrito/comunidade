// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit-fallback';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { logger } from '@/lib/monitoring';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    // Aplicar rate limiting
    const identifier = getRateLimitIdentifier(request);
    const { success, limit, remaining, reset } = await applyRateLimit(identifier, 'LOGIN', request);
    
    if (!success) {
      logger.warn('Rate limit exceeded for login', {
        ip: identifier,
        limit,
        remaining,
        reset: reset.toISOString(),
      });
      
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
          retryAfter: Math.round((reset.getTime() - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toISOString(),
            'Retry-After': Math.round((reset.getTime() - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Validar dados de entrada
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Sanitizar email
    const email = validatedData.email.toLowerCase().trim();
    const password = validatedData.password;

    // Autenticar com Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log do erro para monitoramento (sem expor detalhes sensíveis)
      console.error('Login failed:', { email: email.substring(0, 3) + '***', error: error.message });
      
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Sucesso - retornar dados do usuário (sem informações sensíveis)
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        // Não retornar dados sensíveis
      },
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toISOString(),
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
