
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
  getAll: () => fetchAll<Request>('requests'),
  
  getById: (id: string) => fetchById<Request>('requests', id),
  
  create: (request: Partial<Request>) => insert<Request>('requests', request),
  
  update: (id: string, updates: Partial<Request>) => update<Request>('requests', id, updates),
  
  delete: (id: string) => remove('requests', id),
  
  getByStatus: async (status: string): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', status);
    
    if (error) {
      console.error('Error fetching requests by status:', error);
      throw error;
    }
    
    return data as Request[];
  },
  
  getByRequester: async (requester: string): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('requester', requester);
    
    if (error) {
      console.error('Error fetching requests by requester:', error);
      throw error;
    }
    
    return data as Request[];
  },
  
  updateStatus: async (id: string, status: string): Promise<Request> => {
    return update<Request>('requests', id, { status });
  }
};
