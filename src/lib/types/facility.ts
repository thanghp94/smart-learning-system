
export interface Facility {
  id: string;
  ten_co_so: string;
  dia_chi_co_so?: string;
  loai_co_so: string;
  trang_thai?: string;
  nguoi_chu?: string;
  phone?: string;
  email?: string;
  ghi_chu?: string;
  tg_tao?: string;
  created_at?: string;
  updated_at?: string;
  nguoi_phu_trach?: string;
  
  // Additional fields that were missing
  ngay_thanh_lap?: string;
  nguoi_dai_dien?: string;
  so_giay_phep?: string;
  ngay_cap_phep?: string;
  ngan_hang?: string;
  so_tai_khoan?: string;
}
