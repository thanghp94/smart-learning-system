import { Student } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const studentService = {
  async getAll() {
    try {
      console.log('Fetching all students...');
      const students = await fetchAll<Student>('students');
      console.log(`Successfully fetched ${students.length} students`);
      console.log('Dữ liệu học sinh đã nhận:', students);
      return students;
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      console.error('Lỗi khi tải danh sách học sinh:', error);
      throw error;
    }
  },

  async getById(id: string) {
    return fetchById<Student>('students', id);
  },

  async create(student: Partial<Student>) {
    return insert<Student>('students', student);
  },

  async update(id: string, updates: Partial<Student>) {
    return update<Student>('students', id, updates);
  },

  async delete(id: string) {
    return remove('students', id);
  },

  // Additional methods for student-specific operations
  async getByClass(classId: string): Promise<Student[]> {
    try {
      const response = await fetch(`/api/students?classId=${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students by class');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching students by class:', error);
      throw error;
    }
  },

  async getByFacility(facilityId: string): Promise<Student[]> {
    try {
      const response = await fetch(`/api/students?facilityId=${facilityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students by facility');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching students by facility:', error);
      throw error;
    }
  },
};