
export interface Student {
  id: string;
  ten_hoc_sinh: string;
  gioi_tinh: string;
  ngay_sinh: string;
  co_so_ID: string;
  ten_PH: string;
  sdt_ph1: string;
  email_ph1: string;
  dia_chi: string;
  ct_hoc: string;
  trang_thai: string;
  hinh_anh_hoc_sinh?: string;
  han_hoc_phi?: string;
  mo_ta_hs?: string;
  userID?: string;
  Password?: string;
  ParentID?: string;
  ParentPassword?: string;
  ngay_bat_dau_hoc_phi?: string;
}

export interface Class {
  id: string;
  Ten_lop_full: string;
  ten_lop: string;
  ct_hoc: string;
  co_so: string;
  GV_chinh: string;
  ngay_bat_dau: string;
  tinh_trang: string;
  ghi_chu?: string;
  unit_id?: string;
  tg_tao?: string;
  so_hs?: number;
}

export interface TeachingSession {
  id: string;
  lop_chi_tiet_id: string;
  session_id: string;
  Loai_bai_hoc: string;
  ngay_hoc: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  giao_vien: string;
  tro_giang?: string;
  nhan_xet_chung?: string;
  ghi_chu?: string;
  phong_hoc_id?: string;
  nhan_xet_1?: string;
  nhan_xet_2?: string;
  nhan_xet_3?: string;
  nhan_xet_4?: string;
  nhan_xet_5?: string;
  nhan_xet_6?: string;
  trung_binh?: number;
}

export interface Employee {
  id: string;
  ten_nhan_su: string;
  ten_tieng_anh?: string;
  dien_thoai: string;
  email: string;
  tinh_trang_lao_dong: string;
  dia_chi: string;
  gioi_tinh: string;
  ngay_sinh: string;
  bo_phan: string;
  chuc_danh: string;
  co_so_id: string[];
  hinh_anh?: string;
  tg_tao?: string;
}

export interface Facility {
  id: string;
  loai_co_so: string;
  ten_co_so: string;
  dia_chi_co_so: string;
  phone: string;
  email?: string;
  nguoi_phu_trach: string;
  trang_thai: string;
  nguoi_chu?: string;
  ghi_chu?: string;
  tg_tao?: string;
}

export interface Enrollment {
  id: string;
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  buoi_day_id?: string;
  tinh_trang_diem_danh: string;
  ghi_chu?: string;
  nhan_xet_tieu_chi_1?: string;
  nhan_xet_tieu_chi_2?: string;
  nhan_xet_tieu_chi_3?: string;
  chon_de_danh_gia?: boolean;
}

export interface ActivityItem {
  id: string;
  action: string;
  type: string;
  name: string;
  user: string;
  timestamp: string;
  status?: string;
}

export interface Session {
  id: string;
  unit_id: string;
  buoi_hoc_so: string;
  tsi_lesson_plan?: string;
  noi_dung_bai_hoc: string;
  rep_lesson_plan?: string;
  bai_tap?: string;
  tg_tao?: string;
}

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

export interface Task {
  id: string;
  doi_tuong: string;
  doi_tuong_id: string;
  loai_viec: string;
  dien_giai: string;
  nguoi_phu_trach: string;
  ten_viec: string;
  ghi_chu?: string;
  ngay_den_han: string;
  cap_do: string;
  trang_thai: string;
  ngay_hoan_thanh?: string;
  tg_tao?: string;
}

export interface Image {
  id: string;
  caption?: string;
  doi_tuong: string;
  doi_tuong_id: string;
  ten_anh: string;
  image?: string;
  video?: string;
  tg_tao?: string;
}

export interface Setting {
  id: string;
  bo_phan: string;
  quy_trinh: string;
  hang_muc: string;
  hien_thi: string;
  tuy_chon?: string;
  tuy_chon_2?: string;
  video?: string;
  mo_ta?: string;
  list_column_show_if?: string[];
  file?: string;
}

export interface Payroll {
  id: string;
  nhan_su_id: string;
  nam: string;
  thang: string;
  ngay: string;
  co_so_id: string;
  tong_luong_tru_BH: number;
  trang_thai: string;
  luong: number;
  pc_tnhiem?: number;
  pc_an_o?: number;
  pc_dthoai?: number;
  pc_xang_xe?: number;
  tong_thu_nhap: number;
  cong_chuan: number;
  cong_thuc_lam: number;
  tong_luong_theo_gio?: number;
  tong_luong_thuc_te: number;
  luong_bh: number;
  BHXH_DN: number;
  BHYT_DN: number;
  tong_bh_dn_tra: number;
  tong_chi_dn: number;
  BHXH_NV: number;
  BHYT_NV: number;
  BHTN_NV: number;
  tong_BH_nv: number;
  tg_tao?: string;
}

