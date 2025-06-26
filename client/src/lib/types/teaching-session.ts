
export interface TeachingSession {
  id: string;
  lop_chi_tiet_id?: string;
  giao_vien?: string;
  ghi_chu?: string;
  trang_thai?: string;
  ngay_day?: string;
  buoi_hoc_so?: string;
  
  // Required fields
  session_id?: string;
  ngay_hoc?: string;
  loai_bai_hoc?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  nhan_xet_1?: string | null;
  nhan_xet_2?: string | null;
  nhan_xet_3?: string | null;
  nhan_xet_4?: string | null;
  nhan_xet_5?: string | null;
  nhan_xet_6?: string | null;
  nhan_xet_chung?: string | null;
  trung_binh?: number | null;
  phong_hoc_id?: string;
  tro_giang?: string;
  
  // Fields for ClassDetail.tsx
  lesson_content?: string;
  teacher_name?: string;
  completed?: boolean;
  class_name?: string;
  
  classes?: {
    id: string;
    ten_lop_full?: string;
    ten_lop?: string;
    co_so?: string;
    gv_chinh?: string;
  };
  
  // Added fields for evaluation
  danh_gia_buoi_hoc?: string;
  diem_manh?: string;
  diem_yeu?: string;
  ghi_chu_danh_gia?: string;
  co_so_id?: string;
  noi_dung?: string;
  assistant_name?: string;
}
