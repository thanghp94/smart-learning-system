import { Facility } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const facilityService = {
  async getAll() {
    try {
      console.log('Fetching all records from facilities...');
      const facilities = await fetchAll<Facility>('facilities');
      console.log(`Successfully fetched ${facilities.length} facilities`);
      console.log('Fetched facilities:', facilities.length);
      return facilities;
    } catch (error) {
      console.error('Error in fetchAll for facilities:', error);
      console.error('Error details:', { message: error.message });
      throw error;
    }
  },

  async getById(id: string) {
    return fetchById<Facility>('facilities', id);
  },

  async create(facility: Partial<Facility>) {
    return insert<Facility>('facilities', facility);
  },

  async update(id: string, updates: Partial<Facility>) {
    return update<Facility>('facilities', id, updates);
  },

  async delete(id: string) {
    return remove('facilities', id);
  },

  // Additional methods for facility-specific operations
  async getByType(type: string): Promise<Facility[]> {
    try {
      const response = await fetch(`/api/facilities?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch facilities by type');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching facilities by type:', error);
      throw error;
    }
  },

  async getActive(): Promise<Facility[]> {
    try {
      const response = await fetch('/api/facilities?status=active');
      if (!response.ok) {
        throw new Error('Failed to fetch active facilities');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active facilities:', error);
      throw error;
    }
  },
};