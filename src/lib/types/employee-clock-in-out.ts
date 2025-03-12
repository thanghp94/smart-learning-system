
export interface EmployeeClockInOut {
  id: string;
  nhan_vien_id: string;
  employee_name?: string;
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  buoi_day_id?: string;
  xac_nhan?: boolean;
  ghi_chu?: string;
  trang_thai?: string;
  created_at?: string;
  updated_at?: string;
  // Fields for TodayAttendance component
  thoi_gian_vao?: string;
  thoi_gian_ra?: string;
  nhan_su_id?: string;
  gio_vao?: string;
  gio_ra?: string;
}

export interface MonthlyAttendanceSummary {
  employee_id: string;
  employee_name: string;
  attendance_date: string;
  day_of_month: number;
  status: string;
  present_count: number;
  absent_count: number;
  late_count: number;
}
