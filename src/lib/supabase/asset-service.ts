
import { Asset } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const assetService = {
  getAll: () => fetchAll<Asset>('assets'),
  getById: (id: string) => fetchById<Asset>('assets', id),
  create: (asset: Partial<Asset>) => insert<Asset>('assets', asset),
  update: (id: string, updates: Partial<Asset>) => update<Asset>('assets', id, updates),
  delete: (id: string) => remove('assets', id),
  getByOwner: async (ownerType: string, ownerId: string): Promise<Asset[]> => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('doi_tuong', ownerType)
      .eq('doi_tuong_id', ownerId);
    
    if (error) {
      console.error('Error fetching assets by owner:', error);
      throw error;
    }
    
    return data as Asset[];
  }
};
