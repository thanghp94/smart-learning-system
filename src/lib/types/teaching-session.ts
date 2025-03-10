
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
  
  // Additional fields needed by the application
  lop_chi_tiet_id?: string;
  giao_vien?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  session_id?: string;
  loai_bai_hoc?: string;
  nhan_xet_1?: string | null;
  nhan_xet_2?: string | null;
  nhan_xet_3?: string | null;
  nhan_xet_4?: string | null;
  nhan_xet_5?: string | null;
  nhan_xet_6?: string | null;
  trung_binh?: number | null;
  phong_hoc_id?: string;
  tro_giang?: string;
  nhan_xet_chung?: string;
  class_name?: string;
  teacher_name?: string;
  completed?: boolean | string;
  lesson_content?: string;
}
