// lib/cache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000; // Máximo de itens no cache

  set<T>(key: string, data: T, ttl: number = 300000): void { // 5 minutos por padrão
    // Limpar cache se estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Verificar se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

// Função para cache com revalidação
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300000
): Promise<T> {
  // Verificar se já existe no cache
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Buscar dados
  const data = await fetcher();
  
  // Armazenar no cache
  memoryCache.set(key, data, ttl);
  
  return data;
}

// Função para invalidar cache
export function invalidateCache(pattern: string): void {
  // Implementação simples - em produção usar Redis
  memoryCache.clear();
}

// Função para cache de API com Next.js
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  ttl: number = 300000
): Promise<T> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  return withCache(cacheKey, async () => {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: Math.floor(ttl / 1000) }, // Converter para segundos
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }, ttl);
}
