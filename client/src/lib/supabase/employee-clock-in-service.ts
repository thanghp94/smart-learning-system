import { fetchAll, fetchById, insert, update } from './base-service';

export const employeeClockInService = {
  async getByEmployeeId(employeeId: string) {
    try {
      const response = await fetch(`/api/employee-clock-ins?employeeId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee clock-ins');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee clock-ins:', error);
      throw error;
    }
  },

  async getAllForDate(date: string) {
    try {
      const response = await fetch(`/api/employee-clock-ins?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clock-ins for date');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clock-ins for date:', error);
      throw error;
    }
  },

  async create(clockInData: any) {
    return insert('employee-clock-ins', clockInData);
  },

  async updateClockOut(id: string, clockOutTime: string) {
    return update('employee-clock-ins', id, { 
      clock_out_time: clockOutTime 
    });
  },

  async getByEmployeeAndDate(employeeId: string, date: string) {
    try {
      const response = await fetch(`/api/employee-clock-ins?employeeId=${employeeId}&date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee clock-ins for date');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee clock-ins for date:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    return update('employee-clock-ins', id, updates);
  },

  async getMonthlyReport(year: number, month: number) {
    try {
      const response = await fetch(`/api/employee-clock-ins?year=${year}&month=${month}&includeEmployee=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly report');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error;
    }
  },

  async getDailyReport(date: string) {
    try {
      const response = await fetch(`/api/employee-clock-ins?date=${date}&includeEmployee=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch daily report');
      }

      const data = await response.json();
      // Format the data to include employee details
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
        employee_image: record.employees?.hinh_anh || null,
        department: record.employees?.phong_ban || 'Unassigned',
        position: record.employees?.vi_tri || 'No position'
      }));
    } catch (error) {
      console.error('Error fetching daily report:', error);
      throw error;
    }
  },

  async getAll() {
    return fetchAll('employee-clock-ins');
  },

  async getMonthlyAttendance(month: number, year: number) {
    try {
      const response = await fetch(`/api/employee-clock-in?month=${month}&year=${year}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly attendance');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error in getMonthlyAttendance:', error);
      throw error;
    }
  }
};