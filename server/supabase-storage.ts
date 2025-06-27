import { createClient } from '@supabase/supabase-js';
import type { IStorage } from './storage';
import type { 
  User, InsertUser,
  Student, InsertStudent,
  Employee, InsertEmployee,
  Facility, InsertFacility,
  Class, InsertClass,
  TeachingSession, InsertTeachingSession,
  Enrollment, InsertEnrollment,
  Attendance, InsertAttendance,
  Asset, InsertAsset
} from '../shared/schema';

// Supabase configuration from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          'x-application-name': 'school-management-system',
          'Content-Type': 'application/json'
        }
      }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Student operations
  async getStudents(): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const { data, error } = await this.supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const { data, error } = await this.supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const { data, error } = await this.supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Facility operations
  async getFacilities(): Promise<Facility[]> {
    const { data, error } = await this.supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getFacility(id: string): Promise<Facility | undefined> {
    const { data, error } = await this.supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const { data, error } = await this.supabase
      .from('facilities')
      .insert(facility)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFacility(id: string, facility: Partial<InsertFacility>): Promise<Facility | undefined> {
    const { data, error } = await this.supabase
      .from('facilities')
      .update(facility)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteFacility(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('facilities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Class operations
  async getClasses(): Promise<Class[]> {
    const { data, error } = await this.supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getClass(id: string): Promise<Class | undefined> {
    const { data, error } = await this.supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const { data, error } = await this.supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const { data, error } = await this.supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteClass(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Teaching Session operations
  async getTeachingSessions(): Promise<TeachingSession[]> {
    const { data, error } = await this.supabase
      .from('teaching_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getTeachingSession(id: string): Promise<TeachingSession | undefined> {
    const { data, error } = await this.supabase
      .from('teaching_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createTeachingSession(session: InsertTeachingSession): Promise<TeachingSession> {
    const { data, error } = await this.supabase
      .from('teaching_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTeachingSession(id: string, session: Partial<InsertTeachingSession>): Promise<TeachingSession | undefined> {
    const { data, error } = await this.supabase
      .from('teaching_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTeachingSession(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('teaching_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Enrollment operations
  async getEnrollments(): Promise<Enrollment[]> {
    const { data, error } = await this.supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const { data, error } = await this.supabase
      .from('enrollments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const { data, error } = await this.supabase
      .from('enrollments')
      .insert(enrollment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const { data, error } = await this.supabase
      .from('enrollments')
      .update(enrollment)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('enrollments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Attendance operations
  async getAttendances(): Promise<Attendance[]> {
    const { data, error } = await this.supabase
      .from('attendances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getAttendance(id: string): Promise<Attendance | undefined> {
    const { data, error } = await this.supabase
      .from('attendances')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const { data, error } = await this.supabase
      .from('attendances')
      .insert(attendance)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const { data, error } = await this.supabase
      .from('attendances')
      .update(attendance)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAttendance(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('attendances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Asset operations
  async getAssets(): Promise<Asset[]> {
    const { data, error } = await this.supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    const { data, error } = await this.supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const { data, error } = await this.supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const { data, error } = await this.supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAsset(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Generic operations for additional tables
  async getTasks(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getTask(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createTask(task: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTask(id: string, task: any): Promise<any | undefined> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Files operations
  async getFiles(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getFile(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createFile(fileData: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('files')
      .insert(fileData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFile(id: string, updates: any): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteFile(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('files')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Add all other required methods for remaining tables...
  
  async getContacts(): Promise<any[]> {
    const { data, error } = await this.supabase.from('contacts').select('*');
    if (error) throw error;
    return data || [];
  }

  async getContact(id: string): Promise<any | null> {
    const { data, error } = await this.supabase.from('contacts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createContact(contactData: any): Promise<any> {
    const { data, error } = await this.supabase.from('contacts').insert(contactData).select().single();
    if (error) throw error;
    return data;
  }

  async updateContact(id: string, updates: any): Promise<any | null> {
    const { data, error } = await this.supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteContact(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async getRequests(): Promise<any[]> {
    const { data, error } = await this.supabase.from('requests').select('*');
    if (error) throw error;
    return data || [];
  }

  async getRequest(id: string): Promise<any | null> {
    const { data, error } = await this.supabase.from('requests').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createRequest(requestData: any): Promise<any> {
    const { data, error } = await this.supabase.from('requests').insert(requestData).select().single();
    if (error) throw error;
    return data;
  }

  async updateRequest(id: string, updates: any): Promise<any | null> {
    const { data, error } = await this.supabase.from('requests').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteRequest(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('requests').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Employee Clock-in operations
  async getEmployeeClockIn(): Promise<any[]> {
    const { data, error } = await this.supabase.from('employee_clock_ins').select('*');
    if (error) throw error;
    return data || [];
  }

  async getEmployeeClockInById(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase.from('employee_clock_ins').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getEmployeeClockInByMonth(month: number, year: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('employee_clock_ins')
      .select('*')
      .gte('work_date', `${year}-${month.toString().padStart(2, '0')}-01`)
      .lt('work_date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`);
    if (error) throw error;
    return data || [];
  }

  async createEmployeeClockIn(data: any): Promise<any> {
    const { data: result, error } = await this.supabase.from('employee_clock_ins').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateEmployeeClockIn(id: string, data: any): Promise<any | undefined> {
    const { data: result, error } = await this.supabase.from('employee_clock_ins').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteEmployeeClockIn(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('employee_clock_ins').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Continue with other table implementations...
  async getEvaluations(): Promise<any[]> {
    const { data, error } = await this.supabase.from('evaluations').select('*');
    if (error) throw error;
    return data || [];
  }

  async getEvaluation(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase.from('evaluations').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createEvaluation(data: any): Promise<any> {
    const { data: result, error } = await this.supabase.from('evaluations').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateEvaluation(id: string, data: any): Promise<any | undefined> {
    const { data: result, error } = await this.supabase.from('evaluations').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteEvaluation(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('evaluations').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Continue implementing all required methods...
  async getPayroll(): Promise<any[]> {
    const { data, error } = await this.supabase.from('payroll').select('*');
    if (error) throw error;
    return data || [];
  }

  async getPayrollById(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase.from('payroll').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getPayrollByMonth(month: number, year: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('payroll')
      .select('*')
      .gte('thang_nam', `${year}-${month.toString().padStart(2, '0')}-01`)
      .lt('thang_nam', `${year}-${(month + 1).toString().padStart(2, '0')}-01`);
    if (error) throw error;
    return data || [];
  }

  async createPayroll(data: any): Promise<any> {
    const { data: result, error } = await this.supabase.from('payroll').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updatePayroll(id: string, data: any): Promise<any | undefined> {
    const { data: result, error } = await this.supabase.from('payroll').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deletePayroll(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('payroll').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async getAdmissions(): Promise<any[]> {
    const { data, error } = await this.supabase.from('admissions').select('*');
    if (error) throw error;
    return data || [];
  }

  async getAdmission(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase.from('admissions').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createAdmission(data: any): Promise<any> {
    const { data: result, error } = await this.supabase.from('admissions').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateAdmission(id: string, data: any): Promise<any | undefined> {
    const { data: result, error } = await this.supabase.from('admissions').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteAdmission(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('admissions').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async getImages(): Promise<any[]> {
    const { data, error } = await this.supabase.from('images').select('*');
    if (error) throw error;
    return data || [];
  }

  async getImage(id: string): Promise<any | undefined> {
    const { data, error } = await this.supabase.from('images').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createImage(data: any): Promise<any> {
    const { data: result, error } = await this.supabase.from('images').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateImage(id: string, data: any): Promise<any | undefined> {
    const { data: result, error } = await this.supabase.from('images').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteImage(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('images').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Utility methods
  async executeQuery(query: string): Promise<any> {
    // For Supabase, we'll use RPC calls for custom queries
    const { data, error } = await this.supabase.rpc('execute_sql', { query });
    if (error) throw error;
    return data;
  }

  async getTableExists(tableName: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from(tableName).select('*').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseStorage = new SupabaseStorage();