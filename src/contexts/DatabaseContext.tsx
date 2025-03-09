
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  const checkDatabaseStatus = async () => {
    try {
      // Check if we're in demo mode based on environment variables
      const demoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
      setIsDemoMode(demoMode);
      
      if (demoMode) {
        // In demo mode, set initialized to true without checking database
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }
      
      // Check if at least one table exists and has data
      const { data, error } = await supabase
        .from('facilities')
        .select('count');
      
      if (error) {
        console.error('Error checking database status:', error);
        setIsInitialized(false);
      } else {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        toast({
          title: 'Demo Mode',
          description: 'Database initialization is not available in demo mode. Please configure Supabase credentials.',
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }
      
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
