
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Request } from '@/lib/types';

class RequestService {
  async getAll() {
    return fetchAll<Request>('requests');
  }
  
  async getById(id: string) {
    return fetchById<Request>('requests', id);
  }
  
  async create(request: Partial<Request>) {
    return insert<Request>('requests', request);
  }
  
  async update(id: string, updates: Partial<Request>) {
    return update<Request>('requests', id, updates);
  }
  
  async delete(id: string) {
    return remove('requests', id);
  }
  
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) throw error;
    return data as Request[];
  }
  
  async getByRequester(requester: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('nguoi_yeu_cau', requester);
    
    if (error) throw error;
    return data as Request[];
  }
  
  // Add updateStatus method
  async updateStatus(id: string, status: string, comments?: string) {
    const updates: Partial<Request> = {
      trang_thai: status,
      updated_at: new Date().toISOString()
    };
    
    if (comments) {
      updates.ghi_chu = comments;
    }
    
    return this.update(id, updates);
  }
}

export const requestService = new RequestService();
