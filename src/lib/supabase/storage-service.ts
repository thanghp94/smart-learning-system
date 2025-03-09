
import { supabase } from './client';
import { logActivity } from './base-service';

export const storageService = {
  // Upload a file to a specific bucket
  uploadFile: async (
    bucket: string, 
    path: string, 
    file: File,
    metadata?: Record<string, string>
  ): Promise<string> => {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
        metadata
      });
    
    if (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      throw error;
    }

    // Log the activity
    await logActivity(
      'Tải lên',
      'Tập tin',
      path,
      'Hệ thống'
    );
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  },
  
  // Delete a file from a bucket
  deleteFile: async (bucket: string, path: string): Promise<void> => {
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error(`Error deleting file ${bucket}/${path}:`, error);
      throw error;
    }

    // Log the activity
    await logActivity(
      'Xóa',
      'Tập tin',
      path,
      'Hệ thống'
    );
  },
  
  // Get a signed URL for temporary access
  getSignedUrl: async (bucket: string, path: string, expiresIn = 60): Promise<string> => {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error(`Error creating signed URL for ${bucket}/${path}:`, error);
      throw error;
    }
    
    return data.signedUrl;
  },
  
  // Get a public URL for a file
  getPublicUrl: (bucket: string, path: string): string => {
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  },
  
  // List all files in a bucket/folder
  listFiles: async (bucket: string, path?: string): Promise<{name: string, id: string, metadata: any}[]> => {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(path || '');
    
    if (error) {
      console.error(`Error listing files in ${bucket}/${path || ''}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Move/rename a file
  moveFile: async (
    bucket: string, 
    fromPath: string, 
    toPath: string
  ): Promise<void> => {
    const { error } = await supabase
      .storage
      .from(bucket)
      .move(fromPath, toPath);
    
    if (error) {
      console.error(`Error moving file from ${bucket}/${fromPath} to ${bucket}/${toPath}:`, error);
      throw error;
    }

    // Log the activity
    await logActivity(
      'Di chuyển',
      'Tập tin',
      `${fromPath} -> ${toPath}`,
      'Hệ thống'
    );
  },
  
  // Check if a file exists
  fileExists: async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .storage
        .from(bucket)
        .download(path);
      
      return !!data;
    } catch (error) {
      return false;
    }
  },
  
  // Create a new bucket
  createBucket: async (bucketName: string, isPublic: boolean = false): Promise<void> => {
    const { error } = await supabase
      .storage
      .createBucket(bucketName, {
        public: isPublic
      });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      throw error;
    }

    // Log the activity
    await logActivity(
      'Tạo mới',
      'Bucket',
      bucketName,
      'Hệ thống'
    );
  },
  
  // Delete a bucket
  deleteBucket: async (bucketName: string): Promise<void> => {
    const { error } = await supabase
      .storage
      .emptyBucket(bucketName);
    
    if (error) {
      console.error(`Error emptying bucket ${bucketName}:`, error);
      throw error;
    }
    
    const { error: deleteError } = await supabase
      .storage
      .deleteBucket(bucketName);
    
    if (deleteError) {
      console.error(`Error deleting bucket ${bucketName}:`, deleteError);
      throw deleteError;
    }

    // Log the activity
    await logActivity(
      'Xóa',
      'Bucket',
      bucketName,
      'Hệ thống'
    );
  }
};
