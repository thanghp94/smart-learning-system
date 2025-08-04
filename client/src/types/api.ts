// Client-side TypeScript interfaces for API responses and data models

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: ValidationError[];
  stack?: string;
}

// Filter and sort interfaces
export interface FilterOptions {
  [key: string]: string | number | boolean | undefined;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  filters?: FilterOptions;
  sort?: SortOptions;
  search?: string;
}

// Student interfaces
export interface Student {
  id: string;
  ten_hoc_sinh: string;
  ten_ngan?: string;
  ngay_sinh?: string;
  gioi_tinh?: 'nam' | 'nu' | 'khac';
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  trang_thai?: 'dang_hoc' | 'nghi_hoc' | 'tot_nghiep';
  co_so_id?: string;
  ghi_chu?: string;
  hinh_anh?: string;
  created_at?: string;
  updated_at?: string;
}

// Employee interfaces
export interface Employee {
  id: string;
  ten_nhan_vien: string;
  ten_ngan?: string;
  bo_phan?: string;
  chuc_vu?: string;
  so_dien_thoai?: string;
  email?: string;
  co_so_id?: string;
  trang_thai?: 'dang_lam' | 'nghi_viec' | 'tam_nghi';
  ngay_sinh?: string;
  dia_chi?: string;
  gioi_tinh?: 'nam' | 'nu' | 'khac';
  ghi_chu?: string;
  hinh_anh?: string;
  created_at?: string;
  updated_at?: string;
}

// Class interfaces
export interface Class {
  id: string;
  ten_lop: string;
  mo_ta?: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai?: 'dang_mo' | 'da_dong' | 'tam_dung';
  so_hoc_sinh_toi_da?: number;
  co_so_id?: string;
  giao_vien_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Teaching Session interfaces
export interface TeachingSession {
  id: string;
  lop_id: string;
  giao_vien_id: string;
  ngay_day: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  chu_de?: string;
  noi_dung?: string;
  ghi_chu?: string;
  trang_thai?: 'chua_bat_dau' | 'dang_dien_ra' | 'da_ket_thuc' | 'huy_bo';
  created_at?: string;
  updated_at?: string;
}

// Facility interfaces
export interface Facility {
  id: string;
  ten_co_so: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  trang_thai?: 'hoat_dong' | 'tam_dong' | 'dong_cua';
  created_at?: string;
  updated_at?: string;
}

// Asset interfaces
export interface Asset {
  id: string;
  ten_tai_san: string;
  loai_tai_san?: string;
  gia_tri?: number;
  ngay_mua?: string;
  trang_thai?: 'tot' | 'can_sua' | 'hong';
  mo_ta?: string;
  co_so_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Task interfaces
export interface Task {
  id: string;
  tieu_de: string;
  mo_ta?: string;
  trang_thai?: 'chua_bat_dau' | 'dang_thuc_hien' | 'hoan_thanh' | 'huy_bo';
  uu_tien?: 'thap' | 'trung_binh' | 'cao' | 'khan_cap';
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  nguoi_thuc_hien_id?: string;
  nguoi_giao_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Generic entity type
export type EntityType = 
  | 'students' 
  | 'employees' 
  | 'classes' 
  | 'teaching-sessions'
  | 'facilities'
  | 'assets'
  | 'tasks'
  | 'enrollments'
  | 'attendances'
  | 'files'
  | 'contacts'
  | 'requests'
  | 'evaluations'
  | 'payroll'
  | 'employee-clock-ins'
  | 'admissions'
  | 'images';

export type CrudOperation = 'create' | 'read' | 'update' | 'delete';
