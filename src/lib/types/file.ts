
export interface File {
  id: string;
  ten_tai_lieu: string;
  id_tai_lieu?: string;
  file1?: string;
  file2?: string;
  anh?: string;
  dien_giai?: string;
  nhom_tai_lieu?: string;
  tinh_trang_han?: string;
  han_tai_lieu?: string;
  ngay_cap?: string;
  doi_tuong_lien_quan: string;
  ten_doi_tuong?: string;
  ghi_chu?: string;
  lan_ban_hanh?: string;
  trang_thai?: string;
  
  // Related entity IDs
  hoc_sinh_id?: string;
  csvc_id?: string;
  lien_he_id?: string;
  co_so_id?: string;
  nhan_vien_id?: string;
  
  // For backward compatibility
  CSVC_ID?: string; // Alias for csvc_id
  nhan_vien_ID?: string; // Alias for nhan_vien_id
  
  created_at?: string;
  updated_at?: string;
  tg_tao?: string;
}
