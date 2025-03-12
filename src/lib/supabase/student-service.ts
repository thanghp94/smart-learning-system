
import { supabase } from './client';
import { fetchById, fetchAll, insert, update, remove, logActivity } from './base-service';
import { Student } from '@/lib/types';

class StudentService {
  // Core CRUD operations
  
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
      return this.normalizeStudentData(data || []);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      throw error;
    }
  }

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
      
      if (!data) return null;
      
      return this.normalizeStudentData([data])[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  async create(studentData: Omit<Student, 'id'> & { id?: string }): Promise<Student | null> {
    try {
      console.log('Creating new student:', studentData);
      
      // Map data to correct field names
      const mappedData = this.mapStudentDataForDB(studentData);
      
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

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      console.log('Updating student:', id, updates);
      
      // Map fields explicitly
      const mappedUpdates = this.mapStudentDataForDB(updates);
      
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

  // Specialized query methods
  
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
      
      return this.normalizeStudentData(data || []);
    } catch (error) {
      console.error('Error in fetchStudentsByFacility:', error);
      return [];
    }
  }

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
      
      return this.normalizeStudentData(students || []);
    } catch (error) {
      console.error('Error in fetchStudentsByClass:', error);
      return [];
    }
  }

  // Helper methods for data normalization
  
  private normalizeStudentData(students: any[]): Student[] {
    return students.map(student => ({
      ...student,
      id: student.id || crypto.randomUUID(),
      co_so_id: student.co_so_id || '',
      ten_hoc_sinh: student.ten_hoc_sinh || '',
      email: student.email || student.email_ph1 || ''
    }));
  }

  private mapStudentDataForDB(studentData: Partial<Student>): Record<string, any> {
    const mappedData: Record<string, any> = {};
    
    // Map fields explicitly to handle case differences
    if (studentData.ten_hoc_sinh !== undefined) mappedData.ten_hoc_sinh = studentData.ten_hoc_sinh;
    if (studentData.gioi_tinh !== undefined) mappedData.gioi_tinh = studentData.gioi_tinh;
    if (studentData.ngay_sinh !== undefined) mappedData.ngay_sinh = studentData.ngay_sinh;
    if (studentData.co_so_id !== undefined) mappedData.co_so_id = studentData.co_so_id;
    if (studentData.ten_PH !== undefined) mappedData.ten_ph = studentData.ten_PH;
    if (studentData.sdt_ph1 !== undefined) mappedData.sdt_ph1 = studentData.sdt_ph1;
    if (studentData.email_ph1 !== undefined) mappedData.email_ph1 = studentData.email_ph1;
    if (studentData.dia_chi !== undefined) mappedData.dia_chi = studentData.dia_chi;
    if (studentData.password !== undefined) mappedData.password = studentData.password;
    if (studentData.parentpassword !== undefined) mappedData.parentpassword = studentData.parentpassword;
    if (studentData.trang_thai !== undefined) mappedData.trang_thai = studentData.trang_thai;
    if (studentData.ct_hoc !== undefined) mappedData.ct_hoc = studentData.ct_hoc;
    if (studentData.han_hoc_phi !== undefined) mappedData.han_hoc_phi = studentData.han_hoc_phi;
    if (studentData.ngay_bat_dau_hoc_phi !== undefined) mappedData.ngay_bat_dau_hoc_phi = studentData.ngay_bat_dau_hoc_phi;
    if (studentData.ghi_chu !== undefined) mappedData.mo_ta_hs = studentData.ghi_chu;
    
    return mappedData;
  }
}

export const studentService = new StudentService();
