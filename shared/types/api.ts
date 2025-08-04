// Shared TypeScript interfaces for API responses and data models

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

export interface CreateStudentRequest {
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
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

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

export interface CreateEmployeeRequest {
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
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

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

export interface CreateClassRequest {
  ten_lop: string;
  mo_ta?: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai?: 'dang_mo' | 'da_dong' | 'tam_dung';
  so_hoc_sinh_toi_da?: number;
  co_so_id?: string;
  giao_vien_id?: string;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {}

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

export interface CreateTeachingSessionRequest {
  lop_id: string;
  giao_vien_id: string;
  ngay_day: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  chu_de?: string;
  noi_dung?: string;
  ghi_chu?: string;
  trang_thai?: 'chua_bat_dau' | 'dang_dien_ra' | 'da_ket_thuc' | 'huy_bo';
}

export interface UpdateTeachingSessionRequest extends Partial<CreateTeachingSessionRequest> {}

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

export interface CreateFacilityRequest {
  ten_co_so: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  trang_thai?: 'hoat_dong' | 'tam_dong' | 'dong_cua';
}

export interface UpdateFacilityRequest extends Partial<CreateFacilityRequest> {}

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

export interface CreateAssetRequest {
  ten_tai_san: string;
  loai_tai_san?: string;
  gia_tri?: number;
  ngay_mua?: string;
  trang_thai?: 'tot' | 'can_sua' | 'hong';
  mo_ta?: string;
  co_so_id?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {}

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

export interface CreateTaskRequest {
  tieu_de: string;
  mo_ta?: string;
  trang_thai?: 'chua_bat_dau' | 'dang_thuc_hien' | 'hoan_thanh' | 'huy_bo';
  uu_tien?: 'thap' | 'trung_binh' | 'cao' | 'khan_cap';
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  nguoi_thuc_hien_id?: string;
  nguoi_giao_id?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// Enrollment interfaces
export interface Enrollment {
  id: string;
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  ngay_dang_ky: string;
  trang_thai?: 'dang_hoc' | 'nghi_hoc' | 'chuyen_lop' | 'tot_nghiep';
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEnrollmentRequest {
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  ngay_dang_ky: string;
  trang_thai?: 'dang_hoc' | 'nghi_hoc' | 'chuyen_lop' | 'tot_nghiep';
  ghi_chu?: string;
}

export interface UpdateEnrollmentRequest extends Partial<CreateEnrollmentRequest> {}

// Attendance interfaces
export interface Attendance {
  id: string;
  hoc_sinh_id: string;
  buoi_hoc_id: string;
  trang_thai: 'co_mat' | 'vang_mat' | 'tre' | 'som';
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAttendanceRequest {
  hoc_sinh_id: string;
  buoi_hoc_id: string;
  trang_thai: 'co_mat' | 'vang_mat' | 'tre' | 'som';
  ghi_chu?: string;
}

export interface UpdateAttendanceRequest extends Partial<CreateAttendanceRequest> {}

// File interfaces
export interface FileRecord {
  id: string;
  ten_file: string;
  duong_dan: string;
  loai_file?: string;
  kich_thuoc?: number;
  entity_type?: string;
  entity_id?: string;
  mo_ta?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFileRequest {
  ten_file: string;
  duong_dan: string;
  loai_file?: string;
  kich_thuoc?: number;
  entity_type?: string;
  entity_id?: string;
  mo_ta?: string;
}

export interface UpdateFileRequest extends Partial<CreateFileRequest> {}

// Contact interfaces
export interface Contact {
  id: string;
  ten_lien_he: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  loai_lien_he?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactRequest {
  ten_lien_he: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi?: string;
  loai_lien_he?: string;
  ghi_chu?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

// Request interfaces
export interface Request {
  id: string;
  tieu_de: string;
  noi_dung?: string;
  loai_yeu_cau?: string;
  trang_thai?: 'cho_duyet' | 'da_duyet' | 'tu_choi' | 'hoan_thanh';
  nguoi_gui_id?: string;
  nguoi_duyet_id?: string;
  ngay_gui?: string;
  ngay_duyet?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRequestRequest {
  tieu_de: string;
  noi_dung?: string;
  loai_yeu_cau?: string;
  trang_thai?: 'cho_duyet' | 'da_duyet' | 'tu_choi' | 'hoan_thanh';
  nguoi_gui_id?: string;
  nguoi_duyet_id?: string;
  ngay_gui?: string;
  ngay_duyet?: string;
  ghi_chu?: string;
}

export interface UpdateRequestRequest extends Partial<CreateRequestRequest> {}

// Evaluation interfaces
export interface Evaluation {
  id: string;
  hoc_sinh_id: string;
  buoi_hoc_id: string;
  diem_so?: number;
  nhan_xet?: string;
  loai_danh_gia?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEvaluationRequest {
  hoc_sinh_id: string;
  buoi_hoc_id: string;
  diem_so?: number;
  nhan_xet?: string;
  loai_danh_gia?: string;
}

export interface UpdateEvaluationRequest extends Partial<CreateEvaluationRequest> {}

// Payroll interfaces
export interface Payroll {
  id: string;
  nhan_vien_id: string;
  thang: number;
  nam: number;
  luong_co_ban?: number;
  phu_cap?: number;
  thuong?: number;
  khau_tru?: number;
  luong_thuc_nhan?: number;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePayrollRequest {
  nhan_vien_id: string;
  thang: number;
  nam: number;
  luong_co_ban?: number;
  phu_cap?: number;
  thuong?: number;
  khau_tru?: number;
  luong_thuc_nhan?: number;
  ghi_chu?: string;
}

export interface UpdatePayrollRequest extends Partial<CreatePayrollRequest> {}

// Employee Clock-in interfaces
export interface EmployeeClockIn {
  id: string;
  nhan_vien_id: string;
  ngay: string;
  gio_vao?: string;
  gio_ra?: string;
  tong_gio_lam?: number;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEmployeeClockInRequest {
  nhan_vien_id: string;
  ngay: string;
  gio_vao?: string;
  gio_ra?: string;
  tong_gio_lam?: number;
  ghi_chu?: string;
}

export interface UpdateEmployeeClockInRequest extends Partial<CreateEmployeeClockInRequest> {}

// Admission interfaces
export interface Admission {
  id: string;
  ten_ung_vien: string;
  so_dien_thoai?: string;
  email?: string;
  ngay_sinh?: string;
  dia_chi?: string;
  trang_thai?: 'moi_nop' | 'dang_xu_ly' | 'da_duyet' | 'tu_choi';
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAdmissionRequest {
  ten_ung_vien: string;
  so_dien_thoai?: string;
  email?: string;
  ngay_sinh?: string;
  dia_chi?: string;
  trang_thai?: 'moi_nop' | 'dang_xu_ly' | 'da_duyet' | 'tu_choi';
  ghi_chu?: string;
}

export interface UpdateAdmissionRequest extends Partial<CreateAdmissionRequest> {}

// Image interfaces
export interface Image {
  id: string;
  ten_hinh: string;
  duong_dan: string;
  loai_hinh?: string;
  kich_thuoc?: number;
  entity_type?: string;
  entity_id?: string;
  mo_ta?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateImageRequest {
  ten_hinh: string;
  duong_dan: string;
  loai_hinh?: string;
  kich_thuoc?: number;
  entity_type?: string;
  entity_id?: string;
  mo_ta?: string;
}

export interface UpdateImageRequest extends Partial<CreateImageRequest> {}

// Generic CRUD operation types
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

// Health check interface
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  database: {
    connected: boolean;
    responseTime?: number;
  };
}

// Migration status interface
export interface MigrationStatus {
  postgresAvailable: boolean;
  currentDatabase: string;
  error?: string;
}
