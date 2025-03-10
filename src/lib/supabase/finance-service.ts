
import { Finance } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const financeService = {
  getAll: () => fetchAll<Finance>('finances'),
  getById: (id: string) => fetchById<Finance>('finances', id),
  create: (finance: Partial<Finance>) => insert<Finance>('finances', finance),
  update: (id: string, updates: Partial<Finance>) => update<Finance>('finances', id, updates),
  delete: (id: string) => remove('finances', id),
  
  // Get finances by type (income/expense)
  getByType: async (type: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('loai_thu_chi', type);
    
    if (error) {
      console.error(`Error fetching finances by type ${type}:`, error);
      throw error;
    }
    
    return data as Finance[];
  },
  
  // Get finances by facility
  getByFacility: async (facilityId: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('co_so', facilityId);
    
    if (error) {
      console.error('Error fetching finances by facility:', error);
      throw error;
    }
    
    return data as Finance[];
  },
  
  // Get finances by status
  getByStatus: async (status: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('tinh_trang', status);
    
    if (error) {
      console.error(`Error fetching finances by status ${status}:`, error);
      throw error;
    }
    
    return data as Finance[];
  },
  
  // Get finances for a date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .gte('ngay', startDate)
      .lte('ngay', endDate);
    
    if (error) {
      console.error('Error fetching finances by date range:', error);
      throw error;
    }
    
    return data as Finance[];
  },

  // Get finances by student
  getByStudent: async (studentId: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('doi_tuong_id', studentId)
      .eq('loai_doi_tuong', 'student');
    
    if (error) {
      console.error('Error fetching finances by student:', error);
      throw error;
    }
    
    return data as Finance[];
  },
  
  // Get finances by employee
  getByEmployee: async (employeeId: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('doi_tuong_id', employeeId)
      .eq('loai_doi_tuong', 'employee');
    
    if (error) {
      console.error('Error fetching finances by employee:', error);
      throw error;
    }
    
    return data as Finance[];
  },
  
  // Get finances by contact
  getByContact: async (contactId: string): Promise<Finance[]> => {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('doi_tuong_id', contactId)
      .eq('loai_doi_tuong', 'contact');
    
    if (error) {
      console.error('Error fetching finances by contact:', error);
      throw error;
    }
    
    return data as Finance[];
  }
};
