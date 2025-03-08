
import { supabase } from './client';

// Generic fetch function for any table
export const fetchAll = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    throw error;
  }
  
  return data as T[];
};

// Generic fetch by ID
export const fetchById = async <T>(table: string, id: string): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching ${table} by ID:`, error);
    throw error;
  }
  
  return data as T;
};

// Generic insert function
export const insert = async <T>(table: string, record: Partial<T>): Promise<T> => {
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
};

// Generic update function
export const update = async <T>(table: string, id: string, updates: Partial<T>): Promise<T> => {
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
};

// Generic delete function
export const remove = async (table: string, id: string): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting from ${table}:`, error);
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
};
