
export interface TeachingSession {
  id: string;
  lop_chi_tiet_id: string;
  session_id: string;
  loai_bai_hoc?: string;
  phong_hoc_id?: string;
  ngay_hoc: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  giao_vien: string;
  tro_giang?: string;
  nhan_xet_1?: string;
  nhan_xet_2?: string;
  nhan_xet_3?: string;
  nhan_xet_4?: string;
  nhan_xet_5?: string;
  nhan_xet_6?: string;
  trung_binh?: number;
  nhan_xet_chung?: string;
  ghi_chu?: string;
  created_at?: string;
  updated_at?: string;
  completed?: string;
  
  class_name?: string;
  teacher_name?: string;
  assistant_name?: string;
  lesson_content?: string;
}
