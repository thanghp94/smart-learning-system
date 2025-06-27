import { storage } from "./storage";
import { supabaseStorage } from "./supabase-storage";

// Database configuration - force Supabase usage only
const USE_SUPABASE = true;

// Export Supabase storage exclusively
export const activeStorage = supabaseStorage;

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

// Force Supabase storage usage only
export async function getStorage() {
  console.log('Using Supabase storage exclusively');
  return supabaseStorage;
}