import { Session } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    try {
      const sessions = await fetchAll<Session>('sessions');
      return sessions || [];
    } catch (error) {
      console.error("Error in getAll sessions:", error);
      return [];
    }
  },

  getById: (id: string) => fetchById<Session>('sessions', id),

  create: async (sessionData: Partial<Session>): Promise<Session | null> => {
    try {
      // Ensure required fields are present
      if (!sessionData.buoi_hoc_so || !sessionData.noi_dung_bai_hoc) {
        throw new Error("Missing required fields for session");
      }

      return await insert<Session>('sessions', sessionData);
    } catch (error) {
      console.error("Error in create session:", error);
      throw error;
    }
  },

  update: (id: string, updates: Partial<Session>) => update<Session>('sessions', id, updates),

  delete: (id: string) => remove('sessions', id),

  getByUnitId: async (unitId: string): Promise<Session[]> => {
    try {
      const response = await fetch(`/api/sessions?unitId=${unitId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions by unit ID');
      }
      return await response.json() as Session[];
    } catch (error) {
      console.error('Error fetching sessions by unit ID:', error);
      throw error;
    }
  },

  getByBuoiHocSo: async (buoiHocSo: string): Promise<Session | null> => {
    try {
      const response = await fetch(`/api/sessions?buoiHocSo=${buoiHocSo}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch session by buoi_hoc_so');
      }
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error in getByBuoiHocSo:', error);
      return null;
    }
  }
};