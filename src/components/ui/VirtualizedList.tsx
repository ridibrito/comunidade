// components/ui/VirtualizedList.tsx
"use client";

import React, { useMemo } from 'react';
import { useVirtualization } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const { visibleItems, totalHeight, offsetY, setScrollTop } = useVirtualization(
    items,
    itemHeight,
    containerHeight
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
  };

  return (
    <div
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de lista otimizada com paginação
interface OptimizedListProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function OptimizedList<T>({
  items,
  pageSize = 20,
  renderItem,
  className,
  loading = false,
  onLoadMore,
  hasMore = false,
}: OptimizedListProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const visibleItems = useMemo(() => {
    return items.slice(0, currentPage * pageSize);
  }, [items, currentPage, pageSize]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
      onLoadMore?.();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {visibleItems.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-brand-accent text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  );
}
