// hooks/usePerformance.ts
"use client";

import { useEffect, useRef, useState } from 'react';

// Hook para debounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para throttle
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

// Hook para medir performance
export function usePerformance() {
  const [metrics, setMetrics] = useState<{
    renderTime: number;
    mountTime: number;
  }>({
    renderTime: 0,
    mountTime: 0,
  });

  const mountTime = useRef<number>(Date.now());
  const renderStart = useRef<number>(0);

  useEffect(() => {
    const mountDuration = Date.now() - mountTime.current;
    setMetrics(prev => ({
      ...prev,
      mountTime: mountDuration,
    }));
  }, []);

  const startRender = () => {
    renderStart.current = performance.now();
  };

  const endRender = () => {
    const renderTime = performance.now() - renderStart.current;
    setMetrics(prev => ({
      ...prev,
      renderTime,
    }));
  };

  return {
    metrics,
    startRender,
    endRender,
  };
}

// Hook para otimização de re-renders
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef<React.DependencyList>(deps);

  // Verificar se as dependências mudaram
  const hasChanged = depsRef.current.some((dep, index) => dep !== deps[index]);

  if (hasChanged) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }

  return callbackRef.current;
}

// Hook para lazy loading de dados
export function useLazyData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    if (hasFetched.current) return;
    
    hasFetched.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

// Hook para virtualização simples
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
}
