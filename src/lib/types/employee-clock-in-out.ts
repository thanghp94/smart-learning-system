
export interface EmployeeClockInOut {
  id: string;
  nhan_vien_id: string;
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  buoi_day_id?: string;
  xac_nhan: boolean;
  ghi_chu?: string;
  trang_thai?: string; // Make this optional to match the actual data
  created_at?: string;
  updated_at?: string;
}
