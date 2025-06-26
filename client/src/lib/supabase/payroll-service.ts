
import { supabase } from './client';

export const payrollService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getByEmployee(employeeId: string) {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('nhan_su_id', employeeId)
      .order('nam', { ascending: false })
      .order('thang', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async create(payroll: any) {
    // Remove any fields that would cause database constraints issues
    const { phu_cap, ...payrollData } = payroll;
    
    const { data, error } = await supabase
      .from('payrolls')
      .insert(payrollData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: any) {
    // Remove any fields that would cause database constraints issues
    const { phu_cap, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from('payrolls')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('payrolls')
      .update({ trang_thai: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('payrolls')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
