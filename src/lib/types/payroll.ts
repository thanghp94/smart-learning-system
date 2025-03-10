
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
