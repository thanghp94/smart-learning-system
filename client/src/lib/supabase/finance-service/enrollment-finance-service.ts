
import { supabase } from '../client';
import { Finance } from '@/lib/types';

export const enrollmentFinanceService = {
  // Get finances by enrollment
  async getByEnrollment(enrollmentId: string): Promise<Finance[]> {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', 'enrollment')
        .eq('doi_tuong_id', enrollmentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error(`Error fetching finances for enrollment with ID ${enrollmentId}:`, error);
      throw error;
    }
  },
  
  // Create a finance record for an enrollment
  async createForEnrollment(
    enrollmentId: string, 
    financeData: Partial<Finance>
  ): Promise<Finance> {
    try {
      // Get enrollment details first
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('student_enrollments_with_details')
        .select('*')
        .eq('id', enrollmentId)
        .single();
      
      if (enrollmentError) throw enrollmentError;
      
      // Prepare the finance record with enrollment data
      const financeRecord: Partial<Finance> = {
        ...financeData,
        loai_doi_tuong: 'enrollment',
        doi_tuong_id: enrollmentId,
        // Add additional enrollment specific data if needed
      };
      
      // Create the finance record
      const { data, error } = await supabase
        .from('finances')
        .insert(financeRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error creating finance for enrollment with ID ${enrollmentId}:`, error);
      throw error;
    }
  }
};
