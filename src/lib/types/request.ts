
export interface Request {
  id: string;
  nguoi_de_xuat_id: string;
  noi_dung: string;
  ngay_de_xuat: string;
  muc?: string;
  trang_thai?: string;
  ly_do?: string;
  so_ngay_nghi?: number;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  ngay_di_lam_lai?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  so_luong?: number;
  tong_so?: number;
  file?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;

  // Additional fields used in components
  title?: string;
  type?: string;
  requester?: string;
  description?: string;
  status?: string; 
  priority?: string;
  entity_type?: string;
  entity_id?: string;
  location?: string;
  requested_date?: string;
}
