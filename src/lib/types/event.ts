
export interface Event {
  id: string;
  loai_su_kien: string;
  danh_muc_su_kien: string;
  doi_tuong_id: string;
  ten_su_kien: string;
  dia_diem: string;
  ngay_bat_dau: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  vi_tri_tuyen_dung?: string;
  nhan_su_phu_trach?: string[];
  ghi_chu?: string;
  hinh_anh?: string;
  trang_thai: string;
  tg_tao?: string;
}
