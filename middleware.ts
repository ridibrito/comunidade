// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isBotRequest, getRealIP, generateSecureNonce } from './src/lib/security';
import { logger } from './src/lib/monitoring';
import { applyRateLimit, getRateLimitIdentifier } from './src/lib/rate-limit-fallback';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Detectar bots e bloquear se necessário
  if (isBotRequest(request)) {
    logger.warn('Bot request blocked', {
      ip: getRealIP(request),
      userAgent: request.headers.get('user-agent'),
      path: request.nextUrl.pathname,
    });
    
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Gerar nonce único para CSP
  const nonce = generateSecureNonce();
  
  // Configurar cabeçalhos de segurança
  const response = NextResponse.next();
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    connect-src 'self' https: wss: ws:;
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Strict Transport Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // X-XSS-Protection (para navegadores mais antigos)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Adicionar nonce ao request para uso nos componentes
  request.headers.set('x-nonce', nonce);
  
  // Log de performance
  const duration = Date.now() - startTime;
  if (duration > 100) { // Log apenas requisições lentas
    logger.warn('Slow request detected', {
      path: request.nextUrl.pathname,
      duration: `${duration}ms`,
      ip: getRealIP(request),
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
