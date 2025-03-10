
export interface Finance {
  id: string;
  muc?: string;
  loai_doi_tuong?: string;
  doi_tuong_id?: string;
  co_so?: string;
  ngay?: string;
  loai_thu_chi: string;
  loai_giao_dich?: string; // Transaction type
  dien_giai?: string;
  ten_phi?: string;
  thoi_gian_phai_tra?: string;
  so_luong?: number;
  don_vi?: number;
  gia_tien?: number;
  tong_tien: number;
  bang_chu?: string;
  kieu_thanh_toan?: string;
  hanh_dong?: string;
  tinh_trang?: string;
  ghi_chu?: string;
  nguoi_tao?: string;
  tg_tao?: string;
  tg_hoan_thanh?: string;
  tg_in?: string;
  file_in?: string;
  file_hoa_don_thu_tien?: string;
  net?: number;
  ton_quy?: number;
  created_at?: string;
  updated_at?: string;
}

// New interface for transaction types
export interface FinanceTransactionType {
  id: string;
  category: string; // 'income' or 'expense'
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
