
import { supabase } from '../../client';
import { Class } from '@/lib/types';

/**
 * Service for specialized class-related queries
 */
class ClassQueryService {
  /**
   * Fetches all classes with student count
   */
  async getAllWithStudentCount(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('classes_with_student_count')
        .select('*')
        .order('ten_lop_full', { ascending: true });
      
      if (error) {
        console.error('Error fetching classes with student count:', error);
        // Fall back to regular class fetch
        return this.getAllFallback();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchClassesWithStudentCount:', error);
      return this.getAllFallback();
    }
  }

  /**
   * Fallback method to fetch all classes if the view doesn't exist
   */
  private async getAllFallback(): Promise<Class[]> {
    try {
      console.log('Falling back to regular class fetch');
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('ten_lop_full', { ascending: true });
      
      if (error) {
        console.error('Error in fallback class fetch:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fallback class fetch:', error);
      return [];
    }
  }

  /**
   * Fetches classes for a specific facility
   */
  async getByFacility(facilityId: string): Promise<Class[]> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('co_so', facilityId)
        .order('ten_lop_full', { ascending: true });
      
      if (error) {
        console.error('Error fetching classes by facility:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchClassesByFacility:', error);
      return [];
    }
  }
}

export default new ClassQueryService();
