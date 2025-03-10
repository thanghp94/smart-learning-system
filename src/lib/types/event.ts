
export interface Event {
  id: string;
  title?: string; // Added for compatibility
  type?: string; // Added for compatibility
  description?: string; // Added for compatibility
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
  entity_type?: string; // Added for compatibility
  entity_id?: string; // Added for compatibility
  
  // Additional compatibility fields
  start_date?: string;
  location?: string; // Added for compatibility with RequestApprovalButtons
  created_by?: string; // Added for compatibility with RequestApprovalButtons
  status?: string; // Added for compatibility with RequestApprovalButtons
}
