
import { Student } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const studentService = {
  getAll: async () => {
    console.log("Fetching all students...");
    
    try {
      // First try the standard approach
      const students = await fetchAll<Student>('students');
      
      if (students && students.length > 0) {
        console.log(`Retrieved ${students.length} students using standard approach`);
        return students;
      }
      
      // If no results or error, try direct query
      console.log("No students returned, attempting direct query");
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error in direct student query:", error);
        return [];
      }
      
      console.log(`Retrieved ${data.length} students using direct query`);
      return data as Student[];
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  },
  
  getById: async (id: string) => {
    try {
      const student = await fetchById<Student>('students', id);
      if (student) {
        return student;
      }
      
      // Fallback to direct query
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error in direct student query by ID:", error);
        return null;
      }
      
      return data as Student;
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      return null;
    }
  },
  
  create: async (student: Partial<Student>) => {
    console.log("Creating student with data:", student);
    
    // Format date fields properly for the database
    const formattedData: Partial<Student> = {
      ...student
    };
    
    // Convert Date objects to ISO strings if they exist
    if (student.ngay_sinh && typeof student.ngay_sinh !== 'string') {
      formattedData.ngay_sinh = new Date(student.ngay_sinh).toISOString().split('T')[0];
    }
    
    if (student.han_hoc_phi && typeof student.han_hoc_phi !== 'string') {
      formattedData.han_hoc_phi = new Date(student.han_hoc_phi).toISOString().split('T')[0];
    }
    
    if (student.ngay_bat_dau_hoc_phi && typeof student.ngay_bat_dau_hoc_phi !== 'string') {
      formattedData.ngay_bat_dau_hoc_phi = new Date(student.ngay_bat_dau_hoc_phi).toISOString().split('T')[0];
    }
    
    try {
      // Try standard insert first
      const result = await insert<Student>('students', formattedData);
      
      if (result) {
        console.log("Created student successfully:", result);
        return result;
      }
      
      // If insert fails, try direct insert
      console.log("Attempting direct student insert...");
      const { data, error } = await supabase
        .from('students')
        .insert(formattedData)
        .select()
        .single();
      
      if (error) {
        console.error("Error in direct student insert:", error);
        throw error;
      }
      
      console.log("Created student with direct insert:", data);
      return data as Student;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Student>) => {
    try {
      // Format date fields for update
      const formattedUpdates: Partial<Student> = { ...updates };
      
      if (updates.ngay_sinh && typeof updates.ngay_sinh !== 'string') {
        formattedUpdates.ngay_sinh = new Date(updates.ngay_sinh).toISOString().split('T')[0];
      }
      
      if (updates.han_hoc_phi && typeof updates.han_hoc_phi !== 'string') {
        formattedUpdates.han_hoc_phi = new Date(updates.han_hoc_phi).toISOString().split('T')[0];
      }
      
      if (updates.ngay_bat_dau_hoc_phi && typeof updates.ngay_bat_dau_hoc_phi !== 'string') {
        formattedUpdates.ngay_bat_dau_hoc_phi = new Date(updates.ngay_bat_dau_hoc_phi).toISOString().split('T')[0];
      }
      
      const result = await update<Student>('students', id, formattedUpdates);
      
      if (result) {
        return result;
      }
      
      // Fallback to direct update
      const { data, error } = await supabase
        .from('students')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error in direct student update:", error);
        throw error;
      }
      
      return data as Student;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      return await remove('students', id);
    } catch (error) {
      console.error("Error deleting student:", error);
      
      // Fallback to direct delete
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error("Error in direct student delete:", deleteError);
        throw deleteError;
      }
      
      return true;
    }
  },
  
  getByFacility: async (facilityId: string): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('co_so_ID', facilityId);
      
      if (error) {
        console.error('Error fetching students by facility:', error);
        throw error;
      }
      
      return data as Student[];
    } catch (error) {
      console.error('Error in getByFacility:', error);
      return [];
    }
  }
};
