
import { createClient } from '@supabase/supabase-js';

// Fallback values used only when environment variables are not available
const DEFAULT_SUPABASE_URL = 'https://your-project-url.supabase.co';
const DEFAULT_SUPABASE_KEY = 'your-anon-key';

// Use environment variables if available, otherwise use defaults
// This prevents runtime errors when environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
