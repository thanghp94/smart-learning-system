
import { supabase } from './client';
import { Event } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const eventService = {
  getAll: () => fetchAll<Event>('events'),
  getById: (id: string) => fetchById<Event>('events', id),
  create: (event: Partial<Event>) => insert<Event>('events', event),
  update: (id: string, updates: Partial<Event>) => update<Event>('events', id, updates),
  delete: (id: string) => remove('events', id),
  
  // Get events by type
  getByType: async (eventType: string): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('loai_su_kien', eventType);
    
    if (error) {
      console.error(`Error fetching events by type ${eventType}:`, error);
      throw error;
    }
    
    return data as Event[];
  },
  
  // Get events by entity
  getByEntity: async (entityType: string, entityId: string): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('doi_tuong_id', entityId)
      .order('ngay_bat_dau', { ascending: false });
    
    if (error) {
      console.error(`Error fetching events for ${entityType} ${entityId}:`, error);
      throw error;
    }
    
    return data as Event[];
  },
  
  // Get upcoming events
  getUpcoming: async (): Promise<Event[]> => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('ngay_bat_dau', today)
      .order('ngay_bat_dau', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
    
    return data as Event[];
  },
  
  // Get events by status
  getByStatus: async (status: string): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) {
      console.error(`Error fetching events by status ${status}:`, error);
      throw error;
    }
    
    return data as Event[];
  }
};
