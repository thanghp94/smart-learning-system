
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

interface Request {
  id: string;
  title: string;
  description?: string;
  requester: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export const requestService = {
  getAll: async (): Promise<Request[]> => {
    try {
      return await fetchAll<Request>('requests');
    } catch (error) {
      console.error('Error fetching all requests:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Request | null> => {
    try {
      return await fetchById<Request>('requests', id);
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      return null;
    }
  },
  
  create: async (request: Partial<Request>): Promise<Request | null> => {
    try {
      return await insert<Request>('requests', request);
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Request>): Promise<Request | null> => {
    try {
      return await update<Request>('requests', id, updates);
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await remove('requests', id);
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },
  
  getByStatus: async (status: string): Promise<Request[]> => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('status', status);
      
      if (error) {
        console.error('Error fetching requests by status:', error);
        throw error;
      }
      
      return data as Request[];
    } catch (error) {
      console.error('Error in getByStatus:', error);
      return [];
    }
  },
  
  getByRequester: async (requester: string): Promise<Request[]> => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('requester', requester);
      
      if (error) {
        console.error('Error fetching requests by requester:', error);
        throw error;
      }
      
      return data as Request[];
    } catch (error) {
      console.error('Error in getByRequester:', error);
      return [];
    }
  }
};
