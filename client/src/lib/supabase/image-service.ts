import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const imageService = {
  async getAll() {
    return fetchAll('images');
  },

  async getById(id: string) {
    return fetchById('images', id);
  },

  async getByEntityId(entityType: string, entityId: string) {
    try {
      const response = await fetch(`/api/images?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images by entity');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching images by entity:', error);
      throw error;
    }
  },

  async create(image: any) {
    return insert('images', image);
  },

  async update(id: string, updates: any) {
    return update('images', id, updates);
  },

  async delete(id: string) {
    return remove('images', id);
  },

  // File upload method for compatibility
  async upload(formData: FormData) {
    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in upload method:', error);
      throw error;
    }
  }
};