
export interface EnrollmentWithStudent {
  id: string;
  hoc_sinh_id: string;
  students?: {
    id: string;
    ten_hoc_sinh: string;
    hinh_anh_hoc_sinh: string | null;
    ma_hoc_sinh: string;
  }
}

export interface ProcessedStudent {
  id: string;
  name: string;
  image: string | null;
  code: string;
}
