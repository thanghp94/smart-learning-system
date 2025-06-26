
import { supabase } from './client';

export const imageService = {
  async getAll() {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getByEntityId(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async create(image: any) {
    const { data, error } = await supabase
      .from('images')
      .insert(image)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  async uploadFile(bucket: string, filePath: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    return data;
  },
  
  getPublicUrl(bucket: string, filePath: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },
  
  // Add missing upload method for ImageUploadForm
  async upload(formData: FormData) {
    try {
      // Extract the file from the FormData
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file provided');
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      // Upload to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      return {
        path: filePath,
        publicUrl: data.publicUrl
      };
    } catch (error) {
      console.error('Error in upload method:', error);
      throw error;
    }
  }
};
