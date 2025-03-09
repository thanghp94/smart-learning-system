
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { setupDatabase } from '@/utils/db-setup';
import { useToast } from '@/hooks/use-toast';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  initializeDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  isLoading: false,
  isDemoMode: false,
  initializeDatabase: async () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false); // Set to false to disable demo mode
  const { toast } = useToast();

  const checkDatabaseStatus = async () => {
    try {
      // Check if at least one table exists and has data
      const { data, error } = await supabase
        .from('facilities')
        .select('count');
      
      if (error) {
        console.error('Error checking database status:', error);
        setIsInitialized(false);
        
        toast({
          title: 'Database Error',
          description: 'Could not connect to database. Please check your configuration.',
          variant: 'destructive',
          duration: 5000,
        });
      } else {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
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
      const success = await setupDatabase(true, true);
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
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
