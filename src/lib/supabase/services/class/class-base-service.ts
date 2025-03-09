
import { supabase } from '../../client';
import { logActivity } from '../../base-service';
import { Class } from '@/lib/types';

/**
 * Base service class for core CRUD operations related to classes
 */
class ClassBaseService {
  /**
   * Fetches all classes from the database
   */
  async getAll(): Promise<Class[]> {
    console.log('Fetching all classes...');
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('ten_lop_full', { ascending: true });
      
      if (error) {
        console.error('Error fetching classes:', error);
        return [];
      }
      
      console.log(`Successfully fetched ${data?.length || 0} classes`);
      
      // Ensure all returned classes have required fields
      return (data || []).map(classData => ({
        ...classData,
        id: classData.id || crypto.randomUUID(),
        ten_lop_full: classData.ten_lop_full || '',
        ten_lop: classData.ten_lop || '',
        ct_hoc: classData.ct_hoc || '',
        co_so: classData.co_so || '',
        gv_chinh: classData.gv_chinh || '',
        ngay_bat_dau: classData.ngay_bat_dau || null,
        tinh_trang: classData.tinh_trang || 'pending'
      }));
    } catch (error) {
      console.error('Error in fetchClasses:', error);
      return [];
    }
  }

  /**
   * Fetches a single class by ID
   */
  async getById(id: string): Promise<Class | null> {
    try {
      console.log(`Fetching class with ID ${id}...`);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching class by ID:', error);
        return null;
      }
      
      console.log('Successfully fetched class by ID:', data);
      
      // Ensure required fields are present
      return {
        ...data,
        id: data.id || id,
        ten_lop_full: data.ten_lop_full || '',
        ten_lop: data.ten_lop || '',
        ct_hoc: data.ct_hoc || '',
        co_so: data.co_so || '',
        gv_chinh: data.gv_chinh || '',
        ngay_bat_dau: data.ngay_bat_dau || null,
        tinh_trang: data.tinh_trang || 'pending'
      } as Class;
    } catch (error) {
      console.error(`Error in getById for class ${id}:`, error);
      return null;
    }
  }

  /**
   * Creates a new class - using database function to bypass RLS
   */
  async create(classData: Omit<Class, 'id'> & { id?: string }): Promise<Class | null> {
    try {
      console.log('Creating new class:', classData);
      
      // Create a formatted copy to avoid mutating the original
      const formattedData = { 
        ...classData,
        ten_lop_full: classData.ten_lop_full || '',
        ten_lop: classData.ten_lop || '',
        ct_hoc: classData.ct_hoc || ''
      };
      
      // Handle empty teacher ID - set to null if empty string
      if (formattedData.gv_chinh === '') {
        formattedData.gv_chinh = null;
      }
      
      // Handle empty facility ID - set to null if empty string
      if (formattedData.co_so === '') {
        formattedData.co_so = null;
      }
      
      // Convert date strings to proper format if they exist
      if (formattedData.ngay_bat_dau) {
        // Use a standardized date format for Supabase (YYYY-MM-DD)
        const date = new Date(formattedData.ngay_bat_dau);
        if (!isNaN(date.getTime())) {
          formattedData.ngay_bat_dau = date.toISOString().split('T')[0];
        }
      }
      
      // Add a unique ID to the data if not provided
      const recordId = formattedData.id || crypto.randomUUID();
      formattedData.id = recordId;
      
      // Use the RPC function to create the class
      console.log('Using RPC function to create class:', formattedData);
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'create_class',
        { class_data: formattedData }
      );
      
      if (rpcError) {
        console.error('Error creating class via RPC:', rpcError);
        
        // Fallback to direct insert if RPC fails
        console.log('Attempting direct insert as fallback...');
        const { data: directData, error: directError } = await supabase
          .from('classes')
          .insert(formattedData)
          .select()
          .single();
        
        if (directError) {
          console.error('Error in direct insert fallback:', directError);
          throw directError;
        }
        
        console.log('Class created successfully via direct insert:', directData);
        
        // Log activity
        await logActivity(
          'create',
          'class',
          directData.ten_lop_full,
          'system',
          'completed'
        );
        
        return directData as Class;
      }
      
      console.log('Class created successfully via RPC:', rpcData);
      
      // Log activity
      await logActivity(
        'create',
        'class',
        rpcData.ten_lop_full || formattedData.ten_lop_full,
        'system',
        'completed'
      );
      
      return rpcData as Class;
    } catch (error) {
      console.error('Error in createClass:', error);
      throw error;
    }
  }

  /**
   * Updates an existing class
   */
  async update(id: string, updates: Partial<Class>): Promise<Class | null> {
    try {
      console.log('Updating class:', id, updates);
      
      // Create a formatted copy to avoid mutating the original
      const formattedUpdates = { ...updates };
      
      // Convert date strings to proper format if they exist
      if (formattedUpdates.ngay_bat_dau) {
        const date = new Date(formattedUpdates.ngay_bat_dau);
        if (!isNaN(date.getTime())) {
          formattedUpdates.ngay_bat_dau = date.toISOString().split('T')[0];
        }
      }
      
      const { data, error } = await supabase
        .from('classes')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating class:', error);
        throw error;
      }
      
      console.log('Class updated successfully:', data);
      
      // Log activity
      await logActivity(
        'update',
        'class',
        data.ten_lop_full,
        'system',
        'completed'
      );
      
      return data;
    } catch (error) {
      console.error('Error in updateClass:', error);
      throw error;
    }
  }

  /**
   * Deletes a class by ID
   */
  async delete(id: string): Promise<void> {
    try {
      // First, get the class to log its name
      const classToDelete = await this.getById(id);
      
      if (!classToDelete) {
        console.error('Class not found for deletion');
        throw new Error('Class not found');
      }
      
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting class:', error);
        throw error;
      }
      
      console.log('Class deleted successfully:', id);
      
      // Log activity
      await logActivity(
        'delete',
        'class',
        classToDelete.ten_lop_full,
        'system',
        'completed'
      );
    } catch (error) {
      console.error('Error in deleteClass:', error);
      throw error;
    }
  }
}

export default new ClassBaseService();
