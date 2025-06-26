
export interface Employee {
  id: string;
  ten_nhan_su: string;
  email?: string;
  dien_thoai?: string;
  gioi_tinh?: string;
  dia_chi?: string;
  bo_phan?: string;
  chuc_danh?: string;
  ngay_sinh?: Date | string;
  co_so_id?: string[] | string;
  tinh_trang_lao_dong?: string;
  hinh_anh?: string;
  ghi_chu?: string;
  tg_tao?: string;
  created_at?: string;
  updated_at?: string;
  ten_tieng_anh?: string;
  vai_tro?: string;
  co_so_name?: string;
  
  // Additional fields for contract management
  luong_co_ban?: number | string;
  ngay_vao_lam?: Date | string;
}
