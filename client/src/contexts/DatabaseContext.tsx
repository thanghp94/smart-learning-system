
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { setupDatabase } from '@/utils/db-setup';
import { useToast } from '@/hooks/use-toast';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  initializeDatabase: () => Promise<void>;
  reinitializePolicies: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  isLoading: false,
  isDemoMode: false,
  initializeDatabase: async () => {},
  reinitializePolicies: async () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Set isDemoMode to false to disable demo mode
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  const checkDatabaseStatus = async () => {
    try {
      // Check if we can connect to the database
      const { data, error } = await supabase
        .from('classes')
        .select('count');
      
      if (error) {
        console.error('Error checking database status:', error);
        console.log('Setting isInitialized to false due to error');
        setIsInitialized(false);
        
        toast({
          title: 'Database Error',
          description: 'Could not connect to database. Please check your configuration.',
          variant: 'destructive',
          duration: 5000,
        });
      } else {
        console.log('Database connection successful, setting isInitialized to true');
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      console.log('Setting isInitialized to false due to exception');
      setIsInitialized(false);
      
      toast({
        title: 'Database Error',
        description: 'Could not connect to database. Please check your configuration.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      const success = await setupDatabase(true, false); // Disable seeding by default
      if (success) {
        console.log('Database initialized successfully');
        // Ensure RLS is disabled for classes table after initialization
        await disableRLSForTables();
      } else {
        console.log('Database initialization failed');
      }
      setIsInitialized(success);
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: 'Initialization Error',
        description: 'Failed to initialize the database. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disableRLSForTables = async () => {
    try {
      // Disable RLS on core tables for development
      const { error: disableRlsError } = await supabase.rpc('run_sql', { 
        sql: `
          -- Disable RLS on main tables completely
          ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
          ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
          ALTER TABLE public.facilities DISABLE ROW LEVEL SECURITY;
          ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
          
          -- Just in case, drop any existing policies
          DROP POLICY IF EXISTS "Allow public access to classes" ON public.classes;
          DROP POLICY IF EXISTS "Allow public access to students" ON public.students;
          DROP POLICY IF EXISTS "Allow public access to facilities" ON public.facilities;
          DROP POLICY IF EXISTS "Allow public access to sessions" ON public.sessions;
        `
      });
      
      if (disableRlsError) {
        console.error('Error disabling RLS:', disableRlsError);
        return false;
      }
      
      console.log('Successfully disabled RLS for tables');
      return true;
    } catch (error) {
      console.error('Error disabling RLS for tables:', error);
      return false;
    }
  };

  const reinitializePolicies = async () => {
    setIsLoading(true);
    try {
      const success = await disableRLSForTables();
      
      if (success) {
        toast({
          title: 'Policies Applied',
          description: 'Database access policies have been reinitialized. RLS has been disabled for development.',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Policy Update Error',
          description: 'Failed to disable row level security. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error reinitializing policies:', error);
      toast({
        title: 'Policy Reinitialization Error',
        description: 'Failed to reinitialize database policies. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        isInitialized,
        isLoading,
        isDemoMode,
        initializeDatabase,
        reinitializePolicies,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
