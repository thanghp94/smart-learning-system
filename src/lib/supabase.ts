import { createClient } from '@supabase/supabase-js';
import { 
  Student, Class, TeachingSession, Employee, 
  Facility, Enrollment, Session, Event,
  Task, Image, Setting, Payroll, Finance,
  Evaluation, File, Asset, Request, Contact,
  AssetTransfer
} from './types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Generic fetch function for any table
const fetchAll = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    throw error;
  }
  
  return data as T[];
};

// Generic fetch by ID
const fetchById = async <T>(table: string, id: string): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching ${table} by ID:`, error);
    throw error;
  }
  
  return data as T;
};

// Generic insert function
const insert = async <T>(table: string, record: Partial<T>): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single();
  
  if (error) {
    console.error(`Error inserting to ${table}:`, error);
    throw error;
  }
  
  return data as T;
};

// Generic update function
const update = async <T>(table: string, id: string, updates: Partial<T>): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
  
  return data as T;
};

// Generic delete function
const remove = async (table: string, id: string): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
};

// Specialized services for each table
export const studentService = {
  getAll: () => fetchAll<Student>('students'),
  getById: (id: string) => fetchById<Student>('students', id),
  create: (student: Partial<Student>) => insert<Student>('students', student),
  update: (id: string, updates: Partial<Student>) => update<Student>('students', id, updates),
  delete: (id: string) => remove('students', id),
  getByFacility: async (facilityId: string): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('co_so_ID', facilityId);
    
    if (error) {
      console.error('Error fetching students by facility:', error);
      throw error;
    }
    
    return data as Student[];
  }
};

export const classService = {
  getAll: () => fetchAll<Class>('classes'),
  getById: (id: string) => fetchById<Class>('classes', id),
  create: (classRecord: Partial<Class>) => insert<Class>('classes', classRecord),
  update: (id: string, updates: Partial<Class>) => update<Class>('classes', id, updates),
  delete: (id: string) => remove('classes', id),
  getByFacility: async (facilityId: string): Promise<Class[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('co_so', facilityId);
    
    if (error) {
      console.error('Error fetching classes by facility:', error);
      throw error;
    }
    
    return data as Class[];
  },
  getWithStudentCount: async (): Promise<(Class & { so_hs: number })[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        enrollments:enrollments(count)
      `);
    
    if (error) {
      console.error('Error fetching classes with student count:', error);
      throw error;
    }
    
    return data.map((classItem: any) => ({
      ...classItem,
      so_hs: classItem.enrollments.count || 0
    }));
  }
};

export const teachingSessionService = {
  getAll: () => fetchAll<TeachingSession>('teaching_sessions'),
  getById: (id: string) => fetchById<TeachingSession>('teaching_sessions', id),
  create: (session: Partial<TeachingSession>) => insert<TeachingSession>('teaching_sessions', session),
  update: (id: string, updates: Partial<TeachingSession>) => update<TeachingSession>('teaching_sessions', id, updates),
  delete: (id: string) => remove('teaching_sessions', id),
  getByClass: async (classId: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) {
      console.error('Error fetching teaching sessions by class:', error);
      throw error;
    }
    
    return data as TeachingSession[];
  }
};

export const employeeService = {
  getAll: () => fetchAll<Employee>('employees'),
  getById: (id: string) => fetchById<Employee>('employees', id),
  create: (employee: Partial<Employee>) => insert<Employee>('employees', employee),
  update: (id: string, updates: Partial<Employee>) => update<Employee>('employees', id, updates),
  delete: (id: string) => remove('employees', id),
  getByFacility: async (facilityId: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .contains('co_so_id', [facilityId]);
    
    if (error) {
      console.error('Error fetching employees by facility:', error);
      throw error;
    }
    
    return data as Employee[];
  },
  getByRole: async (role: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('chuc_danh', role);
    
    if (error) {
      console.error('Error fetching employees by role:', error);
      throw error;
    }
    
    return data as Employee[];
  }
};

// Export all other services
export const facilityService = {
  getAll: () => fetchAll<Facility>('facilities'),
  getById: (id: string) => fetchById<Facility>('facilities', id),
  create: (facility: Partial<Facility>) => insert<Facility>('facilities', facility),
  update: (id: string, updates: Partial<Facility>) => update<Facility>('facilities', id, updates),
  delete: (id: string) => remove('facilities', id)
};

export const enrollmentService = {
  getAll: () => fetchAll<Enrollment>('enrollments'),
  getById: (id: string) => fetchById<Enrollment>('enrollments', id),
  create: (enrollment: Partial<Enrollment>) => insert<Enrollment>('enrollments', enrollment),
  update: (id: string, updates: Partial<Enrollment>) => update<Enrollment>('enrollments', id, updates),
  delete: (id: string) => remove('enrollments', id),
  getByClass: async (classId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) {
      console.error('Error fetching enrollments by class:', error);
      throw error;
    }
    
    return data as Enrollment[];
  },
  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('hoc_sinh_id', studentId);
    
    if (error) {
      console.error('Error fetching enrollments by student:', error);
      throw error;
    }
    
    return data as Enrollment[];
  }
};

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

// Export all other services with their basic CRUD operations
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

export const assetService = {
  getAll: () => fetchAll<Asset>('assets'),
  getById: (id: string) => fetchById<Asset>('assets', id),
  create: (asset: Partial<Asset>) => insert<Asset>('assets', asset),
  update: (id: string, updates: Partial<Asset>) => update<Asset>('assets', id, updates),
  delete: (id: string) => remove('assets', id)
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

export const assetTransferService = {
  getAll: () => fetchAll<AssetTransfer>('asset_transfers'),
  getById: (id: string) => fetchById<AssetTransfer>('asset_transfers', id),
  create: (transfer: Partial<AssetTransfer>) => insert<AssetTransfer>('asset_transfers', transfer),
  update: (id: string, updates: Partial<AssetTransfer>) => update<AssetTransfer>('asset_transfers', id, updates),
  delete: (id: string) => remove('asset_transfers', id),
  
  transferAsset: async (
    assetId: string, 
    sourceType: string, 
    sourceId: string, 
    destinationType: string, 
    destinationId: string, 
    quantity: number, 
    notes?: string
  ): Promise<AssetTransfer> => {
    // Start a transaction
    const transfer: Partial<AssetTransfer> = {
      asset_id: assetId,
      source_type: sourceType,
      source_id: sourceId,
      destination_type: destinationType,
      destination_id: destinationId,
      quantity: quantity,
      transfer_date: new Date().toISOString(),
      status: 'completed',
      notes: notes,
      created_at: new Date().toISOString()
    };
    
    // Create the transfer record
    const newTransfer = await insert<AssetTransfer>('asset_transfers', transfer);
    
    // Update the asset quantity in the source
    // This would require additional logic based on your business rules
    
    return newTransfer;
  }
};

// Add utility to upload files to Supabase storage
export const storageService = {
  uploadFile: async (bucket: string, path: string, file: Blob | ArrayBuffer | ArrayBufferView): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    return data.path;
  },
  
  getPublicUrl: (bucket: string, path: string): string => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
  
  deleteFile: async (bucket: string, path: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Create a function to log activities
export const logActivity = async (
  action: string,
  type: string,
  name: string,
  user: string,
  status?: string
): Promise<void> => {
  const activity = {
    action,
    type,
    name,
    user,
    timestamp: new Date().toISOString(),
    status
  };
  
  const { error } = await supabase
    .from('activities')
    .insert(activity);
  
  if (error) {
    console.error('Error logging activity:', error);
  }
};
