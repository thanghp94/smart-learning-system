
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
  
  async update(id: string, updates: Partial<Event>) {
    return update<Event>('events', id, updates);
  }
  
  async delete(id: string) {
    return remove('events', id);
  }
  
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) throw error;
    return data as Event[];
  }
  
  // Add the getByEntity method
  async getByEntity(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    if (error) throw error;
    return data as Event[];
  }
}

export const eventService = new EventService();
