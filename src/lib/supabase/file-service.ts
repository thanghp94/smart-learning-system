
import { File as FileDocument } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const fileService = {
  getAll: () => fetchAll<FileDocument>('files'),
  getById: (id: string) => fetchById<FileDocument>('files', id),
  create: (file: Partial<FileDocument>) => insert<FileDocument>('files', file),
  update: (id: string, updates: Partial<FileDocument>) => update<FileDocument>('files', id, updates),
  delete: (id: string) => remove('files', id),
  
  // Get files by related entity
  getByEntity: async (entityType: string, entityId: string): Promise<FileDocument[]> => {
    const column = entityType === 'nhan_vien' 
      ? 'nhan_vien_ID' 
      : entityType === 'co_so'
      ? 'co_so_id'
      : entityType === 'lien_he'
      ? 'lien_he_id'
      : entityType === 'CSVC'
      ? 'CSVC_ID'
      : 'hoc_sinh_id';
    
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('doi_tuong_lien_quan', entityType)
      .eq(column, entityId);
    
    if (error) {
      console.error(`Error fetching files for ${entityType}:`, error);
      throw error;
    }
    
    return data as FileDocument[];
  },
  
  // Get files by document group
  getByDocumentGroup: async (group: string): Promise<FileDocument[]> => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('nhom_tai_lieu', group);
    
    if (error) {
      console.error('Error fetching files by document group:', error);
      throw error;
    }
    
    return data as FileDocument[];
  },
  
  // Get files that are expiring soon (within next 30 days)
  getExpiringSoon: async (): Promise<FileDocument[]> => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .lt('han_tai_lieu', thirtyDaysLater.toISOString().split('T')[0])
      .gt('han_tai_lieu', today.toISOString().split('T')[0])
      .eq('tinh_trang_han', 'active');
    
    if (error) {
      console.error('Error fetching expiring files:', error);
      throw error;
    }
    
    return data as FileDocument[];
  }
};
