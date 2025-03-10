
import { Image } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const imageService = {
  getAll: async (): Promise<Image[]> => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all images:', error);
        throw error;
      }
      
      return data as Image[];
    } catch (error) {
      console.error('Exception fetching all images:', error);
      throw error;
    }
  },
  
  getById: (id: string) => fetchById<Image>('images', id),
  
  create: async (image: Partial<Image>): Promise<Image> => {
    try {
      // Add timestamps if not provided
      const imageWithTimestamps = {
        ...image,
        created_at: image.created_at || new Date().toISOString(),
      };
      
      const result = await insert<Image>('images', imageWithTimestamps);
      return result;
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  },
  
  update: (id: string, updates: Partial<Image>) => update<Image>('images', id, updates),
  
  delete: (id: string) => remove('images', id),
  
  // Get images by entity
  getByEntity: async (entityType: string, entityId: string): Promise<Image[]> => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('doi_tuong', entityType)
      .eq('doi_tuong_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching images for ${entityType}:`, error);
      throw error;
    }
    
    return data as Image[];
  },
  
  // Count images by entity
  countByEntity: async (entityType: string, entityId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
      .eq('doi_tuong', entityType)
      .eq('doi_tuong_id', entityId);
    
    if (error) {
      console.error(`Error counting images for ${entityType}:`, error);
      throw error;
    }
    
    return count || 0;
  }
};
