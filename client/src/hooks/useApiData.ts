import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { logApiCall, logError } from '../lib/logger';
import type { ApiResponse, QueryOptions } from '../types/api';

export interface UseApiDataOptions<T> {
  endpoint: string;
  initialData?: T[];
  autoFetch?: boolean;
  dependencies?: any[];
  queryOptions?: QueryOptions;
}

export interface UseApiDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (item: Partial<T>) => Promise<T | null>;
  update: (id: string, item: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  setData: (data: T[]) => void;
  clearError: () => void;
}

export function useApiData<T = any>({
  endpoint,
  initialData = [],
  autoFetch = true,
  dependencies = [],
  queryOptions
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchData = useCallback(async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      let url = `/${endpoint}`;
      
      // Add query parameters if provided
      if (queryOptions) {
        const params = new URLSearchParams();
        
        if (queryOptions.page) params.append('page', queryOptions.page.toString());
        if (queryOptions.limit) params.append('limit', queryOptions.limit.toString());
        if (queryOptions.search) params.append('search', queryOptions.search);
        if (queryOptions.sort) {
          params.append('sortBy', queryOptions.sort.field);
          params.append('sortOrder', queryOptions.sort.direction);
        }
        if (queryOptions.filters) {
          Object.entries(queryOptions.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, value.toString());
            }
          });
        }
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await apiClient.get<T[]>(url);
      const duration = Date.now() - startTime;
      
      logApiCall('GET', url, duration, 200, { count: response.length });
      setData(response);
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      
      logApiCall('GET', `/${endpoint}`, duration, 500, { error: errorMessage });
      logError(`Failed to fetch ${endpoint}`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, queryOptions]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Partial<T>): Promise<T | null> => {
    const startTime = Date.now();
    setError(null);

    try {
      const response = await apiClient.post<T>(`/${endpoint}`, item);
      const duration = Date.now() - startTime;
      
      logApiCall('POST', `/${endpoint}`, duration, 201);
      
      // Add the new item to the current data
      setData(prevData => [...prevData, response]);
      
      return response;
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      
      logApiCall('POST', `/${endpoint}`, duration, 500, { error: errorMessage });
      logError(`Failed to create ${endpoint}`, err);
      setError(errorMessage);
      
      return null;
    }
  }, [endpoint]);

  const update = useCallback(async (id: string, item: Partial<T>): Promise<T | null> => {
    const startTime = Date.now();
    setError(null);

    try {
      const response = await apiClient.patch<T>(`/${endpoint}/${id}`, item);
      const duration = Date.now() - startTime;
      
      logApiCall('PATCH', `/${endpoint}/${id}`, duration, 200);
      
      // Update the item in the current data
      setData(prevData => 
        prevData.map(dataItem => 
          (dataItem as any).id === id ? response : dataItem
        )
      );
      
      return response;
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      
      logApiCall('PATCH', `/${endpoint}/${id}`, duration, 500, { error: errorMessage });
      logError(`Failed to update ${endpoint}`, err);
      setError(errorMessage);
      
      return null;
    }
  }, [endpoint]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const startTime = Date.now();
    setError(null);

    try {
      await apiClient.delete(`/${endpoint}/${id}`);
      const duration = Date.now() - startTime;
      
      logApiCall('DELETE', `/${endpoint}/${id}`, duration, 200);
      
      // Remove the item from the current data
      setData(prevData => 
        prevData.filter(dataItem => (dataItem as any).id !== id)
      );
      
      return true;
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      
      logApiCall('DELETE', `/${endpoint}/${id}`, duration, 500, { error: errorMessage });
      logError(`Failed to delete ${endpoint}`, err);
      setError(errorMessage);
      
      return false;
    }
  }, [endpoint]);

  // Auto-fetch data on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    setData,
    clearError
  };
}

// Specialized hooks for common entities
export const useStudents = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'students', ...options });

export const useEmployees = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'employees', ...options });

export const useClasses = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'classes', ...options });

export const useTeachingSessions = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'teaching-sessions', ...options });

export const useFacilities = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'facilities', ...options });

export const useAssets = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'assets', ...options });

export const useTasks = (options?: Partial<UseApiDataOptions<any>>) => 
  useApiData({ endpoint: 'tasks', ...options });
