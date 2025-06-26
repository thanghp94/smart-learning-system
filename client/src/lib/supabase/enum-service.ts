
import { supabase } from './client';

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
    const { data, error } = await supabase
      .from('enum_values')
      .select('*')
      .order('category, order_num');
    
    if (error) {
      console.error('Error fetching enum values:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getEnumValuesByCategory(category: string): Promise<EnumValue[]> {
    const { data, error } = await supabase
      .from('enum_values')
      .select('*')
      .eq('category', category)
      .order('order_num');
    
    if (error) {
      console.error(`Error fetching enum values for category ${category}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async getEnumCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('enum_values')
      .select('category')
      .order('category');
    
    if (error) {
      console.error('Error fetching enum categories:', error);
      throw error;
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  },
  
  async addEnumValue(newValue: Omit<EnumValue, 'id' | 'created_at' | 'updated_at'>): Promise<EnumValue> {
    const { data, error } = await supabase.rpc('add_enum_value', {
      p_category: newValue.category,
      p_value: newValue.value,
      p_description: newValue.description || null,
      p_order_num: newValue.order_num || null
    });
    
    if (error || (data && data.error)) {
      console.error('Error adding enum value:', error || data.error);
      throw error || new Error(data.error);
    }
    
    return data;
  },
  
  async updateEnumValue(id: string, updates: Pick<EnumValue, 'value' | 'description' | 'order_num'>): Promise<EnumValue> {
    const { data, error } = await supabase.rpc('update_enum_value', {
      p_id: id,
      p_value: updates.value,
      p_description: updates.description || null,
      p_order_num: updates.order_num || null
    });
    
    if (error || (data && data.error)) {
      console.error('Error updating enum value:', error || data.error);
      throw error || new Error(data.error);
    }
    
    return data;
  },
  
  async deleteEnumValue(id: string): Promise<{ message: string }> {
    const { data, error } = await supabase.rpc('delete_enum_value', {
      p_id: id
    });
    
    if (error || (data && data.error)) {
      console.error('Error deleting enum value:', error || data.error);
      throw error || new Error(data.error);
    }
    
    return { message: data.message || 'Đã xóa thành công' };
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
