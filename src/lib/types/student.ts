
export interface Student {
  id: string;
  ten_hoc_sinh?: string;
  ngay_sinh?: Date;
  gioi_tinh?: string; 
  dia_chi?: string;
  co_so_id?: string;
  sdt_ph1?: string;
  ten_PH?: string;
  email_ph1?: string;
  ct_hoc?: string;
  trang_thai?: string;
  ghi_chu?: string;
  password?: string;
  parentpassword?: string;
  han_hoc_phi?: Date;
  ngay_bat_dau_hoc_phi?: Date;
  
  // Image fields
  anh_minh_hoc?: string;
  hinh_anh_hoc_sinh?: string;
  
  // Additional properties that were missing
  created_at?: string;
  updated_at?: string;
  sdt_ph2?: string;
  email_ph2?: string;
  ma_so_thue?: string;
  ngay_nhap_hoc?: Date;
  hoc_phi_thang?: number;
  ngay_phai_dong_hp?: string;
  trang_thai_hp?: string;
  mien_giam_hp?: string;
  thong_tin_hoc_phi?: string;
  ghi_chu_hp?: string;
}

export interface StudentInfoTabProps {
  student: Student;
  isEditing: boolean;
  tempStudentData: Student;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => Promise<void>;
  facilityName: string;
}
