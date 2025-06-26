import { Task } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class TaskService {
  async getAll(): Promise<Task[]> {
    try {
      console.log('Fetching all tasks...');
      const tasks = await fetchAll<Task>('tasks');
      console.log('Successfully fetched tasks:', tasks?.length || 0);
      return tasks || [];
    } catch (error) {
      console.error('Error in getAll tasks:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Task | null> {
    try {
      return await fetchById<Task>('tasks', id);
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      return null;
    }
  }

  async getByAssignee(employeeId: string): Promise<Task[]> {
    try {
      const response = await fetch(`/api/tasks?assigneeId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks by assignee');
      }
      return await response.json() || [];
    } catch (error) {
      console.error(`Error fetching tasks for employee ${employeeId}:`, error);
      return [];
    }
  }

  // Method to ensure backward compatibility
  async getByEmployeeId(employeeId: string): Promise<Task[]> {
    return this.getByAssignee(employeeId);
  }

  async create(task: Partial<Task>): Promise<Task | null> {
    try {
      return await insert<Task>('tasks', task);
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      return await update<Task>('tasks', id, updates);
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await remove('tasks', id);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  async complete(id: string): Promise<Task | null> {
    return this.update(id, { 
      trang_thai: 'completed',
      ngay_hoan_thanh: new Date().toISOString()
    });
  }
}

export const taskService = new TaskService();