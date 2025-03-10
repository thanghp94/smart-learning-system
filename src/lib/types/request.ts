
export interface Request {
  id: string;
  nguoi_de_xuat_id: string;
  ngay_de_xuat: string | Date;
  noi_dung: string;
  ngay_bat_dau?: string | Date;
  ngay_ket_thuc?: string | Date;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  so_ngay_nghi?: number;
  ngay_di_lam_lai?: string | Date;
  ly_do?: string;
  trang_thai: string;
  ghi_chu?: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
  muc?: string;
  so_luong?: number;
  tong_so?: number;
}
