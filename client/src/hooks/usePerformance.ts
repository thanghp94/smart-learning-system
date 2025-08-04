import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { logPerformance } from '../lib/logger';

// Hook for memoizing expensive calculations
export function useExpensiveCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(() => {
    const startTime = performance.now();
    const result = calculation();
    const duration = performance.now() - startTime;
    
    if (duration > 100) { // Log if calculation takes more than 100ms
      logPerformance('Expensive calculation', duration, { 
        dependencies: dependencies.length 
      });
    }
    
    return result;
  }, dependencies);
}

// Hook for debouncing values
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

// Hook for throttling function calls
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCall.current = Date.now();
        callback(...args);
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]) as T;
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current++;
  });

  useEffect(() => {
    const duration = performance.now() - startTime.current;
    
    if (duration > 16) { // Log if render takes more than 16ms (60fps threshold)
      logPerformance(`${componentName} render`, duration, {
        renderCount: renderCount.current
      });
    }
  });

  return {
    renderCount: renderCount.current,
    logRender: (additionalData?: any) => {
      const duration = performance.now() - startTime.current;
      logPerformance(`${componentName} manual log`, duration, {
        renderCount: renderCount.current,
        ...additionalData
      });
    }
  };
}

// Hook for intersection observer (lazy loading)
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const ref = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  return [ref, isIntersecting];
}

// Hook for virtual scrolling
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}

// Hook for measuring element size
export function useElementSize(): [React.RefCallback<HTMLElement>, { width: number; height: number }] {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element]);

  return [ref, size];
}

// Hook for idle callback
export function useIdleCallback(callback: () => void, dependencies: React.DependencyList) {
  useEffect(() => {
    const handle = typeof requestIdleCallback !== 'undefined' ? 
      requestIdleCallback(callback) : 
      setTimeout(callback, 0);

    return () => {
      if (typeof requestIdleCallback !== 'undefined') {
        cancelIdleCallback(handle as number);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, dependencies);
}

// Hook for prefetching data
export function usePrefetch<T>(
  fetcher: () => Promise<T>,
  condition: boolean = true,
  delay: number = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!condition) return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Prefetch failed'));
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [fetcher, condition, delay]);

  return { data, loading, error };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T, update: Partial<T>) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (update: Partial<T>) => {
    const previousData = data;
    
    // Optimistically update the UI
    setData(current => ({ ...current, ...update }));
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateFn(data, update);
      setData(result);
    } catch (err) {
      // Revert on error
      setData(previousData);
      setError(err instanceof Error ? err : new Error('Update failed'));
    } finally {
      setIsUpdating(false);
    }
  }, [data, updateFn]);

  return {
    data,
    update,
    isUpdating,
    error
  };
}

// Hook for batch updates
export function useBatchUpdates<T>(
  batchSize: number = 10,
  delay: number = 100
) {
  const [queue, setQueue] = useState<T[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const addToQueue = useCallback((item: T) => {
    setQueue(current => [...current, item]);
  }, []);

  const processBatch = useCallback((processor: (batch: T[]) => Promise<void>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (queue.length === 0) return;

      setIsProcessing(true);
      
      try {
        const batch = queue.slice(0, batchSize);
        await processor(batch);
        setQueue(current => current.slice(batchSize));
      } catch (error) {
        console.error('Batch processing failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }, delay);
  }, [queue, batchSize, delay]);

  return {
    queue,
    queueSize: queue.length,
    addToQueue,
    processBatch,
    isProcessing
  };
}

export default {
  useExpensiveCalculation,
  useDebounce,
  useThrottle,
  useRenderPerformance,
  useIntersectionObserver,
  useVirtualScroll,
  useElementSize,
  useIdleCallback,
  usePrefetch,
  useOptimisticUpdate,
  useBatchUpdates
};
