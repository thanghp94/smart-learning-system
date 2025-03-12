
export interface EmployeeClockInOut {
  id: string;
  nhan_vien_id: string;
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  trang_thai: string; // Changed from optional to required
  xac_nhan?: boolean;
  ghi_chu?: string;
  buoi_day_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields used in components
  employee_name?: string;
  session?: string;
}

export interface MonthlyAttendanceSummary {
  employee_id: string;
  employee_name?: string;
  attendance_date?: string;
  status?: string;
}
