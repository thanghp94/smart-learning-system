
import React, { createContext, useContext, useState, useEffect } from 'react';
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
      // Check if we can connect to the SQLite database via our API
      const response = await fetch('/api/classes');
      
      if (!response.ok) {
        console.error('Error checking database status: API response not ok');
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
      // Check if database is accessible via API
      const response = await fetch('/api/students');
      const success = response.ok;
      
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

  const disableRLSForTables = async () => {
    try {
      // SQLite doesn't have RLS, so this is always successful
      console.log('SQLite database - no RLS to disable');
      return true;
    } catch (error) {
      console.error('Error in disableRLSForTables:', error);
      return false;
    }
  };

  const reinitializePolicies = async () => {
    setIsLoading(true);
    try {
      const success = await disableRLSForTables();
      
      if (success) {
        toast({
          title: 'Database Ready',
          description: 'SQLite database is ready for use.',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Database Error',
          description: 'Database access error. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error reinitializing policies:', error);
      toast({
        title: 'Database Error',
        description: 'Failed to check database status. Please try again.',
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
