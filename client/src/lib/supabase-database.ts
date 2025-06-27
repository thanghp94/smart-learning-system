import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper configuration
const supabaseUrl = 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Unified database service for Supabase exclusively
class SupabaseDatabaseService {
  constructor() {
    console.log('Using Supabase database exclusively');
  }

  // Employee methods
  async getEmployees() {
    try {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async createEmployee(employee: any) {
    try {
      const { data, error } = await supabase.from('employees').insert(employee).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, employee: any) {
    try {
      const { data, error } = await supabase.from('employees').update(employee).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string) {
    try {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Student methods
  async getStudents() {
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async createStudent(student: any) {
    try {
      const { data, error } = await supabase.from('students').insert(student).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, student: any) {
    try {
      const { data, error } = await supabase.from('students').update(student).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // Class methods
  async getClasses() {
    try {
      const { data, error } = await supabase.from('classes').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  async createClass(classData: any) {
    try {
      const { data, error } = await supabase.from('classes').insert(classData).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  // Facility methods
  async getFacilities() {
    try {
      const { data, error } = await supabase.from('facilities').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  }

  async createFacility(facility: any) {
    try {
      const { data, error } = await supabase.from('facilities').insert(facility).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  }

  // Teaching session methods
  async getTeachingSessions() {
    try {
      const { data, error } = await supabase.from('teaching_sessions').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teaching sessions:', error);
      throw error;
    }
  }

  // Enrollment methods
  async getEnrollments() {
    try {
      const { data, error } = await supabase.from('enrollments').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }

  // Generic getAll method for compatibility
  async getAll() {
    return this.getEmployees();
  }

  // Generic table access
  async getTableData(tableName: string) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
  }

  async createRecord(tableName: string, record: any) {
    try {
      const { data, error } = await supabase.from(tableName).insert(record).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Error creating ${tableName} record:`, error);
      throw error;
    }
  }

  async updateRecord(tableName: string, id: string, record: any) {
    try {
      const { data, error } = await supabase.from(tableName).update(record).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Error updating ${tableName} record:`, error);
      throw error;
    }
  }

  async deleteRecord(tableName: string, id: string) {
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${tableName} record:`, error);
      throw error;
    }
  }
}

export const databaseService = new SupabaseDatabaseService();
export const employeeService = databaseService;
export const facilityService = databaseService;
export const assetService = databaseService;
export const classService = databaseService;
export const studentService = databaseService;
export const teachingSessionService = databaseService;
export const enrollmentService = databaseService;
export const contactService = databaseService;
export const eventService = databaseService;
export const taskService = databaseService;
export const financeService = databaseService;
export const fileService = databaseService;
export const attendanceService = databaseService;
export const settingService = databaseService;
export const employeeClockInService = databaseService;
export const imageService = databaseService;
export const payrollService = databaseService;
export const requestService = databaseService;
export const evaluationService = databaseService;
export const assetTransferService = databaseService;
export const admissionService = databaseService;