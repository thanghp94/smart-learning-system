
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

  const reinitializePolicies = async () => {
    setIsLoading(true);
    try {
      // First let's get the SQL content for public access policies
      const { data: sqlData, error: sqlError } = await supabase
        .storage
        .from('sql')
        .download('create_public_access_policies.sql');
      
      if (sqlError) {
        console.error('Error getting SQL file:', sqlError);
        
        // Run the policies directly
        const { error } = await supabase.rpc('run_sql', { 
          sql: `
            -- Drop existing RLS policies on classes if any exist
            DROP POLICY IF EXISTS "Allow public access to classes" ON public.classes;
            
            -- Add public access policy to classes table
            CREATE POLICY "Allow public access to classes"
            ON public.classes
            FOR ALL
            USING (true)
            WITH CHECK (true);
            
            -- Ensure RLS is enabled for the classes table
            ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
          `
        });
        
        if (error) {
          console.error('Error applying policies:', error);
          toast({
            title: 'Policy Application Error',
            description: 'Failed to apply RLS policies. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
      } else {
        // We have the SQL file, convert it to text and execute
        const sqlText = await sqlData.text();
        const { error } = await supabase.rpc('run_sql', { sql: sqlText });
        
        if (error) {
          console.error('Error applying policies from file:', error);
          toast({
            title: 'Policy Application Error',
            description: 'Failed to apply RLS policies from file. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
      }
      
      toast({
        title: 'Policies Applied',
        description: 'Database access policies have been reinitialized.',
        duration: 3000,
      });
      
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
