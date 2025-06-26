import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const settingService = {
  async getAll() {
    return fetchAll('settings');
  },

  async getByKey(key: string) {
    try {
      const response = await fetch(`/api/settings?key=${key}`);
      if (!response.ok) {
        throw new Error('Failed to fetch setting by key');
      }
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching setting by key:', error);
      throw error;
    }
  },

  async getEmailSettings() {
    try {
      const response = await fetch('/api/settings?category=email');
      if (!response.ok) {
        throw new Error('Failed to fetch email settings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching email settings:', error);
      throw error;
    }
  },

  async save(setting: any) {
    // If setting has an ID, update it; otherwise, create a new one
    if (setting.id) {
      return update('settings', setting.id, setting);
    } else {
      return insert('settings', setting);
    }
  },

  async delete(id: string) {
    return remove('settings', id);
  },

  async saveEmailSettings(emailSettings: any) {
    try {
      // First check if email settings already exist
      const existing = await this.getByKey('smtp_config');

      if (existing?.id) {
        return this.save({
          ...existing,
          mo_ta: JSON.stringify(emailSettings),
          updated_at: new Date().toISOString()
        });
      } else {
        return this.save({
          hang_muc: 'email',
          tuy_chon: 'smtp',
          key: 'smtp_config',
          mo_ta: JSON.stringify(emailSettings),
          hien_thi: 'Email Configuration'
        });
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      throw error;
    }
  },

  async getEmailConfig() {
    try {
      const setting = await this.getByKey('smtp_config');

      if (setting?.mo_ta) {
        try {
          return JSON.parse(setting.mo_ta);
        } catch (e) {
          console.error('Error parsing email config:', e);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting email config:', error);
      return null;
    }
  }
};