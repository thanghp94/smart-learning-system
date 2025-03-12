
import { supabase } from './client';
import { Position } from '@/lib/types/recruitment';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class PositionService {
  async getAll(): Promise<Position[]> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  async getActive(): Promise<Position[]> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active positions:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Position | null> {
    return fetchById('positions', id) as Promise<Position | null>;
  }

  async create(position: Omit<Position, 'id'>): Promise<Position | null> {
    return insert('positions', position) as Promise<Position | null>;
  }

  async update(id: string, position: Partial<Position>): Promise<Position | null> {
    return update('positions', id, position) as Promise<Position | null>;
  }

  async delete(id: string): Promise<void> {
    return remove('positions', id);
  }
}

export const positionService = new PositionService();
