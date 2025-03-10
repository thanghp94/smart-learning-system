
export interface TeachingSession {
  id: string;
  class_id: string;
  session_number?: number;
  course_id?: string;
  instructor_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  
  // Vietnamese field names for compatibility
  buoi_so?: number;
  unit_name?: string;
  trang_thai?: string;
  ngay_hoc?: string;
  gio_bat_dau?: string;
  gio_ket_thuc?: string;
  noi_dung?: string;
  ghi_chu?: string;
}
