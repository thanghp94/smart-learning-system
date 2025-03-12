
export interface Enrollment {
  id: string;
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  tinh_trang_diem_danh?: string;
  ghi_chu?: string;
  buoi_day_id?: string;
  nhan_xet_tieu_chi_1?: string;
  nhan_xet_tieu_chi_2?: string;
  nhan_xet_tieu_chi_3?: string;
  chon_de_danh_gia?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Fields used in components
  ten_hoc_sinh?: string;
  ten_lop?: string;
  ten_lop_full?: string;
  ct_hoc?: string;
  tong_tien?: string | number;
}
