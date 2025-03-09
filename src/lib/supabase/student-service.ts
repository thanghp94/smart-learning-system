
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
      
      // Fix case sensitivity issues and field mapping
      // Convert camelCase/PascalCase to snake_case for database
      const mappedData = {
        ten_hoc_sinh: studentData.ten_hoc_sinh,
        gioi_tinh: studentData.gioi_tinh,
        ngay_sinh: studentData.ngay_sinh,
        co_so_id: studentData.co_so_id,
        ten_ph: studentData.ten_PH, // Map to correct column name
        sdt_ph1: studentData.sdt_ph1,
        email_ph1: studentData.email_ph1,
        dia_chi: studentData.dia_chi,
        password: studentData.password,
        parentpassword: studentData.parentpassword,
        trang_thai: studentData.trang_thai,
        ct_hoc: studentData.ct_hoc,
        han_hoc_phi: studentData.han_hoc_phi,
        ngay_bat_dau_hoc_phi: studentData.ngay_bat_dau_hoc_phi,
        mo_ta_hs: studentData.ghi_chu,
      };
      
      console.log('Mapped student data for insert:', mappedData);
      
      const { data, error } = await supabase
        .from('students')
        .insert(mappedData)
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
      
      // Fix case sensitivity issues and field mapping
      const mappedUpdates: Record<string, any> = {};
      
      // Map fields explicitly to handle case differences
      if (updates.ten_hoc_sinh !== undefined) mappedUpdates.ten_hoc_sinh = updates.ten_hoc_sinh;
      if (updates.gioi_tinh !== undefined) mappedUpdates.gioi_tinh = updates.gioi_tinh;
      if (updates.ngay_sinh !== undefined) mappedUpdates.ngay_sinh = updates.ngay_sinh;
      if (updates.co_so_id !== undefined) mappedUpdates.co_so_id = updates.co_so_id;
      if (updates.ten_PH !== undefined) mappedUpdates.ten_ph = updates.ten_PH;
      if (updates.sdt_ph1 !== undefined) mappedUpdates.sdt_ph1 = updates.sdt_ph1;
      if (updates.email_ph1 !== undefined) mappedUpdates.email_ph1 = updates.email_ph1;
      if (updates.dia_chi !== undefined) mappedUpdates.dia_chi = updates.dia_chi;
      if (updates.password !== undefined) mappedUpdates.password = updates.password;
      if (updates.parentpassword !== undefined) mappedUpdates.parentpassword = updates.parentpassword;
      if (updates.trang_thai !== undefined) mappedUpdates.trang_thai = updates.trang_thai;
      if (updates.ct_hoc !== undefined) mappedUpdates.ct_hoc = updates.ct_hoc;
      if (updates.han_hoc_phi !== undefined) mappedUpdates.han_hoc_phi = updates.han_hoc_phi;
      if (updates.ngay_bat_dau_hoc_phi !== undefined) mappedUpdates.ngay_bat_dau_hoc_phi = updates.ngay_bat_dau_hoc_phi;
      if (updates.ghi_chu !== undefined) mappedUpdates.mo_ta_hs = updates.ghi_chu;
      
      console.log('Mapped student data for update:', mappedUpdates);
      
      const { data, error } = await supabase
        .from('students')
        .update(mappedUpdates)
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
