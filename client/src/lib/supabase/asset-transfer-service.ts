
import { supabase } from './client';

export const assetTransferService = {
  async getAll() {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .order('transfer_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(assetTransfer: any) {
    const { data, error } = await supabase
      .from('asset_transfers')
      .insert(assetTransfer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async approveTransfer(id: string) {
    const { error } = await supabase
      .from('asset_transfers')
      .update({ status: 'completed' })
      .eq('id', id);
    
    if (error) throw error;
  },
  
  async rejectTransfer(id: string, reason: string) {
    const { error } = await supabase
      .from('asset_transfers')
      .update({ 
        status: 'rejected',
        notes: reason 
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};
