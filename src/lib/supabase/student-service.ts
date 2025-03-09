
import { Student } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const studentService = {
  getAll: () => fetchAll<Student>('students'),
  getById: (id: string) => fetchById<Student>('students', id),
  create: async (student: Partial<Student>) => {
    console.log("Creating student with data:", student);
    
    // Format the date fields properly if they exist
    const formattedData = {
      ...student,
      ngay_sinh: student.ngay_sinh || null,
      han_hoc_phi: student.han_hoc_phi || null,
      ngay_bat_dau_hoc_phi: student.ngay_bat_dau_hoc_phi || null
    };
    
    return insert<Student>('students', formattedData);
  },
  update: (id: string, updates: Partial<Student>) => update<Student>('students', id, updates),
  delete: (id: string) => remove('students', id),
  getByFacility: async (facilityId: string): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('co_so_ID', facilityId);
    
    if (error) {
      console.error('Error fetching students by facility:', error);
      throw error;
    }
    
    return data as Student[];
  }
};
