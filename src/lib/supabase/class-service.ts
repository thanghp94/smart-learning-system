
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const getClassById = async (id: string): Promise<Class | null> => {
  return await fetchById<Class>('classes', id);
};

export const classService = {
  getAll: () => fetchAll<Class>('classes'),
  getById: getClassById,
  create: async (classData: Partial<Class>) => {
    console.log("Creating class with data:", classData);
    
    // Create a properly formatted object that matches database column names
    const formattedData: any = {
      ten_lop_full: classData.Ten_lop_full || classData.ten_lop_full,
      ten_lop: classData.ten_lop,
      ct_hoc: classData.ct_hoc || '',
      co_so: classData.co_so || null,
      gv_chinh: classData.GV_chinh || classData.gv_chinh || null,
      ngay_bat_dau: classData.ngay_bat_dau || null,
      tinh_trang: classData.tinh_trang || 'active',
      ghi_chu: classData.ghi_chu || '',
      unit_id: classData.unit_id || null
    };
    
    // Format date fields if they exist and are not null
    if (formattedData.ngay_bat_dau && typeof formattedData.ngay_bat_dau !== 'string') {
      formattedData.ngay_bat_dau = new Date(formattedData.ngay_bat_dau).toISOString().split('T')[0];
    }
    
    try {
      // Ensure that UUID fields are either valid UUIDs or null
      // Empty strings are not valid for UUID fields
      if (formattedData.co_so === '') {
        formattedData.co_so = null;
      }
      
      if (formattedData.gv_chinh === '') {
        formattedData.gv_chinh = null;
      }
      
      if (formattedData.unit_id === '') {
        formattedData.unit_id = null;
      }
      
      const result = await insert<Class>('classes', formattedData);
      console.log("Class creation result:", result);
      return result;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  },
  update: (id: string, updates: Partial<Class>) => update<Class>('classes', id, updates),
  delete: (id: string) => remove('classes', id),
  
  getByFacility: async (facilityId: string): Promise<Class[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('co_so', facilityId);
    
    if (error) {
      console.error('Error fetching classes by facility:', error);
      throw error;
    }
    
    return data as Class[];
  }
};
