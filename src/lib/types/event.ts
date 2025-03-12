
export interface Event {
  id: string;
  ten_su_kien: string;
  loai_su_kien: string;
  ngay_bat_dau: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  dia_diem?: string;
  hinh_anh?: string;
  danh_muc_su_kien?: string;
  doi_tuong_id?: string;
  vi_tri_tuyen_dung?: string;
  nhan_su_phu_trach?: string[];
  trang_thai?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
  
  // Fields used in other components
  title?: string;
  entity_type?: string;
  entity_id?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  status?: string;
  mieu_ta?: string;
}
