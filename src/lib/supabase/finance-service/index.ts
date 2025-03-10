
import { financeService as baseFinanceService } from '../finance-service';
import { receiptTemplateService } from './receipt-template-service';

// Additional methods to extend financeService
const extendedFinanceService = {
  async getReceiptTemplates(type: string) {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .or(`type.eq.${type},type.eq.all`);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching receipt templates for type ${type}:`, error);
      return [];
    }
  },
  
  async getReceiptsByFinanceId(financeId: string) {
    try {
      const { data, error } = await supabase
        .from('generated_receipts')
        .select('*')
        .eq('finance_id', financeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching receipts for finance ID ${financeId}:`, error);
      return [];
    }
  },
  
  async generateReceipt(financeId: string, templateId: string) {
    try {
      // In a real app this would generate the receipt HTML based on the template and finance data
      const dummyReceipt = {
        finance_id: financeId,
        template_id: templateId,
        generated_html: `<div style="padding: 20px; border: 1px solid #ccc;">
          <h2>Receipt</h2>
          <p>This is a generated receipt for finance ID: ${financeId}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>`,
        generated_at: new Date().toISOString(),
        status: 'draft'
      };
      
      const { data, error } = await supabase
        .from('generated_receipts')
        .insert(dummyReceipt)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error generating receipt:`, error);
      throw error;
    }
  },
  
  async markReceiptAsPrinted(receiptId: string) {
    try {
      const { data, error } = await supabase
        .from('generated_receipts')
        .update({ printed_at: new Date().toISOString() })
        .eq('id', receiptId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error marking receipt as printed:`, error);
      throw error;
    }
  },
  
  async finalizeReceipt(receiptId: string) {
    try {
      const { data, error } = await supabase
        .from('generated_receipts')
        .update({ status: 'final' })
        .eq('id', receiptId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error finalizing receipt:`, error);
      throw error;
    }
  },
  
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
  }
};

// Import supabase for extended methods
import { supabase } from '../client';

// Create a combined finance service with receipt template methods and base methods
export const financeService = {
  ...baseFinanceService,
  ...receiptTemplateService,
  ...extendedFinanceService
};

export default financeService;
