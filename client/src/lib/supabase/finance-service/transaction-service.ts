
import { supabase } from '../client';
import { Finance } from '@/lib/types';

export const transactionService = {
  async getTransactionTypes() {
    try {
      const { data, error } = await supabase
        .from('finance_transaction_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching transaction types:`, error);
      return [];
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching all finances:', error);
      return [];
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting finance with ID ${id}:`, error);
      throw error;
    }
  },

  async getByEntity(entityType: string, entityId: string) {
    try {
      console.log(`Fetching finances for entity type: ${entityType}, ID: ${entityId}`);
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .eq('doi_tuong_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log(`Found ${data.length} finance records`);
      return data as Finance[];
    } catch (error) {
      console.error(`Error fetching finances for entity ${entityType} with ID ${entityId}:`, error);
      throw error;
    }
  },

  async getByEmployee(employeeId: string) {
    return this.getByEntity('employee', employeeId);
  },

  async getByStudent(studentId: string) {
    return this.getByEntity('student', studentId);
  },

  async getByFacility(facilityId: string) {
    return this.getByEntity('facility', facilityId);
  },

  async getByAsset(assetId: string) {
    return this.getByEntity('asset', assetId);
  },

  async getByClass(classId: string) {
    return this.getByEntity('class', classId);
  },
  
  async getByEnrollment(enrollmentId: string) {
    return this.getByEntity('enrollment', enrollmentId);
  }
};
