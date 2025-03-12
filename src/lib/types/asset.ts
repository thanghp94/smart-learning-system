
export interface Asset {
  id: string;
  ten_csvc: string;
  doi_tuong?: string;
  doi_tuong_id?: string;
  doi_tuong_chi_tiet?: string;
  facility_id?: string;
  so_luong?: number;
  don_vi: string;
  tinh_trang?: string;
  trang_thai_so_huu?: string;
  trang_thai_so_huu_moi?: string;
  ngay_mua?: string;
  so_tien_mua?: string;
  noi_mua?: string;
  hinh_anh?: string;
  hinh_anh_2?: string;
  mo_ta_1?: string;
  so_seri?: string;
  ghi_chu?: string;
  qr_code?: string;
  khu_vuc?: string;
  created_at?: string;
  updated_at?: string;
  ngay_nhap?: string;
  tg_tao?: string;
  
  // Additional fields
  loai?: string;
  danh_muc?: string;
  thuong_hieu?: string;
  cau_hinh?: string;
  size?: string;
  chat_lieu?: string;
  mau?: string;
  doi_tuong_chuyen?: string;
  noi_chuyen_toi?: string;
  so_luong_chuyen?: number;
  gia_tri?: number;
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
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
