
import { supabase } from '../client';
import { insert, update, fetchById } from '../base-service';
import { ReceiptTemplate } from '@/lib/types';

// Extend the finance service with receipt template methods
export const receiptTemplateService = {
  async getReceiptTemplateById(id: string): Promise<ReceiptTemplate | null> {
    return fetchById<ReceiptTemplate>('receipt_templates', id);
  },
  
  async createReceiptTemplate(template: Partial<ReceiptTemplate>): Promise<ReceiptTemplate> {
    return insert<ReceiptTemplate>('receipt_templates', template);
  },
  
  async updateReceiptTemplate(id: string, template: Partial<ReceiptTemplate>): Promise<ReceiptTemplate> {
    return update<ReceiptTemplate>('receipt_templates', id, template);
  },
  
  async deleteReceiptTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('receipt_templates')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
