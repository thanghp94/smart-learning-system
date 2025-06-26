
import { Event } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';

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
      const response = await fetch(`/api/events?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events by entity');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching events for ${entityType} ${entityId}:`, error);
      throw error;
    }
  },
  
  async getBetweenDates(startDate: string, endDate: string) {
    try {
      const response = await fetch(`/api/events?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events between dates');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events between dates:', error);
      throw error;
    }
  },
};
