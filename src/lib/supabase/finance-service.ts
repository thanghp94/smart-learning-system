
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { Finance } from '@/lib/types';

class FinanceService {
  async getAll() {
    return fetchAll<Finance>('finances');
  }
  
  async getById(id: string) {
    return fetchById<Finance>('finances', id);
  }
  
  async create(data: Partial<Finance>) {
    try {
      const result = await insert<Finance>('finances', data);
      await logActivity('create', 'finance', data.ten_phi || 'Giao dịch mới', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating finance record:', error);
      throw error;
    }
  }
  
  async update(id: string, data: Partial<Finance>) {
    try {
      const result = await update<Finance>('finances', id, data);
      await logActivity('update', 'finance', data.ten_phi || 'Cập nhật giao dịch', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating finance record:', error);
      throw error;
    }
  }
  
  async delete(id: string) {
    try {
      await remove('finances', id);
      await logActivity('delete', 'finance', 'Xóa giao dịch', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting finance record:', error);
      throw error;
    }
  }

  async getByEntity(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .eq('doi_tuong_id', entityId)
        .order('ngay', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching finances for ${entityType} ${entityId}:`, error);
      throw error;
    }
  }
  
  async getByEmployee(employeeId: string) {
    return this.getByEntity('employee', employeeId);
  }
  
  async getByStudent(studentId: string) {
    return this.getByEntity('student', studentId);
  }
  
  async getByFacility(facilityId: string) {
    return this.getByEntity('facility', facilityId);
  }

  async getTransactionTypes() {
    try {
      const { data, error } = await supabase
        .from('finance_transaction_types')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transaction types:', error);
      throw error;
    }
  }
}

export const financeService = new FinanceService();
