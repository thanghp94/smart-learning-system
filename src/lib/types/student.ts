
export interface Student {
  id: string;
  ma_hoc_sinh?: string;
  ho_va_ten: string;
  ten_hoc_sinh?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  dia_chi?: string;
  anh_minh_hoc?: string;
  hinh_anh_hoc_sinh?: string;
  trang_thai?: string;
  ten_ph?: string;
  ten_PH?: string;
  ten_phu_huynh?: string;
  so_dien_thoai?: string;
  sdt_ph1?: string;
  email_ph1?: string;
  email?: string;
  email_ph2?: string;
  truong?: string;
  lop?: string;
  nguon_den?: string;
  mo_ta_tinh_cach?: string;
  diem_manh?: string;
  ghi_chu?: string;
  co_so_id?: string;
  ct_hoc?: string;
  han_hoc_phi?: string;
  ngay_bat_dau_hoc_phi?: string;
  password?: string;
  parentpassword?: string;
  created_at?: string;
  updated_at?: string;
  trang_thai_hoc_phi?: string; // Adding field for tuition status
}
