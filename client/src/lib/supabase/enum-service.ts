import { fetchAll, fetchById, insert, update, remove } from './base-service';

export interface EnumValue {
  id: string;
  category: string;
  value: string;
  description?: string;
  order_num?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EnumCategory {
  name: string;
  values: EnumValue[];
}

export const enumService = {
  async getAllEnumValues(): Promise<EnumValue[]> {
    try {
      const data = await fetchAll<EnumValue>('enums');
      return data || [];
    } catch (error) {
      console.error('Error fetching enum values:', error);
      throw error;
    }
  },

  async getEnumValuesByCategory(category: string): Promise<EnumValue[]> => {
    try {
      const response = await fetch(`/api/enums?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enum values by category');
      }
      return await response.json() || [];
    } catch (error) {
      console.error(`Error fetching enum values for category ${category}:`, error);
      throw error;
    }
  },

  async getEnumCategories(): Promise<string[]> => {
    try {
      const response = await fetch('/api/enums/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch enum categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching enum categories:', error);
      throw error;
    }
  },

  async addEnumValue(newValue: Omit<EnumValue, 'id' | 'created_at' | 'updated_at'>): Promise<EnumValue> {
    try {
      return await insert<EnumValue>('enums', newValue);
    } catch (error) {
      console.error('Error adding enum value:', error);
      throw error;
    }
  },

  async updateEnumValue(id: string, updates: Pick<EnumValue, 'value' | 'description' | 'order_num'>): Promise<EnumValue> {
    try {
      return await update<EnumValue>('enums', id, updates);
    } catch (error) {
      console.error('Error updating enum value:', error);
      throw error;
    }
  },

  async deleteEnumValue(id: string): Promise<{ message: string }> {
    try {
      await remove('enums', id);
      return { message: 'Đã xóa thành công' };
    } catch (error) {
      console.error('Error deleting enum value:', error);
      throw error;
    }
  },

  // Tiện ích để nhóm giá trị enum theo category
  groupEnumsByCategory(enums: EnumValue[]): EnumCategory[] {
    const categoriesMap = new Map<string, EnumValue[]>();

    enums.forEach(enumValue => {
      if (!categoriesMap.has(enumValue.category)) {
        categoriesMap.set(enumValue.category, []);
      }
      categoriesMap.get(enumValue.category)!.push(enumValue);
    });

    return Array.from(categoriesMap.entries()).map(([name, values]) => ({
      name,
      values: values.sort((a, b) => (a.order_num || 0) - (b.order_num || 0))
    }));
  }
};