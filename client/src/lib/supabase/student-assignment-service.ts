
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
    return fetchAll<StudentAssignment>('student-assignments');
  }

  async getById(id: string) {
    return fetchById<StudentAssignment>('student-assignments', id);
  }

  async create(data: Partial<StudentAssignment>) {
    return insert<StudentAssignment>('student-assignments', data);
  }

  async update(id: string, data: Partial<StudentAssignment>) {
    return update<StudentAssignment>('student-assignments', id, data);
  }

  async delete(id: string) {
    return remove('student-assignments', id);
  }

  async getByStudent(studentId: string) {
    try {
      const response = await fetch(`/api/student-assignments?studentId=${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student assignments');
      }
      return await response.json() as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      throw error;
    }
  }

  async getByClass(classId: string) {
    try {
      const response = await fetch(`/api/student-assignments?classId=${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignments by class');
      }
      return await response.json() as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching assignments by class:', error);
      throw error;
    }
  }

  async getByTeachingSession(sessionId: string) {
    try {
      const response = await fetch(`/api/student-assignments?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignments by teaching session');
      }
      return await response.json() as StudentAssignment[];
    } catch (error) {
      console.error('Error fetching assignments by teaching session:', error);
      throw error;
    }
  }
}

export const studentAssignmentService = new StudentAssignmentService();
