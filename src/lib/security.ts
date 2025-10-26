// lib/security.ts
import { NextRequest } from 'next/server';

// Configurações de segurança
export const SECURITY_CONFIG = {
  // Configurações de sessão
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  
  // Configurações de senha
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SYMBOLS: false,
  
  // Configurações de rate limiting
  RATE_LIMITS: {
    LOGIN: { requests: 5, window: '5m' },
    PASSWORD_RESET: { requests: 3, window: '1h' },
    API: { requests: 1000, window: '1h' },
    WEBHOOK: { requests: 100, window: '1m' },
  },
  
  // Configurações de CSP
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'nonce-' 'strict-dynamic'",
    STYLE_SRC: "'self' 'nonce-' 'unsafe-inline'",
    IMG_SRC: "'self' blob: data: https:",
    FONT_SRC: "'self' data:",
    OBJECT_SRC: "'none'",
    BASE_URI: "'self'",
    FORM_ACTION: "'self'",
    FRAME_ANCESTORS: "'none'",
  },
};

// Função para detectar IPs suspeitos
export function isSuspiciousIP(ip: string): boolean {
  // Lista de IPs conhecidos como maliciosos (exemplo básico)
  const suspiciousIPs = [
    '127.0.0.1', // Localhost em produção
    '0.0.0.0',
  ];
  
  // Verificar se é IP privado em produção
  if (process.env.NODE_ENV === 'production') {
    const privateIPRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
    ];
    
    if (privateIPRanges.some(range => range.test(ip))) {
      return true;
    }
  }
  
  return suspiciousIPs.includes(ip);
}

// Função para detectar User-Agents suspeitos
export function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

// Função para obter IP real considerando proxies
export function getRealIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // Priorizar Cloudflare IP se disponível
  if (cfConnectingIp) return cfConnectingIp;
  
  // Usar X-Real-IP se disponível
  if (realIp) return realIp;
  
  // Usar primeiro IP da lista X-Forwarded-For
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0];
  }
  
  // Fallback para connection.remoteAddress (não disponível em Next.js)
  return 'unknown';
}

// Função para validar origem da requisição
export function isValidOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  
  try {
    const url = new URL(origin);
    return allowedOrigins.includes(url.origin);
  } catch {
    return false;
  }
}

// Função para gerar nonce seguro
export function generateSecureNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

// Função para verificar se a requisição é de um bot
export function isBotRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Verificar User-Agent suspeito
  if (isSuspiciousUserAgent(userAgent)) return true;
  
  // Verificar padrões de bot no Accept header
  if (accept === '*/*' && !acceptLanguage) return true;
  
  // Verificar se não tem Accept-Language (comum em bots)
  if (!acceptLanguage) return true;
  
  return false;
}

// Função para sanitizar dados de entrada
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}
