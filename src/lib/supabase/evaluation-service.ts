
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
  
  async getByTeacher(teacherId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('giao_vien_id', teacherId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
  
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('lop_id', classId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
  
  // Add the missing getByStudentId method
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('hoc_sinh_id', studentId);
    
    if (error) throw error;
    return data as Evaluation[];
  }
  
  // Add the method to get evaluations by entity
  async getByEntity(entityType: string, entityId: string) {
    if (entityType === 'student') {
      return this.getByStudentId(entityId);
    } else if (entityType === 'class') {
      return this.getByClass(entityId);
    } else if (entityType === 'teacher') {
      return this.getByTeacher(entityId);
    }
    
    throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

export const evaluationService = new EvaluationService();
