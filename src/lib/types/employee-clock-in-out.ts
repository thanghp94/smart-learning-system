
export interface EmployeeClockInOut {
  id: string;
  nhan_vien_id: string;
  employee_id?: string; // For backward compatibility
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  trang_thai?: string;
  ghi_chu?: string;
  xac_nhan?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields used in components
  gio_vao?: string;
  gio_ra?: string;
  employee_name?: string;
  
  // Fields used in DailyAttendance
  employee_image?: string;
  position?: string;
  department?: string;
  class_name?: string;
}

export interface MonthlyAttendanceSummary {
  employee_id: string;
  employee_name: string;
  total_days_present: number;
  total_days_absent: number;
  total_days_late: number;
  total_hours_worked: number;
  month: number;
  year: number;
  details?: EmployeeClockInOut[];
  
  // Fields used in MonthlyAttendanceView
  present_count?: number;
  absent_count?: number;
  late_count?: number;
  day_of_month?: number;
  status?: string;
  attendance_date?: string;
}

export interface TodayAttendanceProps {
  employeeId: string;
  employeeName: string;
}
