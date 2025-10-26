// hooks/useLazyLoad.ts
"use client";

import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return {
    ref,
    isIntersecting,
    hasIntersected: triggerOnce ? hasIntersected : isIntersecting,
  };
}

// Hook para lazy loading de imagens
export function useLazyImage(src: string, options: UseLazyLoadOptions = {}) {
  const { ref, hasIntersected } = useLazyLoad(options);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
      img.src = src;
    }
  }, [hasIntersected, src]);

  return {
    ref,
    isLoaded,
    hasError,
    shouldLoad: hasIntersected,
  };
}
