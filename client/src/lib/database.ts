import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly to avoid circular dependency
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Only create Supabase client if configured
const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Unified database service that works with both Supabase and PostgreSQL API
class DatabaseService {
  private useSupabase: boolean;

  constructor() {
    this.useSupabase = isSupabaseConfigured();
    console.log(this.useSupabase ? 'Using Supabase database' : 'Using PostgreSQL database instead of Supabase');
  }

  async getEmployees() {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      return data;
    } else {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json();
    }
  }

  async getAll() {
    return this.getEmployees();
  }

  async create(employee: any) {
    return this.createEmployee(employee);
  }

  async update(id: string, employee: any) {
    return this.updateEmployee(id, employee);
  }

  async createEmployee(employee: any) {
    if (this.useSupabase && supabase) {
      const { data, error } = await supabase.from('employees').insert(employee).select();
      if (error) throw error;
      return data[0];
    } else {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (!response.ok) throw new Error('Failed to create employee');
      return response.json();
    }
  }

  async updateEmployee(id: string, employee: any) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('employees').update(employee).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } else {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (!response.ok) throw new Error('Failed to update employee');
      return response.json();
    }
  }

  async deleteEmployee(id: string) {
    if (this.useSupabase) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete employee');
      return true;
    }
  }

  async getFacilities() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('facilities').select('*');
      if (error) throw error;
      return data;
    } else {
      const response = await fetch('/api/facilities');
      if (!response.ok) throw new Error('Failed to fetch facilities');
      return response.json();
    }
  }
}

export const databaseService = new DatabaseService();
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