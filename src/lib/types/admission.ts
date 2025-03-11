
export interface Admission {
  id: string;
  ho_ten: string;
  ngay_sinh?: string;
  email?: string;
  so_dien_thoai?: string;
  trang_thai: AdmissionStatus;
  nguoi_phu_trach?: string;
  created_at?: string;
  updated_at?: string;
  dia_chi?: string;
  ghi_chu?: string;
  ngay_lien_he_dau?: string;
  email_phu_huynh?: string;
  so_dien_thoai_phu_huynh?: string;
  ten_phu_huynh?: string;
  gioi_tinh?: string;
  nguon_gioi_thieu?: string;
  ten_hoc_sinh: string;
  zalo?: string;
  mieu_ta_hoc_sinh?: string;
}

export type AdmissionStatus = 'tim_hieu' | 'tu_van' | 'hoc_thu' | 'chot' | 'huy';

export const ADMISSION_STATUS_MAP: Record<AdmissionStatus, string> = {
  'tim_hieu': 'Tìm hiểu',
  'tu_van': 'Tư vấn',
  'hoc_thu': 'Học thử',
  'chot': 'Đã chốt',
  'huy': 'Huỷ'
};

export const ADMISSION_STATUS_COLORS: Record<AdmissionStatus, string> = {
  'tim_hieu': 'bg-blue-100 text-blue-800',
  'tu_van': 'bg-yellow-100 text-yellow-800',
  'hoc_thu': 'bg-purple-100 text-purple-800',
  'chot': 'bg-green-100 text-green-800',
  'huy': 'bg-red-100 text-red-800'
};
