import { Admission } from '../types/admission';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const admissionService = {
  getAll: async () => {
    try {
      const admissions = await fetchAll<Admission>('admissions');
      console.log('Filtered admissions count:', admissions.length);
      return admissions;
    } catch (error) {
      console.error('Error fetching admissions:', error);
      throw error;
    }
  },

  getAdmissionById: async (id: string) => {
    return fetchById<Admission>('admissions', id);
  },

  createAdmission: async (admission: Partial<Admission>) => {
    return insert<Admission>('admissions', admission);
  },

  updateAdmission: async (id: string, updates: Partial<Admission>) => {
    return update<Admission>('admissions', id, updates);
  },

  deleteAdmission: async (id: string) => {
    return remove('admissions', id);
  },

  updateAdmissionStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trang_thai: status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update admission status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating admission status:', error);
      throw error;
    }
  },
};