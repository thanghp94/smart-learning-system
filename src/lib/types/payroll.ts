
export interface Payroll {
  id: string;
  nhan_su_id: string;
  co_so_id?: string;
  thang?: string;
  nam?: string;
  ngay?: string;
  trang_thai?: string;
  luong?: number;
  luong_bh?: number;
  pc_tnhiem?: number;
  pc_an_o?: number;
  pc_dthoai?: number;
  pc_xang_xe?: number;
  cong_chuan?: number;
  cong_thuc_lam?: number;
  tong_luong_theo_gio?: number;
  tong_luong_thuc_te?: number;
  tong_luong_tru_bh?: number;
  bhxh_nv?: number;
  bhyt_nv?: number;
  bhtn_nv?: number;
  tong_bh_nv?: number;
  bhxh_dn?: number;
  bhyt_dn?: number;
  tong_bh_dn_tra?: number;
  tong_chi_dn?: number;
  tong_thu_nhap?: number;
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
}
