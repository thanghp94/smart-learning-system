import { File as FileDocument } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const fileService = {
  getAll: () => fetchAll<FileDocument>('files'),

  getById: (id: string) => fetchById<FileDocument>('files', id),

  create: async (file: Partial<FileDocument>) => {
    console.log("Creating file with data:", file);

    // Ensure the correct entity type is set
    const entityType = file.doi_tuong_lien_quan;

    if (!entityType) {
      throw new Error("Entity type is required");
    }

    // Extract and prepare the data for insert
    const dataToInsert: any = {
      ten_tai_lieu: file.ten_tai_lieu,
      doi_tuong_lien_quan: entityType,
      file1: file.file1,
      nhom_tai_lieu: file.nhom_tai_lieu,
      ngay_cap: file.ngay_cap,
      han_tai_lieu: file.han_tai_lieu,
      trang_thai: file.trang_thai || 'active',
      ghi_chu: file.ghi_chu
    };

    // Make sure we have an entity ID field
    let hasEntityId = false;

    // Add the correct entity ID field based on entity type
    if (entityType === 'nhan_vien' || entityType === 'employee') {
      dataToInsert.nhan_vien_ID = file.nhan_vien_ID;
      hasEntityId = !!file.nhan_vien_ID;
    } else if (entityType === 'co_so' || entityType === 'facility') {
      dataToInsert.co_so_id = file.co_so_id;
      hasEntityId = !!file.co_so_id;
    } else if (entityType === 'lien_he' || entityType === 'contact') {
      dataToInsert.lien_he_id = file.lien_he_id;
      hasEntityId = !!file.lien_he_id;
    } else if (entityType === 'CSVC' || entityType === 'asset') {
      dataToInsert.CSVC_ID = file.CSVC_ID;
      hasEntityId = !!file.CSVC_ID;
    } else if ((entityType === 'hoc_sinh' || entityType === 'student' || entityType === 'class' || entityType === 'lop')) {
      dataToInsert.hoc_sinh_id = file.hoc_sinh_id;
      hasEntityId = !!file.hoc_sinh_id;
    }

    if (!hasEntityId) {
      throw new Error("Entity ID is required");
    }

    console.log("Data prepared for insert:", dataToInsert);
    return insert<FileDocument>('files', dataToInsert);
  },

  update: (id: string, updates: Partial<FileDocument>) => update<FileDocument>('files', id, updates),

  delete: (id: string) => remove('files', id),

  // Get files by related entity
  getByEntity: async (entityType: string, entityId: string): Promise<FileDocument[]> => {
    try {
      const response = await fetch(`/api/files?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files by entity');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching files for ${entityType}:`, error);
      throw error;
    }
  },

  // Get files by document group
  getByDocumentGroup: async (group: string): Promise<FileDocument[]> => {
    try {
      const response = await fetch(`/api/files?documentGroup=${group}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files by document group');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching files by document group:', error);
      throw error;
    }
  },

  // Get files that are expiring soon (within next 30 days)
  getExpiringSoon: async (): Promise<FileDocument[]> => {
    try {
      const response = await fetch('/api/files?expiringSoon=true');
      if (!response.ok) {
        throw new Error('Failed to fetch expiring files');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching expiring files:', error);
      throw error;
    }
  }
};