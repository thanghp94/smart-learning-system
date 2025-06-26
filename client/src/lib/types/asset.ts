
export interface Asset {
  id: string;
  loai: string;
  danh_muc: string;
  thuong_hieu?: string;
  cau_hinh?: string;
  chat_lieu?: string;
  mau?: string;
  size?: string;
  don_vi: string;
  ten_CSVC: string;
  so_luong: number;
  noi_mua?: string;
  hinh_anh?: string;
  hinh_anh_2?: string;
  mo_ta_1?: string;
  so_seri?: string;
  ngay_mua?: string;
  doi_tuong?: string;
  doi_tuong_id?: string;
  trang_thai_so_huu: string;
  tinh_trang: string;
  trang_thai_so_huu_moi?: string;
  so_luong_chuyen?: number;
  doi_tuong_chuyen?: string;
  noi_chuyen_toi?: string;
  so_tien_mua?: string;
  khu_vuc?: string;
  qr_code?: string;
  ngay_nhap?: string;
  tg_tao?: string;
  ghi_chu?: string;
}

export interface AssetTransfer {
  id: string;
  asset_id: string;
  source_type: string;
  source_id: string;
  destination_type: string;
  destination_id: string;
  quantity: number;
  transfer_date: string;
  status: string;
  notes?: string;
  created_at: string;
}
