
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
  getAll: () => fetchAll<Evaluation>('evaluations'),
  
  getById: (id: string) => fetchById<Evaluation>('evaluations', id),
  
  create: (evaluation: Partial<Evaluation>) => insert<Evaluation>('evaluations', evaluation),
  
  update: (id: string, updates: Partial<Evaluation>) => update<Evaluation>('evaluations', id, updates),
  
  delete: (id: string) => remove('evaluations', id),
  
  getByStatus: async (status: string): Promise<Evaluation[]> => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) {
      console.error('Error fetching evaluations by status:', error);
      throw error;
    }
    
    return data as Evaluation[];
  },
  
  getByTarget: async (target: string): Promise<Evaluation[]> => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('doi_tuong', target);
    
    if (error) {
      console.error('Error fetching evaluations by target:', error);
      throw error;
    }
    
    return data as Evaluation[];
  }
};
