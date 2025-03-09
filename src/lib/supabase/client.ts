
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase connection with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qpxoqafxuhmtiyuwsmaz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweG9xYWZ4dWhtdGl5dXdzbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjIzNDEsImV4cCI6MjA1NjkzODM0MX0.nknrfpbM_OU7kzMjMMc5nrAMa6vcVSfJ4CjtAMy8ER0';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Log connection status (for debugging)
console.log('Supabase client initialized with URL:', supabaseUrl ? 'URL provided' : 'URL missing');
