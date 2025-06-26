// PostgreSQL configuration - Supabase removed
import { toast } from '@/hooks/use-toast';

// Initialize PostgreSQL database configuration
export const initializeDatabase = async () => {
  console.log('Using PostgreSQL database - Supabase dependencies removed');
  
  try {
    // Database initialization is handled by PostgreSQL and Drizzle ORM
    console.log('Database configuration completed');
    return { success: true };
  } catch (error) {
    console.error('Error with database configuration:', error);
    return { success: false, error };
  }
};

// Legacy function names for compatibility
export const initializeSupabase = initializeDatabase;

// Database health check via API
export const checkDatabaseHealth = async () => {
  try {
    const response = await fetch('/api/students');
    return { success: response.ok };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { success: false, error };
  }
};