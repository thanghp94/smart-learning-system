
import { Contact } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const contactService = {
  getAll: () => fetchAll<Contact>('contacts'),
  getById: (id: string) => fetchById<Contact>('contacts', id),
  create: (contact: Partial<Contact>) => insert<Contact>('contacts', contact),
  update: (id: string, updates: Partial<Contact>) => update<Contact>('contacts', id, updates),
  delete: (id: string) => remove('contacts', id),
  
  // Get contacts by type
  getByType: async (type: string): Promise<Contact[]> => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('phan_loai', type);
    
    if (error) {
      console.error('Error fetching contacts by type:', error);
      throw error;
    }
    
    return data as Contact[];
  },
  
  // Get active contacts
  getActive: async (): Promise<Contact[]> => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('trang_thai', 'active');
    
    if (error) {
      console.error('Error fetching active contacts:', error);
      throw error;
    }
    
    return data as Contact[];
  }
};
