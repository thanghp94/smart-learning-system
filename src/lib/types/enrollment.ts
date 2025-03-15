
export interface Enrollment {
  id: string;
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  buoi_day_id?: string;
  tinh_trang_diem_danh?: string;
  nhan_xet_tieu_chi_1?: string;
  nhan_xet_tieu_chi_2?: string;
  nhan_xet_tieu_chi_3?: string;
  ghi_chu?: string;
  chon_de_danh_gia?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Display fields
  ten_hoc_sinh?: string;
  ten_lop_full?: string;
  ten_lop?: string;
  ct_hoc?: string;
  class_name?: string; // For backward compatibility
  tong_tien?: number;
}
