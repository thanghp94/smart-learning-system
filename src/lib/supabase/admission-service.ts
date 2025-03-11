
import { supabase } from './client';
import { Admission } from '../types/admission';

export const admissionService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Admission[];
  },
  getAdmissionById: async (id: string) => {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Admission;
  },
  createAdmission: async (admission: Partial<Admission>) => {
    const { data, error } = await supabase
      .from('admissions')
      .insert(admission)
      .select()
      .single();
    
    if (error) throw error;
    return data as Admission;
  },
  updateAdmission: async (id: string, updates: Partial<Admission>) => {
    const { data, error } = await supabase
      .from('admissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Admission;
  },
  deleteAdmission: async (id: string) => {
    const { error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  updateAdmissionStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('admissions')
      .update({ trang_thai: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Admission;
  },
};
