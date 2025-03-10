
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export interface StudentAssignment {
  id: string;
  hoc_sinh_id: string;
  buoi_day_id?: string;
  lop_chi_tiet_id?: string;
  tieu_de: string;
  mo_ta?: string;
  file?: string;
  hinh_anh?: string;
  ngay_giao: string | Date;
  han_nop?: string | Date;
  trang_thai: string; // assigned, submitted, reviewed, late
  diem?: number;
  nhan_xet?: string;
  created_at?: string;
  updated_at?: string;
}

class StudentAssignmentService {
  async getAll() {
    return fetchAll<StudentAssignment>('student_assignments');
  }

  async getById(id: string) {
    return fetchById<StudentAssignment>('student_assignments', id);
  }

  async create(data: Partial<StudentAssignment>) {
    return insert<StudentAssignment>('student_assignments', data);
  }

  async update(id: string, data: Partial<StudentAssignment>) {
    return update<StudentAssignment>('student_assignments', id, data);
  }

  async delete(id: string) {
    return remove('student_assignments', id);
  }

  async getByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_assignments')
        .select('*')
        .eq('hoc_sinh_id', studentId)
        .order('ngay_giao', { ascending: false });
      
      if (error) throw error;
      return data as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      throw error;
    }
  }

  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('student_assignments')
        .select('*')
        .eq('lop_chi_tiet_id', classId);
      
      if (error) throw error;
      return data as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching assignments by class:', error);
      throw error;
    }
  }

  async getByTeachingSession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('student_assignments')
        .select('*')
        .eq('buoi_day_id', sessionId);
      
      if (error) throw error;
      return data as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching assignments by teaching session:', error);
      throw error;
    }
  }
}

export const studentAssignmentService = new StudentAssignmentService();
