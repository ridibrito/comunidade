// lib/rate-limit-fallback.ts
// Sistema de rate limiting em memória (fallback quando Redis não está disponível)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class MemoryRateLimit {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpar entradas expiradas a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  async limit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / windowMs)}`;
    
    const entry = this.store.get(key);
    
    if (!entry) {
      // Primeira requisição nesta janela
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: new Date(now + windowMs)
      };
    }
    
    if (entry.count >= limit) {
      // Limite excedido
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(entry.resetTime)
      };
    }
    
    // Incrementar contador
    entry.count++;
    this.store.set(key, entry);
    
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: new Date(entry.resetTime)
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Instância global do rate limiter em memória
const memoryRateLimit = new MemoryRateLimit();

// Configurações de rate limiting
export const RATE_LIMITS = {
  LOGIN: { requests: 5, window: 5 * 60 * 1000 }, // 5 tentativas por 5 minutos
  PASSWORD_RESET: { requests: 3, window: 60 * 60 * 1000 }, // 3 tentativas por hora
  API: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 requisições por hora
  WEBHOOK: { requests: 100, window: 60 * 1000 }, // 100 requisições por minuto
};

// Função principal de rate limiting (com fallback)
export async function applyRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS,
  request?: Request
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  const config = RATE_LIMITS[type];
  
  try {
    // Tentar usar Redis se disponível
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');
      
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      
      const rateLimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        analytics: true,
        prefix: type.toLowerCase(),
      });
      
      return await rateLimit.limit(identifier);
    }
  } catch (error) {
    console.warn('Redis não disponível, usando fallback em memória:', error);
  }
  
  // Fallback para memória
  return await memoryRateLimit.limit(identifier, config.requests, config.window);
}

// Função para obter identificador único
export function getRateLimitIdentifier(request: Request): string {
  // Tentar obter IP real considerando proxies
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return clientIp;
}

// Função para verificar se Redis está disponível
export async function checkRedisAvailability(): Promise<boolean> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return false;
    }
    
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    await redis.ping();
    return true;
  } catch (error) {
    console.warn('Redis não disponível:', error);
    return false;
  }
}

// Cleanup na saída do processo
process.on('SIGINT', () => {
  memoryRateLimit.destroy();
});

process.on('SIGTERM', () => {
  memoryRateLimit.destroy();
});
