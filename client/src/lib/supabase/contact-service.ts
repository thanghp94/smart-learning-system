
import { Contact } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const contactService = {
  getAll: () => fetchAll<Contact>('contacts'),
  getById: (id: string) => fetchById<Contact>('contacts', id),
  create: (contact: Partial<Contact>) => insert<Contact>('contacts', contact),
  update: (id: string, updates: Partial<Contact>) => update<Contact>('contacts', id, updates),
  delete: (id: string) => remove('contacts', id),
  
  // Get contacts by type
  getByType: async (type: string): Promise<Contact[]> => {
    try {
      const response = await fetch(`/api/contacts?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts by type');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching contacts by type:', error);
      throw error;
    }
  },
  
  // Get contacts by entity
  getByEntity: async (entityType: string, entityId: string): Promise<Contact[]> => {
    try {
      const response = await fetch(`/api/contacts?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts by entity');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching contacts for ${entityType} ${entityId}:`, error);
      throw error;
    }
  },
  
  // Get active contacts
  getActive: async (): Promise<Contact[]> => {
    try {
      const response = await fetch('/api/contacts?status=active');
      if (!response.ok) {
        throw new Error('Failed to fetch active contacts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active contacts:', error);
      throw error;
    }
  }
};
