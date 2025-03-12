
// Default empty session for new evaluation forms
export const DEFAULT_EMPTY_SESSION = {
  id: '',
  lop_chi_tiet_id: '',
  session_id: '',
  loai_bai_hoc: '',
  ngay_hoc: new Date().toISOString().split('T')[0],
  thoi_gian_bat_dau: '09:00',
  thoi_gian_ket_thuc: '10:30',
  giao_vien: '',
  nhan_xet_1: null,
  nhan_xet_2: null,
  nhan_xet_3: null,
  nhan_xet_4: null,
  nhan_xet_5: null,
  nhan_xet_6: null,
  trung_binh: null,
  phong_hoc_id: null,
  tro_giang: null,
  nhan_xet_chung: null,
  ghi_chu: null
};
