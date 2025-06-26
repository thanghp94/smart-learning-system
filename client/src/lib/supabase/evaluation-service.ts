
import { supabase } from './client';

export const evaluationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getByEntityId(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('evaluation_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async create(evaluation: any) {
    const { data, error } = await supabase
      .from('evaluations')
      .insert(evaluation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('evaluations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
