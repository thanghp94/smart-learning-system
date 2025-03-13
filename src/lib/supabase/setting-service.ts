
import { supabase } from './client';

export const settingService = {
  async getAll() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getByKey(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },
  
  async getEmailSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('hang_muc', 'email')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async save(setting: any) {
    // If setting has an ID, update it; otherwise, create a new one
    if (setting.id) {
      const { data, error } = await supabase
        .from('settings')
        .update(setting)
        .eq('id', setting.id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert(setting)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  async saveEmailSettings(emailSettings: any) {
    // First check if email settings already exist
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('hang_muc', 'email')
      .eq('tuy_chon', 'smtp')
      .maybeSingle();
    
    if (error) throw error;
    
    // Update or create the settings
    if (data?.id) {
      const { data: updatedData, error: updateError } = await supabase
        .from('settings')
        .update({
          mo_ta: JSON.stringify(emailSettings),
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .select()
        .maybeSingle();
      
      if (updateError) throw updateError;
      return updatedData;
    } else {
      const { data: newData, error: insertError } = await supabase
        .from('settings')
        .insert({
          hang_muc: 'email',
          tuy_chon: 'smtp',
          mo_ta: JSON.stringify(emailSettings),
          hien_thi: 'Email Configuration'
        })
        .select()
        .maybeSingle();
      
      if (insertError) throw insertError;
      return newData;
    }
  },
  
  async getEmailConfig() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('hang_muc', 'email')
      .eq('tuy_chon', 'smtp')
      .maybeSingle();
    
    if (error) throw error;
    
    if (data?.mo_ta) {
      try {
        return JSON.parse(data.mo_ta);
      } catch (e) {
        console.error('Error parsing email config:', e);
        return null;
      }
    }
    
    return null;
  }
};
