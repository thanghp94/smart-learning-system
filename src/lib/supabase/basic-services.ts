import { 
  Session, Event, Task, Image, Setting, Payroll, 
  Finance, Evaluation, File, Request, Contact
} from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

// Basic CRUD services for simpler entities
export const sessionService = {
  getAll: () => fetchAll<Session>('sessions'),
  getById: (id: string) => fetchById<Session>('sessions', id),
  create: (session: Partial<Session>) => insert<Session>('sessions', session),
  update: (id: string, updates: Partial<Session>) => update<Session>('sessions', id, updates),
  delete: (id: string) => remove('sessions', id)
};

export const eventService = {
  getAll: () => fetchAll<Event>('events'),
  getById: (id: string) => fetchById<Event>('events', id),
  create: (event: Partial<Event>) => insert<Event>('events', event),
  update: (id: string, updates: Partial<Event>) => update<Event>('events', id, updates),
  delete: (id: string) => remove('events', id)
};

export const taskService = {
  getAll: () => fetchAll<Task>('tasks'),
  getById: (id: string) => fetchById<Task>('tasks', id),
  create: (task: Partial<Task>) => insert<Task>('tasks', task),
  update: (id: string, updates: Partial<Task>) => update<Task>('tasks', id, updates),
  delete: (id: string) => remove('tasks', id),
  getByAssignee: async (employeeId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_phu_trach', employeeId);
    
    if (error) {
      console.error('Error fetching tasks by assignee:', error);
      throw error;
    }
    
    return data as Task[];
  }
};

export const imageService = {
  getAll: () => fetchAll<Image>('images'),
  getById: (id: string) => fetchById<Image>('images', id),
  create: (image: Partial<Image>) => insert<Image>('images', image),
  update: (id: string, updates: Partial<Image>) => update<Image>('images', id, updates),
  delete: (id: string) => remove('images', id)
};

export const settingService = {
  getAll: () => fetchAll<Setting>('settings'),
  getById: (id: string) => fetchById<Setting>('settings', id),
  create: (setting: Partial<Setting>) => insert<Setting>('settings', setting),
  update: (id: string, updates: Partial<Setting>) => update<Setting>('settings', id, updates),
  delete: (id: string) => remove('settings', id)
};

export const payrollService = {
  getAll: () => fetchAll<Payroll>('payrolls'),
  getById: (id: string) => fetchById<Payroll>('payrolls', id),
  create: (payroll: Partial<Payroll>) => insert<Payroll>('payrolls', payroll),
  update: (id: string, updates: Partial<Payroll>) => update<Payroll>('payrolls', id, updates),
  delete: (id: string) => remove('payrolls', id)
};

export const financeService = {
  getAll: () => fetchAll<Finance>('finances'),
  getById: (id: string) => fetchById<Finance>('finances', id),
  create: (finance: Partial<Finance>) => insert<Finance>('finances', finance),
  update: (id: string, updates: Partial<Finance>) => update<Finance>('finances', id, updates),
  delete: (id: string) => remove('finances', id)
};

export const evaluationService = {
  getAll: () => fetchAll<Evaluation>('evaluations'),
  getById: (id: string) => fetchById<Evaluation>('evaluations', id),
  create: (evaluation: Partial<Evaluation>) => insert<Evaluation>('evaluations', evaluation),
  update: (id: string, updates: Partial<Evaluation>) => update<Evaluation>('evaluations', id, updates),
  delete: (id: string) => remove('evaluations', id)
};

export const fileService = {
  getAll: () => fetchAll<File>('files'),
  getById: (id: string) => fetchById<File>('files', id),
  create: (file: Partial<File>) => insert<File>('files', file),
  update: (id: string, updates: Partial<File>) => update<File>('files', id, updates),
  delete: (id: string) => remove('files', id)
};

export const requestService = {
  getAll: () => fetchAll<Request>('requests'),
  getById: (id: string) => fetchById<Request>('requests', id),
  create: (request: Partial<Request>) => insert<Request>('requests', request),
  update: (id: string, updates: Partial<Request>) => update<Request>('requests', id, updates),
  delete: (id: string) => remove('requests', id)
};

export const contactService = {
  getAll: () => fetchAll<Contact>('contacts'),
  getById: (id: string) => fetchById<Contact>('contacts', id),
  create: (contact: Partial<Contact>) => insert<Contact>('contacts', contact),
  update: (id: string, updates: Partial<Contact>) => update<Contact>('contacts', id, updates),
  delete: (id: string) => remove('contacts', id)
};
