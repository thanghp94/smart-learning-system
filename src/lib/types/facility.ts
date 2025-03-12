
export interface Facility {
  id: string;
  ten_co_so: string;
  dia_chi_co_so?: string;
  loai_co_so: string;
  nguoi_phu_trach?: string;
  phone?: string;
  email?: string;
  trang_thai?: string;
  ghi_chu?: string;
  nguoi_chu?: string;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
  
  // Additional fields needed by components
  ngay_thanh_lap?: string;
  nguoi_dai_dien?: string;
  so_giay_phep?: string;
  ngay_cap_phep?: string;
  ngan_hang?: string;
  so_tai_khoan?: string;
}
