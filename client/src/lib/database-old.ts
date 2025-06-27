import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper configuration
const supabaseUrl = 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Unified database service for Supabase exclusively
class DatabaseService {
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