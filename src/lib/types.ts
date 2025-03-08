
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
}

export interface Enrollment {
  id: string;
  hoc_sinh_id: string;
  lop_chi_tiet_id: string;
  buoi_day_id?: string;
  tinh_trang_diem_danh: string;
  ghi_chu?: string;
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
