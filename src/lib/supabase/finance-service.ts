
import { supabase } from './client';
import { Finance } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class FinanceService {
  /**
   * Get all finances
   */
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

  /**
   * Get a finance by ID
   */
  async getById(id: string) {
    return fetchById<Finance>('finances', id);
  }

  /**
   * Create a new finance
   */
  async create(financeData: Partial<Finance>) {
    return insert<Finance>('finances', financeData);
  }

  /**
   * Update a finance
   */
  async update(id: string, updates: Partial<Finance>) {
    return update<Finance>('finances', id, updates);
  }

  /**
   * Delete a finance
   */
  async delete(id: string) {
    return remove('finances', id);
  }

  /**
   * Get finances by entity type and ID
   */
  async getByEntity(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .eq('doi_tuong_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error(`Error fetching finances for ${entityType} ${entityId}:`, error);
      throw error;
    }
  }

  /**
   * Get finances by entity type
   */
  async getFinancesByEntityType(entityType: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error(`Error fetching finances for entity type ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Get all finances with details
   */
  async getAllFinances() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error('Error fetching all finances:', error);
      throw error;
    }
  }

  // Receipt template methods
  async getReceiptTemplates() {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching receipt templates:', error);
      throw error;
    }
  }

  async getReceiptTemplateById(id: string) {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching receipt template ${id}:`, error);
      throw error;
    }
  }

  async createReceiptTemplate(template: any) {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .insert(template)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating receipt template:', error);
      throw error;
    }
  }

  async updateReceiptTemplate(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating receipt template ${id}:`, error);
      throw error;
    }
  }

  async deleteReceiptTemplate(id: string) {
    try {
      const { error } = await supabase
        .from('receipt_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting receipt template ${id}:`, error);
      throw error;
    }
  }
}

export const financeService = new FinanceService();
