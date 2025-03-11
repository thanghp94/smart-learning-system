
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Finance } from '@/lib/types';

class FinanceService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching finances:', error);
      throw error;
    }
  }

  async getById(id: string) {
    return fetchById<Finance>('finances', id);
  }

  async create(data: Partial<Finance>) {
    return insert<Finance>('finances', data);
  }

  async update(id: string, data: Partial<Finance>) {
    return update<Finance>('finances', id, data);
  }

  async delete(id: string) {
    return remove('finances', id);
  }

  async getByEmployee(employeeId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('doi_tuong_id', employeeId)
        .eq('loai_doi_tuong', 'employee')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching employee finances:', error);
      throw error;
    }
  }

  async getByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('doi_tuong_id', studentId)
        .eq('loai_doi_tuong', 'student')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching student finances:', error);
      throw error;
    }
  }

  async getByFacility(facilityId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('doi_tuong_id', facilityId)
        .eq('loai_doi_tuong', 'facility')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching facility finances:', error);
      throw error;
    }
  }

  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('doi_tuong_id', classId)
        .eq('loai_doi_tuong', 'class')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching class finances:', error);
      throw error;
    }
  }

  // Add the getFinancesByEntityType method
  async getFinancesByEntityType(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .eq('doi_tuong_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching finances for ${entityType} with ID ${entityId}:`, error);
      return { data: null, error };
    }
  }

  // Add the getAllFinances method
  async getAllFinances() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching all finances:', error);
      return { data: null, error };
    }
  }
}

export const financeService = new FinanceService();
