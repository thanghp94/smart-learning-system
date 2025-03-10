import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { Finance, FinanceTransactionType, ReceiptTemplate, GeneratedReceipt } from '@/lib/types';
import { storageService } from './storage-service';

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

  async getReceiptTemplates(type?: 'income' | 'expense' | 'all') {
    try {
      let query = supabase
        .from('receipt_templates')
        .select('*');
      
      if (type) {
        query = query.eq('type', type).or(`type.eq.all`);
      }
      
      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) throw error;
      return data as ReceiptTemplate[];
    } catch (error) {
      console.error('Error fetching receipt templates:', error);
      throw error;
    }
  }

  async getDefaultReceiptTemplate(type: 'income' | 'expense') {
    try {
      const { data, error } = await supabase
        .from('receipt_templates')
        .select('*')
        .or(`type.eq.${type},type.eq.all`)
        .eq('is_default', true)
        .limit(1);
      
      if (error) throw error;
      return data.length > 0 ? data[0] as ReceiptTemplate : null;
    } catch (error) {
      console.error(`Error fetching default receipt template for ${type}:`, error);
      throw error;
    }
  }

  async generateReceipt(financeId: string, templateId?: string) {
    try {
      const finance = await this.getById(financeId);
      if (!finance) {
        throw new Error('Finance transaction not found');
      }

      let template: ReceiptTemplate | null = null;
      if (templateId) {
        template = await fetchById<ReceiptTemplate>('receipt_templates', templateId);
      } else {
        template = await this.getDefaultReceiptTemplate(finance.loai_thu_chi as 'income' | 'expense');
      }

      if (!template) {
        throw new Error('Receipt template not found');
      }

      const generatedHtml = this.mergeTemplateWithData(template.template_html, finance);

      const receipt: Partial<GeneratedReceipt> = {
        finance_id: financeId,
        template_id: template.id,
        generated_html: generatedHtml,
        generated_at: new Date().toISOString(),
        status: 'draft' as 'draft' | 'final'
      };

      const result = await insert<GeneratedReceipt>('generated_receipts', receipt);

      await logActivity('create', 'receipt', `Tạo biên lai cho giao dịch ${finance.ten_phi || finance.id}`, 'system', 'completed');

      return result;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }

  async getGeneratedReceipt(receiptId: string) {
    return fetchById<GeneratedReceipt>('generated_receipts', receiptId);
  }

  async getReceiptsByFinanceId(financeId: string) {
    try {
      const { data, error } = await supabase
        .from('generated_receipts')
        .select('*')
        .eq('finance_id', financeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GeneratedReceipt[];
    } catch (error) {
      console.error(`Error fetching receipts for finance ${financeId}:`, error);
      throw error;
    }
  }

  async finalizeReceipt(receiptId: string) {
    try {
      const result = await update<GeneratedReceipt>('generated_receipts', receiptId, {
        status: 'final' as 'draft' | 'final',
        updated_at: new Date().toISOString()
      });
      
      await logActivity('update', 'receipt', `Hoàn tất biên lai ${receiptId}`, 'system', 'completed');
      
      return result;
    } catch (error) {
      console.error('Error finalizing receipt:', error);
      throw error;
    }
  }

  async markReceiptAsPrinted(receiptId: string) {
    try {
      const result = await update<GeneratedReceipt>('generated_receipts', receiptId, {
        printed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      await logActivity('update', 'receipt', `In biên lai ${receiptId}`, 'system', 'completed');
      
      return result;
    } catch (error) {
      console.error('Error marking receipt as printed:', error);
      throw error;
    }
  }

  private mergeTemplateWithData(template: string, finance: Finance): string {
    let result = template;

    const formattedDate = finance.ngay 
      ? new Date(finance.ngay).toLocaleDateString('vi-VN', {
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric'
        })
      : '';

    const formattedMoney = new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(finance.tong_tien);

    const replacements: Record<string, string> = {
      '{{id}}': finance.id || '',
      '{{ngay}}': formattedDate,
      '{{ten_phi}}': finance.ten_phi || '',
      '{{dien_giai}}': finance.dien_giai || '',
      '{{loai_giao_dich}}': finance.loai_giao_dich || '',
      '{{so_luong}}': finance.so_luong?.toString() || '',
      '{{don_vi}}': finance.don_vi?.toString() || '',
      '{{gia_tien}}': finance.gia_tien ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.gia_tien) : '',
      '{{tong_tien}}': formattedMoney,
      '{{bang_chu}}': finance.bang_chu || '',
      '{{kieu_thanh_toan}}': finance.kieu_thanh_toan || '',
      '{{ghi_chu}}': finance.ghi_chu || '',
      '{{tg_tao}}': finance.tg_tao || '',
      '{{nguoi_tao}}': finance.nguoi_tao || '',
      '{{current_date}}': new Date().toLocaleDateString('vi-VN'),
      '{{receipt_type}}': finance.loai_thu_chi === 'income' ? 'PHIẾU THU' : 'PHIẾU CHI'
    };

    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }

    return result;
  }

  async exportReceiptToPdf(receiptId: string) {
    try {
      const receipt = await this.getGeneratedReceipt(receiptId);
      if (!receipt) {
        throw new Error('Receipt not found');
      }
      
      await this.markReceiptAsPrinted(receiptId);
      
      return receipt;
    } catch (error) {
      console.error('Error exporting receipt to PDF:', error);
      throw error;
    }
  }
}

export const financeService = new FinanceService();
