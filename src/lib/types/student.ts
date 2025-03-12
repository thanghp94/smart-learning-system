
export interface Student {
  id: string;
  ten_hoc_sinh: string;
  ten_PH?: string;
  sdt_ph1?: string;
  email_ph1?: string;
  gioi_tinh?: string;
  ngay_sinh?: string | Date;
  dia_chi?: string;
  co_so_id?: string;
  trang_thai?: string;
  password?: string;
  ct_hoc?: string;
  mo_ta_hs?: string;
  userid?: string;
  parentid?: string;
  parentpassword?: string;
  hinh_anh_hoc_sinh?: string;
  created_at?: string;
  updated_at?: string;
  han_hoc_phi?: string | Date;
  ngay_bat_dau_hoc_phi?: string | Date;
  
  // Additional fields for components
  anh_minh_hoc?: string;
  email?: string;
  so_dien_thoai?: string;
  ten_phu_huynh?: string;
  ho_va_ten?: string;
  ma_hoc_sinh?: string;
  nguon_den?: string;
  truong?: string;
  lop?: string;
  mo_ta_tinh_cach?: string;
  diem_manh?: string;
  trang_thai_hp?: string;
  trang_thai_hoc_phi?: string;
}
