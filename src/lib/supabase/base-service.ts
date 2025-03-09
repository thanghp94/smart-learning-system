
import { supabase } from './client';

// Generic fetch function for any table
export const fetchAll = async <T>(table: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Unexpected error in fetchAll for ${table}:`, error);
    return [];
  }
};

// Generic fetch by ID
export const fetchById = async <T>(table: string, id: string): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching ${table} by ID:`, error);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Unexpected error in fetchById for ${table}:`, error);
    return null;
  }
};

// Generic insert function
export const insert = async <T>(table: string, record: Partial<T>): Promise<T> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single();
    
    if (error) {
      console.error(`Error inserting to ${table}:`, error);
      throw error;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Unexpected error in insert for ${table}:`, error);
    throw error;
  }
};

// Generic update function
export const update = async <T>(table: string, id: string, updates: Partial<T>): Promise<T> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Unexpected error in update for ${table}:`, error);
    throw error;
  }
};

// Generic delete function
export const remove = async (table: string, id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Unexpected error in remove for ${table}:`, error);
    throw error;
  }
};

// Function to log activities
export const logActivity = async (
  action: string,
  type: string,
  name: string,
  user: string,
  status?: string
): Promise<void> => {
  try {
    const activity = {
      action,
      type,
      name,
      user,
      timestamp: new Date().toISOString(),
      status
    };
    
    const { error } = await supabase
      .from('activities')
      .insert(activity);
    
    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Unexpected error in logActivity:', error);
  }
};
