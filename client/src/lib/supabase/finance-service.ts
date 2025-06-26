import { Finance } from '../types';
import { fetchAll, fetchById, remove } from './base-service';

type FinanceFilter = {
  loai_thu_chi?: string;
  loai_doi_tuong?: string;
  ngay_start?: string;
  ngay_end?: string;
  co_so?: string;
};

// Main finance service
export const financeService = {
  // Transaction types
  getTransactionTypes: async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/finance-transaction-types');
      if (!response.ok) {
        throw new Error('Failed to fetch transaction types');
      }
      return await response.json() || [];
    } catch (error) {
      console.error('Error fetching transaction types:', error);
      throw error;
    }
  },

  // Basic CRUD operations
  getAll: async (): Promise<Finance[]> => {
    return fetchAll<Finance>('finances');
  },

  getById: async (id: string): Promise<Finance | null> => {
    return fetchById<Finance>('finances', id);
  },

  delete: async (id: string): Promise<void> => {
    return remove('finances', id);
  },

  create: async (finance: Partial<Finance>): Promise<Finance> => {
    try {
      console.log('Creating finance record with data:', finance);

      if (!finance.loai_thu_chi) {
        throw new Error('Loại thu chi là bắt buộc');
      }

      if (!finance.tong_tien && finance.tong_tien !== 0) {
        throw new Error('Tổng tiền là bắt buộc');
      }

      // Clean up any empty string IDs
      if (finance.nguoi_tao === '') finance.nguoi_tao = null;
      if (finance.co_so === '') finance.co_so = null;
      if (finance.doi_tuong_id === '') finance.doi_tuong_id = null;

      const response = await fetch('/api/finances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finance),
      });

      if (!response.ok) {
        throw new Error('Failed to create finance record');
      }
      const data = await response.json();
      console.log('Successfully created finance record:', data);
      return data;
    } catch (error) {
      console.error('Error creating finance record:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Finance>): Promise<Finance> => {
    try {
      // Clean up any empty string IDs
      if (updates.nguoi_tao === '') updates.nguoi_tao = null;
      if (updates.co_so === '') updates.co_so = null;
      if (updates.doi_tuong_id === '') updates.doi_tuong_id = null;

      const response = await fetch(`/api/finances/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update finance record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating finance record:', error);
      throw error;
    }
  },

  // Entity-related queries
  getByEntity: async (entityType: string, entityId: string): Promise<Finance[]> => {
    try {
      const response = await fetch(`/api/finances?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch finances by entity');
      }
      return await response.json() || [];
    } catch (error) {
      console.error('Error fetching finances by entity:', error);
      throw error;
    }
  },

  // Filter operations
  getFiltered: async (filters: FinanceFilter): Promise<Finance[]> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/finances?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered finances');
      }
      return await response.json() || [];
    } catch (error) {
      console.error('Error fetching filtered finances:', error);
      throw error;
    }
  },

  // Receipt-related operations
  getReceipts: async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/finance-receipts');
      if (!response.ok) {
        throw new Error('Failed to fetch finance receipts');
      }
      return await response.json() || [];
    } catch (error) {
      console.error('Error fetching finance receipts:', error);
      throw error;
    }
  },

  getReceiptById: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/finance-receipts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance receipt');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance receipt:', error);
      throw error;
    }
  },

  createReceipt: async (receipt: any): Promise<any> => {
    try {
      const response = await fetch('/api/finance-receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receipt),
      });

      if (!response.ok) {
        throw new Error('Failed to create finance receipt');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating finance receipt:', error);
      throw error;
    }
  },

  updateReceipt: async (id: string, updates: any): Promise<any> => {
    try {
      const response = await fetch(`/api/finance-receipts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update finance receipt');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating finance receipt:', error);
      throw error;
    }
  },

  deleteReceipt: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/finance-receipts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete finance receipt');
      }
    } catch (error) {
      console.error('Error deleting finance receipt:', error);
      throw error;
    }
  },

  // Receipt template operations
  getReceiptTemplates: async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/finance-receipt-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch finance receipt templates');
      }
      return await response.json() || [];
    } catch (error) {
      console.error('Error fetching finance receipt templates:', error);
      throw error;
    }
  },

  getReceiptTemplateById: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/finance-receipt-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance receipt template');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance receipt template:', error);
      throw error;
    }
  },

  createReceiptTemplate: async (template: any): Promise<any> => {
    try {
      const response = await fetch('/api/finance-receipt-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error('Failed to create finance receipt template');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating finance receipt template:', error);
      throw error;
    }
  },

  updateReceiptTemplate: async (id: string, updates: any): Promise<any> => {
    try {
      const response = await fetch(`/api/finance-receipt-templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update finance receipt template');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating finance receipt template:', error);
      throw error;
    }
  },

  deleteReceiptTemplate: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/finance-receipt-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete finance receipt template');
      }
    } catch (error) {
      console.error('Error deleting finance receipt template:', error);
      throw error;
    }
  }
};