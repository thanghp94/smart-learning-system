import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const requestService = {
  async getAll() {
    return fetchAll('requests');
  },

  async getById(id: string) {
    return fetchById('requests', id);
  },

  async create(request: any) {
    return insert('requests', request);
  },

  async updateStatus(id: string, status: string, processedDate: string) {
    return update('requests', id, { 
      trang_thai: status,
      processed_date: processedDate 
    });
  },

  async delete(id: string) {
    return remove('requests', id);
  }
};