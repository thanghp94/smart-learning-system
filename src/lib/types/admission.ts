
export interface Admission {
  id: string;
  ten_hoc_sinh: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  email?: string;
  so_dien_thoai?: string;
  ten_phu_huynh?: string;
  email_phu_huynh?: string;
  so_dien_thoai_phu_huynh?: string;
  dia_chi?: string;
  nguon_gioi_thieu?: string;
  zalo?: string;
  mieu_ta_hoc_sinh?: string;
  ghi_chu?: string;
  trang_thai: AdmissionStatus;
  ngay_lien_he_dau?: string;
  ngay_cap_nhat?: string;
  nguoi_phu_trach?: string;
  ten_nguoi_phu_trach?: string;
  created_at?: string;
  updated_at?: string;
}

export type AdmissionStatus = 'tim_hieu' | 'tu_van' | 'hoc_thu' | 'chot';

export const ADMISSION_STATUS_MAP: Record<AdmissionStatus, string> = {
  tim_hieu: 'Tìm hiểu',
  tu_van: 'Tư vấn',
  hoc_thu: 'Học thử',
  chot: 'Chốt'
};

export const ADMISSION_STATUS_COLORS: Record<AdmissionStatus, string> = {
  tim_hieu: 'bg-blue-50 text-blue-600 border-blue-200',
  tu_van: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  hoc_thu: 'bg-purple-50 text-purple-600 border-purple-200',
  chot: 'bg-green-50 text-green-600 border-green-200'
};
