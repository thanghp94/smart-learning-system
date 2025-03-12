
import { File as FileDocument } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const fileService = {
  getAll: () => fetchAll<FileDocument>('files'),
  
  getById: (id: string) => fetchById<FileDocument>('files', id),
  
  create: async (file: Partial<FileDocument>) => {
    console.log("Creating file with data:", file);
    
    // Ensure the correct entity type is set
    const entityType = file.doi_tuong_lien_quan;
    
    // Extract and prepare the data for insert
    const dataToInsert: any = {
      ten_tai_lieu: file.ten_tai_lieu,
      doi_tuong_lien_quan: entityType,
      file1: file.file1 || file.duong_dan,
      nhom_tai_lieu: file.nhom_tai_lieu,
      ngay_cap: file.ngay_cap,
      han_tai_lieu: file.han_tai_lieu,
      trang_thai: file.trang_thai || 'active',
      ghi_chu: file.ghi_chu
    };
    
    // Add the correct entity ID field based on entity type
    if (entityType === 'nhan_vien' && file.nhan_vien_ID) {
      dataToInsert.nhan_vien_ID = file.nhan_vien_ID;
    } else if (entityType === 'co_so' && file.co_so_id) {
      dataToInsert.co_so_id = file.co_so_id;
    } else if (entityType === 'lien_he' && file.lien_he_id) {
      dataToInsert.lien_he_id = file.lien_he_id;
    } else if (entityType === 'CSVC' && file.CSVC_ID) {
      dataToInsert.CSVC_ID = file.CSVC_ID;
    } else if ((entityType === 'hoc_sinh' || entityType === 'class') && file.hoc_sinh_id) {
      dataToInsert.hoc_sinh_id = file.hoc_sinh_id;
    }
    
    console.log("Data prepared for insert:", dataToInsert);
    return insert<FileDocument>('files', dataToInsert);
  },
  
  update: (id: string, updates: Partial<FileDocument>) => update<FileDocument>('files', id, updates),
  
  delete: (id: string) => remove('files', id),
  
  // Get files by related entity
  getByEntity: async (entityType: string, entityId: string): Promise<FileDocument[]> => {
    let column = '';
    
    // Determine which column to use based on entity type
    if (entityType === 'nhan_vien') {
      column = 'nhan_vien_ID';
    } else if (entityType === 'co_so') {
      column = 'co_so_id';
    } else if (entityType === 'lien_he') {
      column = 'lien_he_id';
    } else if (entityType === 'CSVC') {
      column = 'CSVC_ID';
    } else {
      column = 'hoc_sinh_id';
    }
    
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
