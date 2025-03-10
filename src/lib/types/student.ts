
export interface Student {
  id: string;
  ma_hoc_sinh?: string;
  ho_va_ten: string;
  ten_hoc_sinh?: string; // Added for compatibility
  ngay_sinh?: string;
  gioi_tinh?: string;
  dia_chi?: string;
  anh_minh_hoc?: string;
  hinh_anh_hoc_sinh?: string; // Added for compatibility
  trang_thai?: string;
  ten_ph?: string;
  ten_PH?: string; // Added for compatibility
  so_dien_thoai?: string;
  sdt_ph1?: string; // Added for compatibility
  email_ph1?: string;
  email_ph2?: string;
  truong?: string;
  lop?: string;
  nguon_den?: string;
  mo_ta_tinh_cach?: string;
  diem_manh?: string;
  ghi_chu?: string;
  co_so_id?: string; // Added for compatibility
  ct_hoc?: string; // Added for compatibility
  han_hoc_phi?: string; // Added for compatibility
  ngay_bat_dau_hoc_phi?: string; // Added for compatibility
  password?: string; // Added for compatibility
  parentpassword?: string; // Added for compatibility
  created_at?: string;
  updated_at?: string;
}
