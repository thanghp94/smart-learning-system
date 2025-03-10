
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Event } from '@/lib/types';

class EventService {
  async getAll() {
    return fetchAll<Event>('events');
  }
  
  async getById(id: string) {
    return fetchById<Event>('events', id);
  }
  
  async create(event: Partial<Event>) {
    return insert<Event>('events', event);
  }
  
  async update(id: string, event: Partial<Event>) {
    return update<Event>('events', id, event);
  }
  
  async delete(id: string) {
    return remove('events', id);
  }
  
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('trang_thai', status)
      .order('ngay_bat_dau', { ascending: false });
    
    if (error) throw error;
    return data as Event[];
  }
  
  async getByEntity(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('doi_tuong', entityType)
      .eq('doi_tuong_id', entityId)
      .order('ngay_bat_dau', { ascending: false });
    
    if (error) throw error;
    return data as Event[];
  }
}

export const eventService = new EventService();
