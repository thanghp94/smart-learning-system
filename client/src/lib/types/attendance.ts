
export interface Attendance {
  id: string;
  teaching_session_id: string;
  enrollment_id: string;
  status: string;
  thoi_gian_tre?: number;
  danh_gia_1?: number;
  danh_gia_2?: number;
  danh_gia_3?: number;
  danh_gia_4?: number;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceWithDetails extends Attendance {
  ten_hoc_sinh?: string;
  hoc_sinh_id?: string;
  ten_lop_full?: string;
  ngay_hoc?: string;
  lop_id?: string;
  thoi_gian_bat_dau?: string;
}
