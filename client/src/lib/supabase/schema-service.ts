
import { supabase } from './client';

/**
 * Creates the get_schema_info function in Supabase if it doesn't exist
 */
export const setupSchemaFunction = async () => {
  try {
    // Create the function that returns database schema information
    const { error } = await supabase.rpc('create_schema_info_function');
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating schema info function:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error setting up schema function:', error);
    return { success: false, error };
  }
};

/**
 * Gets database schema information
 */
export const getSchemaInfo = async () => {
  try {
    const { data, error } = await supabase.rpc('get_schema_info');
    
    if (error) {
      console.error('Error getting schema info:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting schema info:', error);
    return { success: false, error };
  }
};

// Create and export a service object to maintain consistency with other services
export const schemaService = {
  setupSchemaFunction,
  getSchemaInfo
};
