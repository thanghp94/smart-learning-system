// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qpxoqafxuhmtiyuwsmaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweG9xYWZ4dWhtdGl5dXdzbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjIzNDEsImV4cCI6MjA1NjkzODM0MX0.nknrfpbM_OU7kzMjMMc5nrAMa6vcVSfJ4CjtAMy8ER0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);