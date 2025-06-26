import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const payrollService = {
  async getAll() {
    return fetchAll('payrolls');
  },

  async getById(id: string) {
    return fetchById('payrolls', id);
  },

  async getByEmployee(employeeId: string) {
    try {
      const response = await fetch(`/api/payrolls?employeeId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payrolls by employee');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payrolls by employee:', error);
      throw error;
    }
  },

  async create(payroll: any) {
    // Remove any fields that would cause database constraints issues
    const { phu_cap, ...payrollData } = payroll;
    return insert('payrolls', payrollData);
  },

  async update(id: string, updates: any) {
    // Remove any fields that would cause database constraints issues
    const { phu_cap, ...updateData } = updates;
    return update('payrolls', id, updateData);
  },

  async updateStatus(id: string, status: string) {
    return update('payrolls', id, { trang_thai: status });
  },

  async delete(id: string) {
    return remove('payrolls', id);
  }
};