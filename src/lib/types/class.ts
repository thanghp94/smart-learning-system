
export interface Class {
  id: string;
  ten_lop: string;
  ma_lop?: string;
  mo_ta?: string;
  loai_lop?: string;
  trang_thai?: string;
  trang_thai_lop?: string;
  co_so_id?: string;
  facility_id?: string; // For backward compatibility
  co_so_ten?: string;
  facility_name?: string; // For backward compatibility
  so_buoi_hoc?: number;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  gio_hoc?: string;
  thu_hoc?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  hoc_phi?: number;
  giao_vien_id?: string;
  teacher_id?: string; // For backward compatibility
  ten_giao_vien?: string;
  
  // Added fields to match usage in components
  ten_lop_full?: string;
  Ten_lop_full?: string; // Some components are using capitalized version
  ct_hoc?: string;
  co_so?: string;
  gv_chinh?: string;
  ngay_bat_dau?: string;
  tinh_trang?: string;
  unit_id?: string;
  teacher_name?: string;
}

export interface ClassDetail extends Class {
  students_count?: number;
  sessions_count?: number;
  giao_vien_ten?: string;
  teacher_name?: string; // For backward compatibility
  next_session_date?: string;
  last_session_date?: string;
  chu_ky_hoc?: string;
  gio_bat_dau?: string;
  gio_ket_thuc?: string;
}

export interface ClassStudent {
  id: string;
  class_id: string;
  student_id: string;
  ten_hoc_sinh?: string;
  trang_thai?: string;
  created_at?: string;
  updated_at?: string;
  ghi_chu?: string;
}
