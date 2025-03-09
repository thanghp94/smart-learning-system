
import { createClient } from '@supabase/supabase-js';

// Fallback values used only in demonstration mode
const DEFAULT_SUPABASE_URL = 'https://your-project-url.supabase.co';
const DEFAULT_SUPABASE_KEY = 'your-anon-key';

// Use environment variables if available, otherwise use defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Create a mock Supabase client when using default values
const usingDefaults = supabaseUrl === DEFAULT_SUPABASE_URL || supabaseKey === DEFAULT_SUPABASE_KEY;

// Create a client with handling for demo mode
export const supabase = usingDefaults 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseKey);

// Mock client implementation that returns empty data arrays instead of errors
function createMockClient() {
  const mockClient = {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        count: () => Promise.resolve({ data: [{ count: 0 }], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      insert: (record: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: record, error: null })
        })
      }),
      update: (updates: any) => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: updates, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: { path: 'mock-file-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://mock-storage-url.com/image.jpg' } }),
        remove: () => Promise.resolve({ error: null })
      })
    },
    auth: {
      onAuthStateChange: () => ({ data: null, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    }
  };
  
  return mockClient as any;
}
