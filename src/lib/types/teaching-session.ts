
export interface TeachingSession {
  id: string;
  lop_chi_tiet_id?: string;
  giao_vien?: string;
  ghi_chu?: string;
  trang_thai?: string;
  ngay_day?: string;
  buoi_hoc_so?: string;
  classes?: {
    id: string;
    ten_lop_full?: string;
    ten_lop?: string;
    co_so?: string;
    gv_chinh?: string;
  };
}
