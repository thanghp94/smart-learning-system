
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

interface Evaluation {
  id: string;
  ten_danh_gia: string;
  doi_tuong: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
}

export const evaluationService = {
  getAll: async (): Promise<Evaluation[]> => {
    try {
      return await fetchAll<Evaluation>('evaluations');
    } catch (error) {
      console.error('Error fetching all evaluations:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Evaluation | null> => {
    try {
      return await fetchById<Evaluation>('evaluations', id);
    } catch (error) {
      console.error('Error fetching evaluation by ID:', error);
      return null;
    }
  },
  
  create: async (evaluation: Partial<Evaluation>): Promise<Evaluation | null> => {
    try {
      return await insert<Evaluation>('evaluations', evaluation);
    } catch (error) {
      console.error('Error creating evaluation:', error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Evaluation>): Promise<Evaluation | null> => {
    try {
      return await update<Evaluation>('evaluations', id, updates);
    } catch (error) {
      console.error('Error updating evaluation:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await remove('evaluations', id);
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      throw error;
    }
  },
  
  getByStatus: async (status: string): Promise<Evaluation[]> => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('trang_thai', status);
      
      if (error) {
        console.error('Error fetching evaluations by status:', error);
        throw error;
      }
      
      return data as Evaluation[];
    } catch (error) {
      console.error('Error in getByStatus:', error);
      return [];
    }
  },
  
  getByTarget: async (target: string): Promise<Evaluation[]> => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('doi_tuong', target);
      
      if (error) {
        console.error('Error fetching evaluations by target:', error);
        throw error;
      }
      
      return data as Evaluation[];
    } catch (error) {
      console.error('Error in getByTarget:', error);
      return [];
    }
  }
};
