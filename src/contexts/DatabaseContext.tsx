
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { setupDatabase } from '@/utils/db-setup';
import { toast } from '@/hooks/use-toast';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  initializeDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  isLoading: false,
  initializeDatabase: async () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkDatabaseStatus = async () => {
    try {
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
        initializeDatabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
