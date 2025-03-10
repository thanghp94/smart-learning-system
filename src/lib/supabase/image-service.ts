
import { Image } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';
import { storageService } from './storage-service';

export const imageService = {
  async getAll() {
    return fetchAll<Image>('images');
  },
  
  async getById(id: string) {
    return fetchById<Image>('images', id);
  },
  
  async create(image: Partial<Image>) {
    try {
      const result = await insert<Image>('images', image);
      await logActivity('create', 'image', image.file_name || 'New image', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating image record:', error);
      throw error;
    }
  },
  
  async update(id: string, updates: Partial<Image>) {
    try {
      const result = await update<Image>('images', id, updates);
      await logActivity('update', 'image', updates.file_name || 'Update image', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating image record:', error);
      throw error;
    }
  },
  
  async delete(id: string) {
    try {
      // Get the image record first to find the path
      const image = await this.getById(id);
      if (image && image.file_name) {
        // Delete from storage
        await storageService.deleteFile('images', image.file_name);
      }
      
      // Delete the record
      await remove('images', id);
      await logActivity('delete', 'image', 'Delete image', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
  
  async getByEntity(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching images for ${entityType} ${entityId}:`, error);
      throw error;
    }
  },
  
  async countByEntity(entityType: string, entityId: string) {
    try {
      const { count, error } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Error counting images for ${entityType} ${entityId}:`, error);
      throw error;
    }
  },

  // Upload file to storage and return the path
  async upload(formData: FormData) {
    try {
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file provided');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await storageService.uploadFile('images', filePath, file);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};
