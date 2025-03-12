
import { Position } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class PositionService {
  async getAll(): Promise<Position[]> {
    return fetchAll('positions') as Promise<Position[]>;
  }

  async getById(id: string): Promise<Position> {
    return fetchById('positions', id) as Promise<Position>;
  }

  async create(position: Partial<Position>): Promise<Position> {
    return insert('positions', position) as Promise<Position>;
  }

  async update(id: string, data: Partial<Position>): Promise<Position> {
    return update('positions', id, data) as Promise<Position>;
  }

  async delete(id: string): Promise<void> {
    return remove('positions', id);
  }
  
  async getActive(): Promise<Position[]> {
    return fetchAll('positions', { is_active: true }) as Promise<Position[]>;
  }
}

export const positionService = new PositionService();
