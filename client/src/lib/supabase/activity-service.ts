
import { ActivityItem } from '../types';
import { fetchAll, fetchById } from './base-service';

export const activityService = {
  getAll: () => fetchAll<ActivityItem>('activities'),
  getById: (id: string) => fetchById<ActivityItem>('activities', id),
  
  // Get recent activities
  getRecent: async (limit: number = 10): Promise<ActivityItem[]> => {
    try {
      const response = await fetch(`/api/activities?limit=${limit}&order=desc`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent activities');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
  
  // Get activities by type
  getByType: async (type: string): Promise<ActivityItem[]> => {
    try {
      const response = await fetch(`/api/activities?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities by type');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching activities by type ${type}:`, error);
      throw error;
    }
  },
  
  // Get activities by action
  getByAction: async (action: string): Promise<ActivityItem[]> => {
    try {
      const response = await fetch(`/api/activities?action=${action}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities by action');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching activities by action ${action}:`, error);
      throw error;
    }
  },
  
  // Get activities by user
  getByUser: async (username: string): Promise<ActivityItem[]> => {
    try {
      const response = await fetch(`/api/activities?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities by user');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching activities for user ${username}:`, error);
      throw error;
    }
  }
};
