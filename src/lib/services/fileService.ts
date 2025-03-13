
import { File as FileDocument } from '../types';
import { fileService } from '../supabase/file-service';

// Extended file type with client-side properties
export interface ExtendedFile extends FileDocument {
  file_type?: string;
  mo_ta?: string;
  ten_file?: string;
  file_url?: string;
  file_extension?: string;
  file_size?: number;
  entity_id?: string;
  entity_type?: string;
  created_at?: string;
}

// Mock File Upload Result
interface FileUploadResult {
  url: string;
  path: string;
}

// Service wrapper to ensure type safety
const FileStorageService = {
  // Get files by entity ID and type
  getByEntityId: async (entityId: string, entityType: string): Promise<ExtendedFile[]> => {
    try {
      const files = await fileService.getByEntity(entityType, entityId);
      return files as ExtendedFile[];
    } catch (error) {
      console.error(`Error fetching files for ${entityType}:`, error);
      throw error;
    }
  },

  // Upload a file and get its URL
  upload: async (file: File, bucket: string, path: string): Promise<FileUploadResult> => {
    // Since the fileService doesn't have an upload method, we'll mock it for now
    console.log(`Uploading file ${file.name} to ${bucket}/${path}`);
    
    // In a real app, this would call an API endpoint or Supabase storage
    // For now, we'll just return a fake URL
    return {
      url: URL.createObjectURL(file),
      path: `${bucket}/${path}`
    };
  },

  // Create a file record
  create: async (fileData: Partial<ExtendedFile>): Promise<ExtendedFile> => {
    // Map our extended fields to the format expected by the service
    const mappedData: Partial<FileDocument> = {
      ten_tai_lieu: fileData.ten_file,
      doi_tuong_lien_quan: fileData.entity_type,
      nhom_tai_lieu: fileData.file_type,
      file1: fileData.file_url,
      ghi_chu: fileData.mo_ta,
      trang_thai: 'active'
    };

    // Set the appropriate ID field based on entity type
    if (fileData.entity_type === 'employee' || fileData.entity_type === 'nhan_vien') {
      mappedData.nhan_vien_ID = fileData.entity_id;
    } else if (fileData.entity_type === 'student' || fileData.entity_type === 'hoc_sinh') {
      mappedData.hoc_sinh_id = fileData.entity_id;
    } else if (fileData.entity_type === 'facility' || fileData.entity_type === 'co_so') {
      mappedData.co_so_id = fileData.entity_id;
    }

    const result = await fileService.create(mappedData);
    return result as ExtendedFile;
  },

  // Delete a file
  delete: async (id: string): Promise<void> => {
    await fileService.delete(id);
  }
};

export default FileStorageService;
