
export interface Student {
  id?: string;
  ten_hoc_sinh?: string;
  ngay_sinh?: Date;
  gioi_tinh?: string;
  dia_chi?: string;
  co_so_id?: string;
  ghi_chu?: string;
  trang_thai?: string;
  ten_PH?: string;
  sdt_ph1?: string;
  email_ph1?: string;
  ct_hoc?: string;
  password?: string;
  parentpassword?: string;
  han_hoc_phi?: Date;
  ngay_bat_dau_hoc_phi?: Date;
  
  // Additional fields used in components
  ho_va_ten?: string; // For backward compatibility
  ma_hoc_sinh?: string;
  email?: string;
  so_dien_thoai?: string;
  truong?: string;
  lop?: string;
  nguon_den?: string;
  mo_ta_tinh_cach?: string;
  diem_manh?: string;
  ten_phu_huynh?: string;
  hinh_anh_hoc_sinh?: string;
  anh_minh_hoc?: string;
  trang_thai_hp?: string;
  trang_thai_hoc_phi?: string;
}

export interface TuitionDetail {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  expired_date: string;
  notes?: string;
}
