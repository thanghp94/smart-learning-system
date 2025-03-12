
import { supabase } from './client';
import { Employee } from '../types';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return data || [];
  },

  getById: async (id: string): Promise<Employee> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }

    return data;
  },
  
  getByEmail: async (email: string): Promise<Employee | null> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error fetching employee by email:', error);
      throw error;
    }

    return data;
  },

  create: async (employee: Partial<Employee>): Promise<Employee> => {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      throw error;
    }

    return data;
  },

  update: async (id: string, updates: Partial<Employee>): Promise<Employee> => {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      throw error;
    }

    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  getByRole: async (role: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('bo_phan', role)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees by role:', error);
      throw error;
    }

    return data || [];
  },

  getActive: async (): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('tinh_trang_lao_dong', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active employees:', error);
      throw error;
    }

    return data || [];
  }
};

export default employeeService;
