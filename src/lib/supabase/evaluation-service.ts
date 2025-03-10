
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Evaluation } from '@/lib/types';

class EvaluationService {
  async getAll() {
    return fetchAll<Evaluation>('evaluations');
  }
  
  async getById(id: string) {
    return fetchById<Evaluation>('evaluations', id);
  }
  
  async create(evaluation: Partial<Evaluation>) {
    return insert<Evaluation>('evaluations', evaluation);
  }
  
  async update(id: string, updates: Partial<Evaluation>) {
    return update<Evaluation>('evaluations', id, updates);
  }
  
  async delete(id: string) {
    return remove('evaluations', id);
  }
  
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
  
  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('doi_tuong', 'student')
      .eq('ghi_danh_id', studentId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
  
  async getByEntity(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('doi_tuong', entityType)
      .eq('ghi_danh_id', entityId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
}

export const evaluationService = new EvaluationService();
