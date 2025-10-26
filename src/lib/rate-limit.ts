// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Configuração do Redis (usar variáveis de ambiente)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter para login (5 tentativas por 5 minutos)
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '5 m'),
  analytics: true,
  prefix: 'login',
});

// Rate limiter para recuperação de senha (3 tentativas por hora)
export const passwordResetRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'password-reset',
});

// Rate limiter para webhooks (100 requisições por minuto)
export const webhookRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'webhook',
});

// Rate limiter geral para API (1000 requisições por hora)
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  analytics: true,
  prefix: 'api',
});

// Função auxiliar para obter identificador único
export function getRateLimitIdentifier(request: Request): string {
  // Tentar obter IP real considerando proxies
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return clientIp;
}

// Função auxiliar para aplicar rate limit
export async function applyRateLimit(
  rateLimit: Ratelimit,
  identifier: string,
  request: Request
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  const { success, limit, remaining, reset } = await rateLimit.limit(identifier);
  
  // Adicionar cabeçalhos informativos
  const response = new Response();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  
  return { success, limit, remaining, reset };
}
