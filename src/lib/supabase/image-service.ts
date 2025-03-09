
import { Image } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const imageService = {
  getAll: () => fetchAll<Image>('images'),
  getById: (id: string) => fetchById<Image>('images', id),
  create: (image: Partial<Image>) => insert<Image>('images', image),
  update: (id: string, updates: Partial<Image>) => update<Image>('images', id, updates),
  delete: (id: string) => remove('images', id),
  
  // Get images by entity
  getByEntity: async (entityType: string, entityId: string): Promise<Image[]> => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('doi_tuong', entityType)
      .eq('doi_tuong_id', entityId);
    
    if (error) {
      console.error(`Error fetching images for ${entityType}:`, error);
      throw error;
    }
    
    return data as Image[];
  }
};
