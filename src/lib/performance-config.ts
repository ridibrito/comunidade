// lib/performance-config.ts
export const PERFORMANCE_CONFIG = {
  // Configurações de cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
    LONG_TTL: 60 * 60 * 1000, // 1 hora
    SHORT_TTL: 30 * 1000, // 30 segundos
  },
  
  // Configurações de lazy loading
  LAZY_LOADING: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '50px',
    TRIGGER_ONCE: true,
  },
  
  // Configurações de debounce/throttle
  TIMING: {
    SEARCH_DEBOUNCE: 300, // 300ms
    SCROLL_THROTTLE: 100, // 100ms
    RESIZE_THROTTLE: 250, // 250ms
  },
  
  // Configurações de imagens
  IMAGES: {
    QUALITY: 85,
    PLACEHOLDER_BLUR: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    SIZES: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  },
  
  // Configurações de bundle
  BUNDLE: {
    MAX_CHUNK_SIZE: 250000, // 250KB
    VENDOR_CHUNK_SIZE: 100000, // 100KB
    COMMON_CHUNK_SIZE: 50000, // 50KB
  },
  
  // Configurações de monitoramento
  MONITORING: {
    SLOW_REQUEST_THRESHOLD: 100, // 100ms
    MEMORY_WARNING_THRESHOLD: 100 * 1024 * 1024, // 100MB
    RENDER_WARNING_THRESHOLD: 16, // 16ms (60fps)
  },
};

// Função para obter configuração de cache baseada no tipo
export function getCacheConfig(type: 'default' | 'long' | 'short'): number {
  return PERFORMANCE_CONFIG.CACHE[type.toUpperCase() as keyof typeof PERFORMANCE_CONFIG.CACHE];
}

// Função para obter configuração de timing baseada na ação
export function getTimingConfig(action: 'search' | 'scroll' | 'resize'): number {
  const key = action.toUpperCase() as keyof typeof PERFORMANCE_CONFIG.TIMING;
  return PERFORMANCE_CONFIG.TIMING[key];
}

// Função para verificar se deve usar lazy loading
export function shouldLazyLoad(priority: 'high' | 'medium' | 'low'): boolean {
  return priority !== 'high';
}

// Função para obter qualidade de imagem baseada no contexto
export function getImageQuality(context: 'hero' | 'card' | 'thumbnail'): number {
  const qualityMap = {
    hero: 90,
    card: 85,
    thumbnail: 75,
  };
  
  return qualityMap[context];
}
