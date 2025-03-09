import { supabase } from './client';
import { fetchById, fetchAll, insert, update, remove, logActivity } from './base-service';
import { Student } from '@/lib/types';

class StudentService {
  /**
   * Fetches all students from the database
   */
  async getAll(): Promise<Student[]> {
    console.log('Fetching all students...');
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('ten_hoc_sinh', { ascending: true });
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} students`);
      
      // Ensure all records have required fields
      return (data || []).map(student => ({
        ...student,
        id: student.id || crypto.randomUUID(), // Make sure id is present
        // Normalize field names for consistency
        co_so_id: student.co_so_id || '',
      }));
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      throw error;
    }
  }

  /**
   * Fetches a single student by ID
   */
  async getById(id: string): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching student by ID:', error);
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      // Ensure required fields and consistent naming
      return {
        ...data,
        id: data.id || id,
        ten_hoc_sinh: data.ten_hoc_sinh || '',
        co_so_id: data.co_so_id || '',
      } as Student;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  /**
   * Creates a new student
   */
  async create(studentData: Omit<Student, 'id'> & { id?: string }): Promise<Student | null> {
    try {
      console.log('Creating new student:', studentData);
      
      // Create a new object with only the fields that exist in the database
      // Exclude fields that are not in the students table schema
      const { ghi_chu, ...validStudentData } = studentData;
      
      const { data, error } = await supabase
        .from('students')
        .insert(validStudentData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating student:', error);
        throw error;
      }
      
      console.log('Student created successfully:', data);
      
      // Log activity
      await logActivity(
        'create',
        'student',
        data.ten_hoc_sinh || 'Unknown',
        'system',
        'completed'
      );
      
      return data as Student;
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
  }

  /**
   * Updates an existing student
   */
  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      console.log('Updating student:', id, updates);
      
      // Remove fields that don't exist in the database
      const { ghi_chu, ...validUpdates } = updates;
      
      const { data, error } = await supabase
        .from('students')
        .update(validUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }
      
      console.log('Student updated successfully:', data);
      
      // Log activity
      await logActivity(
        'update',
        'student',
        data.ten_hoc_sinh,
        'system',
        'completed'
      );
      
      return data as Student;
    } catch (error) {
      console.error('Error in updateStudent:', error);
      throw error;
    }
  }

  /**
   * Deletes a student by ID
   */
  async delete(id: string): Promise<void> {
    try {
      // First, get the student to log their name
      const studentToDelete = await this.getById(id);
      
      if (!studentToDelete) {
        console.error('Student not found for deletion');
        throw new Error('Student not found');
      }
      
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
      
      console.log('Student deleted successfully:', id);
      
      // Log activity
      await logActivity(
        'delete',
        'student',
        studentToDelete.ten_hoc_sinh,
        'system',
        'completed'
      );
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      throw error;
    }
  }

  /**
   * Fetches students for a specific facility
   */
  async getByFacility(facilityId: string): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('co_so_ID', facilityId)
        .order('ten_hoc_sinh', { ascending: true });
      
      if (error) {
        console.error('Error fetching students by facility:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchStudentsByFacility:', error);
      return [];
    }
  }

  /**
   * Fetches students enrolled in a specific class
   */
  async getByClass(classId: string): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('hoc_sinh_id')
        .eq('lop_chi_tiet_id', classId);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const studentIds = data.map(enrollment => enrollment.hoc_sinh_id);
      
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .in('id', studentIds)
        .order('ten_hoc_sinh', { ascending: true });
      
      if (studentsError) {
        console.error('Error fetching students by IDs:', studentsError);
        return [];
      }
      
      return students || [];
    } catch (error) {
      console.error('Error in fetchStudentsByClass:', error);
      return [];
    }
  }
}

export const studentService = new StudentService();
