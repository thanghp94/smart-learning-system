
import { supabase } from './client';

export const requestService = {
  async getAll() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(request: any) {
    const { data, error } = await supabase
      .from('requests')
      .insert(request)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateStatus(id: string, status: string, processedDate: string) {
    const { data, error } = await supabase
      .from('requests')
      .update({ 
        trang_thai: status,
        processed_date: processedDate 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
