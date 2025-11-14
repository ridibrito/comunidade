// Redis cache utilities
// Simplified version without actual Redis dependency

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = memoryCache.get(key);
  
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  
  const data = await fetcher();
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
  
  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  } else {
    memoryCache.delete(pattern);
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
  memoryCache.set(key, {
    data: value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = memoryCache.get(key);
  
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  
  if (cached) {
    memoryCache.delete(key);
  }
  
  return null;
}

