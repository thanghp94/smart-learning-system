
import { supabase } from '../client';

export const receiptService = {
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
  }
};
