
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { EmployeeClockInOut } from '@/lib/types';

class EmployeeClockInService {
  /**
   * Get all clock in/out records
   */
  async getAll(): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .order('ngay', { ascending: false });
      
      if (error) {
        console.error('Error fetching clock in/out records:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut[];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  /**
   * Get clock in/out record by ID
   */
  async getById(id: string): Promise<EmployeeClockInOut | null> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching clock in/out record by ID:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  /**
   * Get clock in/out records for a specific employee
   */
  async getByEmployeeId(employeeId: string): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .order('ngay', { ascending: false });
      
      if (error) {
        console.error('Error fetching clock in/out records by employee ID:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut[];
    } catch (error) {
      console.error('Error in getByEmployeeId:', error);
      throw error;
    }
  }

  /**
   * Get clock in/out records for a specific date
   */
  async getByDate(date: string): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('ngay', date);
      
      if (error) {
        console.error('Error fetching clock in/out records by date:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut[];
    } catch (error) {
      console.error('Error in getByDate:', error);
      throw error;
    }
  }

  /**
   * Create a new clock in/out record
   */
  async create(record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .insert(record)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating clock in/out record:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Update a clock in/out record
   */
  async update(id: string, updates: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating clock in/out record:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete a clock in/out record
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('employee_clock_in_out')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting clock in/out record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  /**
   * Clock in an employee
   */
  async clockIn(employeeId: string, date: string, time: string): Promise<EmployeeClockInOut> {
    try {
      // Check if a record already exists for this employee and date
      const { data: existingRecord, error: checkError } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .eq('ngay', date)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking for existing record:', checkError);
        throw checkError;
      }
      
      if (existingRecord) {
        // Update the existing record with clock in time
        const { data, error } = await supabase
          .from('employee_clock_in_out')
          .update({ thoi_gian_bat_dau: time })
          .eq('id', existingRecord.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating clock in time:', error);
          throw error;
        }
        
        return data as EmployeeClockInOut;
      } else {
        // Create a new record
        return this.create({
          nhan_vien_id: employeeId,
          ngay: date,
          thoi_gian_bat_dau: time,
          xac_nhan: false,
          trang_thai: 'pending'
        });
      }
    } catch (error) {
      console.error('Error in clockIn:', error);
      throw error;
    }
  }

  /**
   * Clock out an employee
   */
  async clockOut(employeeId: string, date: string, time: string): Promise<EmployeeClockInOut> {
    try {
      // Find the record for this employee and date
      const { data: existingRecord, error: checkError } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .eq('ngay', date)
        .single();
      
      if (checkError) {
        console.error('Error finding record for clock out:', checkError);
        throw checkError;
      }
      
      if (!existingRecord) {
        throw new Error('No clock in record found for this employee and date');
      }
      
      // Update the record with clock out time
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .update({ 
          thoi_gian_ket_thuc: time,
          trang_thai: 'completed'
        })
        .eq('id', existingRecord.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating clock out time:', error);
        throw error;
      }
      
      return data as EmployeeClockInOut;
    } catch (error) {
      console.error('Error in clockOut:', error);
      throw error;
    }
  }

  /**
   * Approve a clock in/out record
   */
  async approve(id: string, notes?: string): Promise<EmployeeClockInOut> {
    try {
      const updates: Partial<EmployeeClockInOut> = {
        xac_nhan: true,
        trang_thai: 'approved'
      };
      
      if (notes) {
        updates.ghi_chu = notes;
      }
      
      return this.update(id, updates);
    } catch (error) {
      console.error('Error in approve:', error);
      throw error;
    }
  }
}

export const employeeClockInService = new EmployeeClockInService();
