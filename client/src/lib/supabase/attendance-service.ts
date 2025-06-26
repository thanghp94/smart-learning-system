
import { Attendance, AttendanceWithDetails } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class AttendanceService {
  async getAll() {
    return fetchAll<Attendance>('attendances');
  }

  async getById(id: string) {
    return fetchById<Attendance>('attendances', id);
  }

  async create(data: Partial<Attendance>) {
    return insert<Attendance>('attendances', data);
  }

  async update(id: string, data: Partial<Attendance>) {
    return update<Attendance>('attendances', id, data);
  }

  async delete(id: string) {
    return remove('attendances', id);
  }

  async getByEnrollment(enrollmentId: string) {
    try {
      const response = await fetch(`/api/attendances?enrollmentId=${enrollmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendances by enrollment');
      }
      return await response.json() as Attendance[];
    } catch (error) {
      console.error('Error fetching attendances by enrollment:', error);
      throw error;
    }
  }

  async getByTeachingSession(sessionId: string) {
    try {
      const response = await fetch(`/api/attendances?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendances by teaching session');
      }
      return await response.json() as Attendance[];
    } catch (error) {
      console.error('Error fetching attendances by teaching session:', error);
      throw error;
    }
  }

  async getWithDetails(studentId?: string, classId?: string) {
    try {
      const params = new URLSearchParams();
      if (studentId) params.append('studentId', studentId);
      if (classId) params.append('classId', classId);
      params.append('includeDetails', 'true');
      
      const response = await fetch(`/api/attendances?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendances with details');
      }
      return await response.json() as AttendanceWithDetails[];
    } catch (error) {
      console.error('Error fetching attendances with details:', error);
      throw error;
    }
  }
  
  // Add the saveAttendance method
  async saveAttendance(attendanceRecords: any[]) {
    try {
      const response = await fetch('/api/attendances/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: attendanceRecords }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save attendance records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving attendance records:', error);
      throw error;
    }
  }

  // Add the missing methods for employee attendance
  async createEmployeeAttendance(data: any) {
    try {
      const response = await fetch('/api/employee-attendances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create employee attendance');
      }
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error('Error creating employee attendance:', error);
      return { data: null, error };
    }
  }

  async updateEmployeeAttendance(id: string, data: any) {
    try {
      const response = await fetch(`/api/employee-attendances/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee attendance');
      }
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error('Error updating employee attendance:', error);
      return { data: null, error };
    }
  }
}

export const attendanceService = new AttendanceService();
