
import { supabase } from './client';
import { Admission } from '../types/admission';

export const admissionService = {
  async getAllAdmissions(): Promise<Admission[]> {
    try {
      const { data, error } = await supabase
        .from('admissions_with_details')
        .select('*')
        .order('ngay_cap_nhat', { ascending: false });

      if (error) {
        console.error('Error fetching admissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getAllAdmissions:', error);
      return [];
    }
  },

  async getAdmissionById(id: string): Promise<Admission | null> {
    try {
      const { data, error } = await supabase
        .from('admissions_with_details')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching admission:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in getAdmissionById:', error);
      return null;
    }
  },

  async createAdmission(admission: Partial<Admission>): Promise<Admission | null> {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .insert(admission)
        .select()
        .single();

      if (error) {
        console.error('Error creating admission:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in createAdmission:', error);
      return null;
    }
  },

  async updateAdmission(id: string, updates: Partial<Admission>): Promise<Admission | null> {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating admission:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in updateAdmission:', error);
      return null;
    }
  },

  async deleteAdmission(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting admission:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in deleteAdmission:', error);
      return false;
    }
  },

  async updateAdmissionStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admissions')
        .update({ trang_thai: status, ngay_cap_nhat: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating admission status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateAdmissionStatus:', error);
      return false;
    }
  }
};
