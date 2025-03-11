
import { Finance, FinanceReceipt, FinanceReceiptTemplate } from '../types';
import { fetchAll, fetchById, remove } from './base-service';
import { supabase } from './client';

type FinanceFilter = {
  loai_thu_chi?: string;
  loai_doi_tuong?: string;
  ngay_start?: string;
  ngay_end?: string;
  co_so?: string;
};

export const financeService = {
  getTransactionTypes: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('finance_transaction_types')
        .select('*')
        .order('category');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction types:', error);
      throw error;
    }
  },
  
  getAll: async (): Promise<Finance[]> => {
    return fetchAll<Finance>('finances');
  },
  
  delete: async (id: string): Promise<void> => {
    return remove('finances', id);
  },
  
  getByEntity: async (entityType: string, entityId: string): Promise<Finance[]> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', entityType)
        .eq('doi_tuong_id', entityId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching finances by entity:', error);
      throw error;
    }
  },
  
  getFiltered: async (filters: FinanceFilter): Promise<Finance[]> => {
    try {
      let query = supabase
        .from('finances')
        .select('*');
      
      if (filters.loai_thu_chi) {
        query = query.eq('loai_thu_chi', filters.loai_thu_chi);
      }
      
      if (filters.loai_doi_tuong) {
        query = query.eq('loai_doi_tuong', filters.loai_doi_tuong);
      }
      
      if (filters.co_so) {
        query = query.eq('co_so', filters.co_so);
      }
      
      if (filters.ngay_start && filters.ngay_end) {
        query = query
          .gte('ngay', filters.ngay_start)
          .lte('ngay', filters.ngay_end);
      } else if (filters.ngay_start) {
        query = query.gte('ngay', filters.ngay_start);
      } else if (filters.ngay_end) {
        query = query.lte('ngay', filters.ngay_end);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching filtered finances:', error);
      throw error;
    }
  },
  
  getReceipts: async (): Promise<FinanceReceipt[]> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipts')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching finance receipts:', error);
      throw error;
    }
  },
  
  getReceiptById: async (id: string): Promise<FinanceReceipt> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching finance receipt:', error);
      throw error;
    }
  },
  
  createReceipt: async (receipt: Partial<FinanceReceipt>): Promise<FinanceReceipt> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipts')
        .insert(receipt)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating finance receipt:', error);
      throw error;
    }
  },
  
  updateReceipt: async (id: string, updates: Partial<FinanceReceipt>): Promise<FinanceReceipt> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating finance receipt:', error);
      throw error;
    }
  },
  
  deleteReceipt: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('finance_receipts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting finance receipt:', error);
      throw error;
    }
  },
  
  getReceiptTemplates: async (): Promise<FinanceReceiptTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipt_templates')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching finance receipt templates:', error);
      throw error;
    }
  },
  
  getReceiptTemplateById: async (id: string): Promise<FinanceReceiptTemplate> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipt_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching finance receipt template:', error);
      throw error;
    }
  },
  
  createReceiptTemplate: async (template: Partial<FinanceReceiptTemplate>): Promise<FinanceReceiptTemplate> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipt_templates')
        .insert(template)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating finance receipt template:', error);
      throw error;
    }
  },
  
  updateReceiptTemplate: async (id: string, updates: Partial<FinanceReceiptTemplate>): Promise<FinanceReceiptTemplate> => {
    try {
      const { data, error } = await supabase
        .from('finance_receipt_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating finance receipt template:', error);
      throw error;
    }
  },
  
  deleteReceiptTemplate: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('finance_receipt_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting finance receipt template:', error);
      throw error;
    }
  },
  
  // Add missing methods
  create: async (finance: Partial<Finance>): Promise<Finance> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .insert(finance)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating finance record:', error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Finance>): Promise<Finance> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating finance record:', error);
      throw error;
    }
  }
};
