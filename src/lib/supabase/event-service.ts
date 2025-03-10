
import { Event } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';

export const eventService = {
  async getAll() {
    return fetchAll<Event>('events');
  },
  
  async getById(id: string) {
    return fetchById<Event>('events', id);
  },
  
  async create(data: Partial<Event>) {
    try {
      const result = await insert<Event>('events', data);
      await logActivity('create', 'event', data.ten_su_kien || data.title || 'New event', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  async update(id: string, data: Partial<Event>) {
    try {
      const result = await update<Event>('events', id, data);
      await logActivity('update', 'event', data.ten_su_kien || data.title || 'Update event', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  
  async delete(id: string) {
    try {
      await remove('events', id);
      await logActivity('delete', 'event', 'Delete event', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  async getByEntity(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching events for ${entityType} ${entityId}:`, error);
      throw error;
    }
  },
  
  async getBetweenDates(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', startDate)
        .lte('end_date', endDate)
        .order('start_date');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching events between dates:', error);
      throw error;
    }
  },
};
