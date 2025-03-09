
import { supabase } from './client';

export const storageService = {
  /**
   * Upload a file to a specific bucket
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get a public URL for a file
   */
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Download a file
   */
  downloadFile: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Error downloading file:', error);
      throw error;
    }

    return data;
  },

  /**
   * List files in a bucket/folder
   */
  listFiles: async (bucket: string, path?: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '');

    if (error) {
      console.error('Error listing files:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a file
   */
  deleteFile: async (bucket: string, paths: string[]) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a signed URL for temporary access
   */
  createSignedUrl: async (bucket: string, path: string, expiresIn = 60) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }

    return data;
  }
};
