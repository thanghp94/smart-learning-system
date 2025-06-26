
import { Class } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from '../../base-service';

export const classService = {
  async getAll() {
    try {
      console.log('Fetching classes with student count...');
      const classes = await fetchAll<Class>('classes');
      console.log('Classes data received:', classes);
      console.log('Classes set to state:', classes.length);
      return classes;
    } catch (error) {
      console.error('Error in fetchClassesWithStudentCount:', error);
      console.error('Falling back to regular class fetch due to error');
      console.log('Executing fallback class fetch');
      try {
        const fallbackClasses = await fetchAll<Class>('classes');
        console.log('Classes data received:', fallbackClasses);
        console.log('Classes set to state:', fallbackClasses.length);
        return fallbackClasses;
      } catch (fallbackError) {
        console.error('Error in fallback class fetch:', fallbackError);
        throw fallbackError;
      }
    }
  },

  async getById(id: string) {
    return fetchById<Class>('classes', id);
  },

  async create(classData: Partial<Class>) {
    return insert<Class>('classes', classData);
  },

  async update(id: string, updates: Partial<Class>) {
    return update<Class>('classes', id, updates);
  },

  async delete(id: string) {
    return remove('classes', id);
  },

  // Additional methods for class-specific operations
  async getByFacility(facilityId: string): Promise<Class[]> {
    try {
      const response = await fetch(`/api/classes?facilityId=${facilityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes by facility');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching classes by facility:', error);
      throw error;
    }
  },

  async getByTeacher(teacherId: string): Promise<Class[]> {
    try {
      const response = await fetch(`/api/classes?teacherId=${teacherId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes by teacher');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching classes by teacher:', error);
      throw error;
    }
  },

  async getWithStudentCount(): Promise<Class[]> {
    try {
      const response = await fetch('/api/classes?includeStudentCount=true');
      if (!response.ok) {
        throw new Error('Failed to fetch classes with student count');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching classes with student count:', error);
      throw error;
    }
  },
};
