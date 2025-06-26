
import { Facility } from '@/lib/types';

class FacilityService {
  private apiUrl = '/api';

  async getAll(): Promise<Facility[]> {
    console.log('Fetching all records from facilities...');
    try {
      const response = await fetch(`${this.apiUrl}/facilities`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data?.length || 0} facilities`);
      return data || [];
    } catch (error) {
      console.error('Error in fetchAll for facilities:', error);
      console.error('Error details:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Facility | null> {
    try {
      const response = await fetch(`${this.apiUrl}/facilities/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getById for facility:', error);
      throw error;
    }
  }

  async create(facilityData: Omit<Facility, 'id'> & { id?: string }): Promise<Facility | null> {
    try {
      const response = await fetch(`${this.apiUrl}/facilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in create for facility:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Facility>): Promise<Facility | null> {
    try {
      const response = await fetch(`${this.apiUrl}/facilities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in update for facility:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/facilities/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Facility not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in delete for facility:', error);
      throw error;
    }
  }
}

export const facilityService = new FacilityService();
