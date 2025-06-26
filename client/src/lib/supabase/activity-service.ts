
import { ActivityItem } from '../types';
import { fetchAll, fetchById } from './base-service';
import { supabase } from './client';

export const activityService = {
  getAll: () => fetchAll<ActivityItem>('activities'),
  getById: (id: string) => fetchById<ActivityItem>('activities', id),
  
  // Get recent activities
  getRecent: async (limit: number = 10): Promise<ActivityItem[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
    
    return data as ActivityItem[];
  },
  
  // Get activities by type
  getByType: async (type: string): Promise<ActivityItem[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('type', type)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities by type ${type}:`, error);
      throw error;
    }
    
    return data as ActivityItem[];
  },
  
  // Get activities by action
  getByAction: async (action: string): Promise<ActivityItem[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('action', action)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities by action ${action}:`, error);
      throw error;
    }
    
    return data as ActivityItem[];
  },
  
  // Get activities by user
  getByUser: async (username: string): Promise<ActivityItem[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('username', username)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities for user ${username}:`, error);
      throw error;
    }
    
    return data as ActivityItem[];
  }
};
