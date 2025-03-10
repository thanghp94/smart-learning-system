
import { Request } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';

export const requestService = {
  async getAll() {
    return fetchAll<Request>('requests');
  },
  
  async getById(id: string) {
    return fetchById<Request>('requests', id);
  },
  
  async create(data: Partial<Request>) {
    try {
      const result = await insert<Request>('requests', data);
      await logActivity('create', 'request', data.title || 'New request', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },
  
  async update(id: string, data: Partial<Request>) {
    try {
      const result = await update<Request>('requests', id, data);
      await logActivity('update', 'request', data.title || 'Update request', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },
  
  async delete(id: string) {
    try {
      await remove('requests', id);
      await logActivity('delete', 'request', 'Delete request', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },
  
  async updateStatus(id: string, status: string, processedDate?: string) {
    try {
      const data: Partial<Request> = { 
        status,
        processed_at: processedDate || new Date().toISOString()
      };
      
      const result = await update<Request>('requests', id, data);
      await logActivity('update', 'request', `Request status updated to ${status}`, 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  },
  
  async getByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching requests with status ${status}:`, error);
      throw error;
    }
  },
  
  async getByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('requester', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching requests for user ${userId}:`, error);
      throw error;
    }
  },
};
