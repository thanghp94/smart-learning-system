
import { supabase } from './client';
import { Position } from '@/lib/types';
import { BaseService } from './base-service';

class PositionService extends BaseService<Position> {
  constructor() {
    super('positions');
  }

  async getAllActive(): Promise<Position[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching active positions:', error);
      throw error;
    }

    return data || [];
  }

  async getByDepartment(department: string): Promise<Position[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('department', department)
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching positions by department:', error);
      throw error;
    }

    return data || [];
  }
}

export const positionService = new PositionService();
