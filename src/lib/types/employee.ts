
export interface Employee {
  id: string;
  ten_nhan_su: string;
  dien_thoai?: string;
  email?: string;
  ten_tieng_anh?: string;
  dia_chi?: string;
  gioi_tinh?: string;
  ngay_sinh?: string | Date;
  hinh_anh?: string;
  chuc_danh?: string;
  bo_phan?: string;
  co_so_id?: string[] | string;
  tg_tao?: string;
  created_at?: string;
  updated_at?: string;
  ghi_chu?: string;
  tinh_trang_lao_dong?: string;
  chuc_vu?: string;
  phong_ban?: string;
}
