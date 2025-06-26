import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const evaluationService = {
  async getAll() {
    return fetchAll('evaluations');
  },

  async getById(id: string) {
    return fetchById('evaluations', id);
  },

  async getByEntityId(entityType: string, entityId: string) {
    try {
      const response = await fetch(`/api/evaluations?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations by entity');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching evaluations by entity:', error);
      throw error;
    }
  },

  async create(evaluation: any) {
    return insert('evaluations', evaluation);
  },

  async update(id: string, updates: any) {
    return update('evaluations', id, updates);
  },

  async delete(id: string) {
    return remove('evaluations', id);
  }
};