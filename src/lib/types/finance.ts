
export interface Finance {
  id: string;
  tong_tien: number;
  loai_thu_chi: string;
  ngay?: string;
  co_so?: string;
  thoi_gian_phai_tra?: string;
  so_luong?: number;
  don_vi?: number;
  gia_tien?: number;
  nguoi_tao?: string;
  net?: number;
  ton_quy?: number;
  ghi_chu?: string;
  tg_in?: string;
  file_in?: string;
  file_hoa_don_thu_tien?: string;
  loai_giao_dich?: string;
  muc?: string;
  loai_doi_tuong?: string;
  doi_tuong_id?: string;
  dien_giai?: string;
  ten_phi?: string;
  bang_chu?: string;
  kieu_thanh_toan?: string;
  hanh_dong?: string;
  tinh_trang?: string;
  tg_tao?: string;
  tg_hoan_thanh?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReceiptTemplate {
  id: string;
  name: string;
  type: string;
  template_html: string;
  description?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
