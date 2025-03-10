
export interface EmployeeClockInOut {
  id: string;
  nhan_vien_id: string;
  employee_name?: string; // Added this field to match what's being used in the component
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  buoi_day_id?: string;
  xac_nhan?: boolean; // Made optional to match EmployeeClockIn type
  ghi_chu?: string;
  trang_thai?: string;
  created_at?: string;
  updated_at?: string;
}