export interface Finance {
  id: string;
  muc: string;
  loai_doi_tuong: string;
  doi_tuong_id: string;
  co_so: string;
  ngay: string;
  loai_thu_chi: string;
  dien_giai: string;
  ten_phi?: string;
  thoi_gian_phai_tra?: string;
  so_luong?: number;
  don_vi?: number;
  gia_tien?: number;
  tong_tien: number;
  bang_chu?: string;
  kieu_thanh_toan: string;
  hanh_dong?: string;
  tinh_trang: string;
  ghi_chu?: string;
  nguoi_tao?: string;
  tg_tao?: string;
  tg_hoan_thanh?: string;
  tg_in?: string;
  file_in?: string;
  file_hoa_don_thu_tien?: string;
  net?: number;
  ton_quy?: number;
}

export interface Evaluation {
  id: string;
  doi_tuong: string;
  ghi_danh_id?: string;
  nhanvien_id?: string;
  ten_danh_gia: string;
  email?: string;
  hinh_anh?: string;
  ngay_dau_dot_danh_gia: string;
  ngay_cuoi_dot_danh_gia: string;
  han_hoan_thanh: string;
  tieu_chi_1?: string;
  tieu_chi_2?: string;
  tieu_chi_3?: string;
  tieu_chi_4?: string;
  tieu_chi_5?: string;
  tieu_chi_6?: string;
  tieu_chi_7?: string;
  nhan_xet_chi_tiet_1?: string;
  nhan_xet_chi_tiet_2?: string;
  nhan_xet_chi_tiet_3?: string;
  nhan_xet_chi_tiet_4?: string;
  nhan_xet_chi_tiet_5?: string;
  nhan_xet_chi_tiet_6?: string;
  nhan_xet_chi_tiet_7?: string;
  nhan_xet_chung?: string;
  nhan_xet_cua_cap_tren?: string;
  nhan_xet_tong_hop?: string;
  trang_thai: string;
  ghi_chu?: string;
  pdf_dg_hoc_sinh?: string;
  tg_tao?: string;
}

export interface File {
  id: string;
  doi_tuong_lien_quan: string;
  ten_doi_tuong: string;
  nhan_vien_ID?: string;
  co_so_id?: string;
  lien_he_id?: string;
  CSVC_ID?: string;
  hoc_sinh_id?: string;
  nhom_tai_lieu: string;
  dien_giai: string;
  ten_tai_lieu: string;
  file1?: string;
  file2?: string;
  anh?: string;
  trang_thai: string;
  ngay_cap?: string;
  tinh_trang_han?: string;
  han_tai_lieu?: string;
  lan_ban_hanh?: string;
  ghi_chu?: string;
  id_tai_lieu?: string;
  tg_tao?: string;
}

export interface Asset {
  id: string;
  loai: string;
  danh_muc: string;
  thuong_hieu?: string;
  cau_hinh?: string;
  chat_lieu?: string;
  mau?: string;
  size?: string;
  don_vi: string;
  ten_CSVC: string;
  so_luong: number;
  noi_mua?: string;
  hinh_anh?: string;
  hinh_anh_2?: string;
  mo_ta_1?: string;
  so_seri?: string;
  ngay_mua?: string;
  doi_tuong?: string;
  doi_tuong_id?: string;
  trang_thai_so_huu: string;
  tinh_trang: string;
  trang_thai_so_huu_moi?: string;
  so_luong_chuyen?: number;
  doi_tuong_chuyen?: string;
  noi_chuyen_toi?: string;
  so_tien_mua?: string;
  khu_vuc?: string;
  qr_code?: string;
  ngay_nhap?: string;
  tg_tao?: string;
  ghi_chu?: string;
}

export interface Request {
  id: string;
  muc: string;
  noi_dung: string;
  ly_do: string;
  ngay_de_xuat: string;
  so_ngay_nghi?: number;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  ngay_di_lam_lai?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  so_luong?: number;
  tong_so?: number;
  file?: string;
  trang_thai: string;
  ghi_chu?: string;
  nguoi_de_xuat_id: string;
  tg_tao?: string;
}

export interface Contact {
  id: string;
  phan_loai: string;
  doi_tuong_id?: string;
  ten_lien_he: string;
  mieu_ta?: string;
  ngay_sinh?: string;
  email?: string;
  sdt?: string;
  khu_vuc_dang_o?: string;
  link_cv?: string;
  trang_thai: string;
  ghi_chu?: string;
}

export interface AssetTransfer {
  id: string;
  asset_id: string;
  source_type: string;
  source_id: string;
  destination_type: string;
  destination_id: string;
  quantity: number;
  transfer_date: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  className?: string;
}

export interface TableColumn {
  title: string;
  key: string;
  render?: (value: any, record: any) => JSX.Element;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn[];
  onRowClick?: (record: T) => void;
  isLoading?: boolean;
  pagination?: {
    pageSize: number;
    current: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
}
