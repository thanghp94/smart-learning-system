import { storage } from "./storage";
import { supabaseStorage } from "./supabase-storage";

// Database configuration - determines which storage to use
const USE_SUPABASE = process.env.USE_SUPABASE === 'true' || (
  process.env.VITE_SUPABASE_URL && 
  process.env.VITE_SUPABASE_ANON_KEY && 
  process.env.VITE_SUPABASE_URL !== '' && 
  process.env.VITE_SUPABASE_ANON_KEY !== ''
);

// Export the appropriate storage instance
export const activeStorage = USE_SUPABASE ? supabaseStorage : storage;

// Helper function to check if Supabase is available
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    await supabaseStorage.getStudents();
    return true;
  } catch (error) {
    console.warn('Supabase connection failed, falling back to PostgreSQL:', error);
    return false;
  }
}

// Dynamic storage selection with fallback
export async function getStorage() {
  if (USE_SUPABASE) {
    const isSupabaseAvailable = await checkSupabaseConnection();
    if (isSupabaseAvailable) {
      console.log('Using Supabase storage');
      return supabaseStorage;
    } else {
      console.log('Supabase unavailable, using PostgreSQL storage');
      return storage;
    }
  }
  console.log('Using PostgreSQL storage');
  return storage;
}