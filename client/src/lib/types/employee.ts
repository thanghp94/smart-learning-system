
export interface Employee {
  id: string;
  ten_nhan_vien: string;
  email?: string;
  so_dien_thoai?: string;
  gioi_tinh?: string;
  dia_chi?: string;
  bo_phan?: string;
  chuc_vu?: string;
  ngay_sinh?: Date | string;
  co_so_id?: string[] | string;
  trang_thai?: string;
  hinh_anh?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  ten_tieng_anh?: string;
  
  // Additional fields for contract management
  luong_co_ban?: number | string;
  ngay_vao_lam?: Date | string;
}
