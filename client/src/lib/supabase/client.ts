
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qpxoqafxuhmtiyuwsmaz.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweG9xYWZ4dWhtdGl5dXdzbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjIzNDEsImV4cCI6MjA1NjkzODM0MX0.nknrfpbM_OU7kzMjMMc5nrAMa6vcVSfJ4CjtAMy8ER0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Log connection status for debugging
console.log('Supabase client initialized:', SUPABASE_URL ? 'URL provided' : 'URL missing');
