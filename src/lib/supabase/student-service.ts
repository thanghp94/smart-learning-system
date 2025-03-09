
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
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} students using direct query`);
      return data as Student[];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      console.log(`Fetching student with ID: ${id}`);
      const student = await fetchById<Student>('students', id);
      if (student) {
        console.log("Student found using standard approach");
        return student;
      }
      
      // Fallback to direct query
      console.log("Student not found, trying direct query");
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error in direct student query by ID:", error);
        throw error;
      }
      
      console.log("Student found using direct query");
      return data as Student;
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      throw error;
    }
  },
  
  create: async (student: Partial<Student>) => {
    console.log("Creating student with data:", student);
    
    // Format date fields properly for the database
    const formattedData: Partial<Student> = {
      ...student
    };
    
    // Convert Date objects to ISO strings if they exist
    if (student.ngay_sinh && student.ngay_sinh instanceof Date) {
      formattedData.ngay_sinh = student.ngay_sinh.toISOString().split('T')[0];
    }
    
    if (student.han_hoc_phi && student.han_hoc_phi instanceof Date) {
      formattedData.han_hoc_phi = student.han_hoc_phi.toISOString().split('T')[0];
    }
    
    if (student.ngay_bat_dau_hoc_phi && student.ngay_bat_dau_hoc_phi instanceof Date) {
      formattedData.ngay_bat_dau_hoc_phi = student.ngay_bat_dau_hoc_phi.toISOString().split('T')[0];
    }
    
    try {
      console.log("Attempting to insert student with data:", formattedData);
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
      
      // If we have an error about column not found for co_so_ID
      if (error instanceof Error && error.message.includes("co_so_ID")) {
        console.log("Attempting to insert without co_so_ID...");
        const { co_so_ID, ...dataWithoutCoSoID } = formattedData;
        return this.create(dataWithoutCoSoID);
      }
      
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Student>) => {
    try {
      console.log(`Updating student with ID ${id}:`, updates);
      
      // Format date fields for update
      const formattedUpdates: Partial<Student> = { ...updates };
      
      if (updates.ngay_sinh && updates.ngay_sinh instanceof Date) {
        formattedUpdates.ngay_sinh = updates.ngay_sinh.toISOString().split('T')[0];
      }
      
      if (updates.han_hoc_phi && updates.han_hoc_phi instanceof Date) {
        formattedUpdates.han_hoc_phi = updates.han_hoc_phi.toISOString().split('T')[0];
      }
      
      if (updates.ngay_bat_dau_hoc_phi && updates.ngay_bat_dau_hoc_phi instanceof Date) {
        formattedUpdates.ngay_bat_dau_hoc_phi = updates.ngay_bat_dau_hoc_phi.toISOString().split('T')[0];
      }
      
      console.log("Formatted updates:", formattedUpdates);
      
      // If we might have co_so_ID issue, handle it
      if ('co_so_ID' in formattedUpdates) {
        // Remove the property
        const { co_so_ID, ...updatesWithoutCoSoID } = formattedUpdates;
        formattedUpdates = updatesWithoutCoSoID;
      }
      
      const result = await update<Student>('students', id, formattedUpdates);
      
      if (result) {
        console.log("Updated student successfully:", result);
        return result;
      }
      
      // Fallback to direct update
      console.log("Attempting direct student update...");
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
      
      console.log("Updated student with direct update:", data);
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
        .eq('co_so_id', facilityId);
      
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
