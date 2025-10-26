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

  const response = NextResponse.next();
  
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
