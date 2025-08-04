// API Response Caching System
import { logDebug, logInfo, logWarn } from './logger';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

export interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of entries
  enablePersistence?: boolean; // Store in localStorage
  keyPrefix?: string;
}

export class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;
  private maxSize: number;
  private enablePersistence: boolean;
  private keyPrefix: string;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 100;
    this.enablePersistence = options.enablePersistence || false;
    this.keyPrefix = options.keyPrefix || 'api_cache_';

    // Load persisted cache entries
    if (this.enablePersistence) {
      this.loadFromStorage();
    }

    // Start cleanup interval
    this.startCleanup();

    logInfo('API Cache initialized', {
      defaultTTL: this.defaultTTL,
      maxSize: this.maxSize,
      enablePersistence: this.enablePersistence
    });
  }

  private generateKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    if (this.cache.size === 0) return;

    let oldestKey = '';
    let oldestTimestamp = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      if (this.enablePersistence) {
        localStorage.removeItem(this.generateKey(oldestKey));
      }
      logDebug('Evicted oldest cache entry', { key: oldestKey });
    }
  }

  private saveToStorage(key: string, entry: CacheEntry<any>): void {
    if (!this.enablePersistence) return;

    try {
      localStorage.setItem(this.generateKey(key), JSON.stringify(entry));
    } catch (error) {
      logWarn('Failed to save cache entry to localStorage', { key, error });
    }
  }

  private loadFromStorage(): void {
    if (!this.enablePersistence) return;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.startsWith(this.keyPrefix)) {
          const cacheKey = storageKey.replace(this.keyPrefix, '');
          const entryData = localStorage.getItem(storageKey);
          
          if (entryData) {
            const entry: CacheEntry<any> = JSON.parse(entryData);
            
            // Check if entry is still valid
            if (!this.isExpired(entry)) {
              this.cache.set(cacheKey, entry);
            } else {
              // Remove expired entry from localStorage
              localStorage.removeItem(storageKey);
            }
          }
        }
      }
      
      logInfo('Loaded cache entries from localStorage', { count: this.cache.size });
    } catch (error) {
      logWarn('Failed to load cache from localStorage', { error });
    }
  }

  private startCleanup(): void {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup(): void {
    const initialSize = this.cache.size;
    let removedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      if (this.enablePersistence) {
        localStorage.removeItem(this.generateKey(key));
      }
      removedCount++;
    });

    if (removedCount > 0) {
      logDebug('Cache cleanup completed', { 
        initialSize, 
        removedCount, 
        currentSize: this.cache.size 
      });
    }
  }

  // Get cached data
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logDebug('Cache miss', { key });
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      if (this.enablePersistence) {
        localStorage.removeItem(this.generateKey(key));
      }
      logDebug('Cache entry expired', { key });
      return null;
    }

    logDebug('Cache hit', { key, age: Date.now() - entry.timestamp });
    return entry.data;
  }

  // Set cached data
  set<T>(key: string, data: T, ttl?: number): void {
    // Ensure we don't exceed max size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      key
    };

    this.cache.set(key, entry);
    this.saveToStorage(key, entry);

    logDebug('Cache entry set', { 
      key, 
      ttl: entry.ttl, 
      size: this.cache.size 
    });
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  // Remove specific entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted && this.enablePersistence) {
      localStorage.removeItem(this.generateKey(key));
    }
    
    if (deleted) {
      logDebug('Cache entry deleted', { key });
    }
    
    return deleted;
  }

  // Clear all cache entries
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();

    if (this.enablePersistence) {
      // Remove all cache entries from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.keyPrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    logInfo('Cache cleared', { previousSize: size });
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalAge = 0;

    this.cache.forEach((entry) => {
      const age = now - entry.timestamp;
      totalAge += age;
      
      if (this.isExpired(entry)) {
        expiredCount++;
      }
    });

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expiredCount,
      averageAge: this.cache.size > 0 ? totalAge / this.cache.size : 0,
      hitRate: 0, // Would need to track hits/misses to calculate
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let totalSize = 0;
    
    this.cache.forEach((entry, key) => {
      totalSize += key.length * 2; // UTF-16 characters
      totalSize += JSON.stringify(entry).length * 2;
    });
    
    return totalSize;
  }

  // Invalidate entries matching a pattern
  invalidatePattern(pattern: RegExp): number {
    let invalidatedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.delete(key);
      invalidatedCount++;
    });

    if (invalidatedCount > 0) {
      logInfo('Cache entries invalidated by pattern', { 
        pattern: pattern.toString(), 
        count: invalidatedCount 
      });
    }

    return invalidatedCount;
  }

  // Preload data into cache
  preload<T>(key: string, dataPromise: Promise<T>, ttl?: number): Promise<T> {
    return dataPromise.then(data => {
      this.set(key, data, ttl);
      return data;
    }).catch(error => {
      logWarn('Failed to preload cache entry', { key, error });
      throw error;
    });
  }

  // Destroy cache and cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.clear();
    logInfo('API Cache destroyed');
  }
}

// Create default cache instance
export const apiCache = new ApiCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  enablePersistence: true,
  keyPrefix: 'sls_api_'
});

// Cache key generators for different types of requests
export const cacheKeys = {
  list: (endpoint: string, params?: Record<string, any>) => {
    const paramString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return `list_${endpoint}${paramString}`;
  },
  
  detail: (endpoint: string, id: string) => `detail_${endpoint}_${id}`,
  
  search: (endpoint: string, query: string, filters?: Record<string, any>) => {
    const filterString = filters ? JSON.stringify(filters) : '';
    return `search_${endpoint}_${query}_${filterString}`;
  },
  
  count: (endpoint: string, filters?: Record<string, any>) => {
    const filterString = filters ? JSON.stringify(filters) : '';
    return `count_${endpoint}_${filterString}`;
  }
};

// Cache TTL presets
export const cacheTTL = {
  short: 1 * 60 * 1000,      // 1 minute
  medium: 5 * 60 * 1000,     // 5 minutes
  long: 30 * 60 * 1000,      // 30 minutes
  veryLong: 2 * 60 * 60 * 1000, // 2 hours
  static: 24 * 60 * 60 * 1000   // 24 hours
};

// Utility functions for common caching patterns
export const cacheUtils = {
  // Cache a function's result
  memoize: <T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator: (...args: Parameters<T>) => string,
    ttl?: number
  ): T => {
    return ((...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      const cached = apiCache.get(key);
      
      if (cached !== null) {
        return cached;
      }
      
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.then(data => {
          apiCache.set(key, data, ttl);
          return data;
        });
      }
      
      apiCache.set(key, result, ttl);
      return result;
    }) as T;
  },

  // Invalidate cache entries for an entity
  invalidateEntity: (entityType: string, entityId?: string) => {
    if (entityId) {
      // Invalidate specific entity
      apiCache.invalidatePattern(new RegExp(`${entityType}.*${entityId}`));
    } else {
      // Invalidate all entries for entity type
      apiCache.invalidatePattern(new RegExp(`${entityType}`));
    }
  },

  // Warm up cache with commonly accessed data
  warmUp: async (endpoints: Array<{ key: string; fetcher: () => Promise<any>; ttl?: number }>) => {
    const promises = endpoints.map(({ key, fetcher, ttl }) => 
      apiCache.preload(key, fetcher(), ttl)
    );
    
    try {
      await Promise.allSettled(promises);
      logInfo('Cache warm-up completed', { endpoints: endpoints.length });
    } catch (error) {
      logWarn('Cache warm-up failed', { error });
    }
  }
};

export default apiCache;
