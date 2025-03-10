
export interface Request {
  id: string;
  muc: string;
  noi_dung: string;
  ly_do: string;
  ngay_de_xuat: string;
  so_ngay_nghi?: number;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  ngay_di_lam_lai?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  so_luong?: number;
  tong_so?: number;
  file?: string;
  trang_thai: string;
  ghi_chu?: string;
  nguoi_de_xuat_id: string;
  tg_tao?: string;
}
