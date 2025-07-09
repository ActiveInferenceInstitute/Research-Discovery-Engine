/**
 * Performance Optimization Utilities
 * 
 * This module contains utilities for improving React performance,
 * including memoization helpers, lazy loading utilities, and optimization functions.
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Creates a stable callback that won't change between renders unless dependencies change
 * This is useful for preventing unnecessary re-renders of child components
 * 
 * @param callback - The callback function to stabilize
 * @param deps - Dependencies array
 * @returns Stable callback function
 * @example
 * const stableCallback = useStableCallback(handleClick, [data]);
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

/**
 * Memoizes a complex computation and only recalculates when dependencies change
 * 
 * @param factory - Function that returns the computed value
 * @param deps - Dependencies array
 * @returns Memoized computed value
 * @example
 * const expensiveValue = useStableMemo(() => processLargeData(data), [data]);
 */
export const useStableMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

/**
 * Debounced state hook that delays state updates until a specified delay has passed
 * Useful for search inputs and other frequently changing values
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * @example
 * const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for tracking the previous value of a state or prop
 * Useful for comparing current vs previous values
 * 
 * @param value - Current value
 * @returns Previous value
 * @example
 * const prevCount = usePrevious(count);
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Hook for checking if a component is currently mounted
 * Useful for preventing state updates on unmounted components
 * 
 * @returns Function that returns true if component is mounted
 * @example
 * const isMounted = useIsMounted();
 * if (isMounted()) setState(newValue);
 */
export const useIsMounted = (): (() => boolean) => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return useCallback(() => isMountedRef.current, []);
};

/**
 * Hook for creating a throttled callback function
 * Limits the execution rate of a function
 * 
 * @param callback - Function to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled callback function
 * @example
 * const throttledOnScroll = useThrottle(handleScroll, 100);
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef(Date.now());
  
  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

/**
 * Hook for creating a debounced callback function
 * Delays execution until after a specified delay
 * 
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced callback function
 * @example
 * const debouncedSearch = useDebounce(handleSearch, 300);
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

/**
 * Hook for lazy loading data with loading and error states
 * 
 * @param loader - Async function that loads the data
 * @param deps - Dependencies that trigger reload
 * @returns Object with data, loading, error, and retry function
 * @example
 * const { data, loading, error, retry } = useLazyLoad(() => fetchData(id), [id]);
 */
export const useLazyLoad = <T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useIsMounted();

  const load = useCallback(async () => {
    if (!isMounted()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loader();
      if (isMounted()) {
        setData(result);
      }
    } catch (err) {
      if (isMounted()) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [loader, isMounted]);

  useEffect(() => {
    load();
  }, deps);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { data, loading, error, retry };
};

/**
 * Hook for optimizing large list rendering with virtual scrolling support
 * 
 * @param items - Array of items to render
 * @param itemHeight - Height of each item in pixels
 * @param containerHeight - Height of the container in pixels
 * @returns Object with visible items and scroll handler
 * @example
 * const { visibleItems, onScroll } = useVirtualList(items, 50, 400);
 */
export const useVirtualList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = useMemo(() => 
    items.slice(visibleStart, visibleEnd).map((item, index) => ({
      item,
      index: visibleStart + index,
      style: {
        position: 'absolute' as const,
        top: (visibleStart + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }))
  , [items, visibleStart, visibleEnd, itemHeight]);
  
  const totalHeight = items.length * itemHeight;
  
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    onScroll
  };
};

/**
 * Creates a memoized component that only re-renders when specific props change
 * 
 * @param Component - React component to memoize
 * @param areEqual - Custom comparison function
 * @returns Memoized component
 * @example
 * const MemoizedComponent = createMemoComponent(MyComponent, (prev, next) => 
 *   prev.id === next.id && prev.data === next.data
 * );
 */
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

/**
 * Hook for batching state updates to improve performance
 * 
 * @param initialState - Initial state value
 * @returns Tuple with state and batched setter
 * @example
 * const [state, batchedSetState] = useBatchedState(initialValue);
 */
export const useBatchedState = <T>(initialState: T) => {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<((prev: T) => T)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    const updateFn = typeof updater === 'function' ? updater as (prev: T) => T : () => updater;
    
    pendingUpdates.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(currentState => {
        let newState = currentState;
        pendingUpdates.current.forEach(update => {
          newState = update(newState);
        });
        pendingUpdates.current = [];
        return newState;
      });
    }, 0);
  }, []);

  return [state, batchedSetState] as const;
};

/**
 * Hook for managing component intersection with viewport
 * Useful for lazy loading and infinite scrolling
 * 
 * @param options - Intersection observer options
 * @returns Ref and intersection state
 * @example
 * const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting] as const;
};

 