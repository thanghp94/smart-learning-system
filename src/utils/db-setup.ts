
import { initializeSupabase, seedInitialData } from '@/lib/supabase-config';
import { toast } from '@/hooks/use-toast';

export const setupDatabase = async (initialize = true, seed = true) => {
  try {
    let result;
    
    if (initialize) {
      toast({
        title: 'Initializing database...',
        description: 'Setting up necessary tables and structures.',
        duration: 3000,
      });
      
      result = await initializeSupabase();
      
      if (!result.success) {
        toast({
          title: 'Error initializing database',
          description: 'Please check the console for more details.',
          variant: 'destructive',
          duration: 5000,
        });
        return;
      }
      
      toast({
        title: 'Database initialized',
        description: 'Database structure has been set up successfully.',
        duration: 3000,
      });
    }
    
    if (seed) {
      toast({
        title: 'Seeding initial data...',
        description: 'Adding sample records for testing.',
        duration: 3000,
      });
      
      result = await seedInitialData();
      
      if (!result.success) {
        toast({
          title: 'Error seeding data',
          description: 'Please check the console for more details.',
          variant: 'destructive',
          duration: 5000,
        });
        return;
      }
      
      if (result.skipped) {
        toast({
          title: 'Seeding skipped',
          description: 'Data already exists in the database.',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Initial data seeded',
          description: 'Sample records have been added successfully.',
          duration: 3000,
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in database setup:', error);
    toast({
      title: 'Database setup failed',
      description: 'An unexpected error occurred.',
      variant: 'destructive',
      duration: 5000,
    });
    return false;
  }
};
