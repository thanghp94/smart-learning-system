
export interface Employee {
  id: string;
  ten_nhan_su: string;
  ten_tieng_anh?: string;
  dien_thoai: string;
  email: string;
  tinh_trang_lao_dong: string;
  dia_chi: string;
  gioi_tinh: string;
  ngay_sinh: string;
  bo_phan: string;
  chuc_danh: string;
  co_so_id: string[];
  hinh_anh?: string;
  tg_tao?: string;
  ghi_chu?: string;
  // Add required fields
  vai_tro?: string;
  co_so_name?: string;
}
