
import { supabase } from './client';
import { Position } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class PositionService {
  tableName = 'positions';

  async getAll(): Promise<Position[]> {
    return fetchAll<Position>(this.tableName);
  }

  async getById(id: string): Promise<Position | null> {
    return fetchById<Position>(this.tableName, id);
  }

  async create(position: Partial<Position>): Promise<Position> {
    return insert<Position>(this.tableName, position);
  }

  async update(id: string, updates: Partial<Position>): Promise<Position> {
    return update<Position>(this.tableName, id, updates);
  }

  async delete(id: string): Promise<void> {
    return remove(this.tableName, id);
  }

  async getAllActive(): Promise<Position[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching active positions:', error);
      throw error;
    }
    
    return data || [];
  }
}

export const positionService = new PositionService();
