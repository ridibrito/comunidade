import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redis) return redis;
  
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('Redis URL not configured, caching disabled');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      enableOfflineQueue: false, // Não enfileirar comandos se desconectado
      retryStrategy: (times) => {
        if (times > 3) {
          // Não logar erro para não poluir console em desenvolvimento
          return null; // Stop retrying
        }
        return Math.min(times * 200, 1000); // Retry with exponential backoff
      },
      showFriendlyErrorStack: false,
    });
    
    redis.on('error', (err) => {
      // Não logar erro - apenas resetar cliente para próxima tentativa
      redis = null;
    });

    redis.on('connect', () => {
      // Opcional: logar sucesso apenas se necessário
      // console.log('Redis connected successfully');
    });
    
    return redis;
  } catch (error) {
    // Não logar erro - apenas retornar null
    redis = null;
    return null;
  }
}

/**
 * Helper function to get or set cached data
 * @param key Cache key
 * @param fetchFn Function to fetch data if not in cache
 * @param ttl Time to live in seconds (default: 3600 = 1 hour)
 * @returns Cached or fetched data
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600 // 1 hora padrão
): Promise<T> {
  const client = getRedisClient();
  if (!client) {
    // Se Redis não disponível, buscar direto
    return fetchFn();
  }

  // Sempre buscar dados primeiro - usar cache como otimização
  try {
    // Tentar buscar do cache (não bloquear se falhar)
    try {
      const cached = await client.get(key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as T;
          return parsed;
        } catch (parseError) {
          // Se parse falhar, continuar para buscar dados frescos
        }
      }
    } catch (getError) {
      // Se buscar do cache falhar, continuar para buscar dados
    }

    // Buscar dados frescos
    const data = await fetchFn();
    
    // Tentar salvar no cache (não bloquear se falhar)
    try {
      await client.setex(key, ttl, JSON.stringify(data));
    } catch (setError) {
      // Ignorar erros de cache silenciosamente
    }
    
    return data;
  } catch (error) {
    // Em caso de qualquer erro, buscar direto (degradação graciosa)
    return fetchFn();
  }
}

/**
 * Invalidate cache by pattern
 * @param pattern Pattern to match keys (e.g., 'heroes:*', 'trails:*')
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`Invalidated ${keys.length} cache keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Clear all cache (use with caution)
 */
export async function clearAllCache(): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.flushdb();
    console.log('All cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache statistics (for monitoring)
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keys?: number;
}> {
  const client = getRedisClient();
  if (!client) {
    return { connected: false };
  }

  try {
    const info = await client.info('keyspace');
    const keysMatch = info.match(/keys=(\d+)/);
    const keys = keysMatch ? parseInt(keysMatch[1], 10) : 0;

    return {
      connected: true,
      keys,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { connected: false };
  }
}

