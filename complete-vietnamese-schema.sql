
-- Complete Vietnamese Schema with Row Level Security
-- Copy and paste this entire script into your Supabase SQL Editor

-- Students table (Học sinh)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_hoc_sinh TEXT UNIQUE,
  ten_hoc_sinh TEXT NOT NULL,
  ngay_sinh DATE,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  ten_phu_huynh TEXT,
  so_dien_thoai_phu_huynh TEXT,
  email_phu_huynh TEXT,
  ngay_nhap_hoc DATE,
  trang_thai TEXT DEFAULT 'hoat_dong',
  ghi_chu TEXT,
  co_so_id TEXT,
  ten_PH TEXT,
  sdt_ph1 TEXT,
  email_ph1 TEXT,
  password TEXT,
  ct_hoc TEXT,
  han_hoc_phi DATE,
  ngay_bat_dau_hoc_phi DATE,
  parentpassword TEXT,
  anh_minh_hoc TEXT,
  hinh_anh_hoc_sinh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table (Nhân viên)
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_nhan_vien TEXT UNIQUE,
  ten_nhan_vien TEXT NOT NULL,
  ngay_sinh DATE,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  chuc_vu TEXT,
  ngay_vao_lam DATE,
  luong_co_ban DECIMAL(15,2),
  trang_thai TEXT DEFAULT 'hoat_dong',
  ghi_chu TEXT,
  ten_ngan TEXT,
  bo_phan TEXT,
  hinh_anh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities table (Cơ sở)
CREATE TABLE IF NOT EXISTS facilities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_co_so TEXT NOT NULL,
  loai_co_so TEXT,
  dia_chi TEXT,
  dien_tich DECIMAL(10,2),
  suc_chua INTEGER,
  trang_thai TEXT DEFAULT 'hoat_dong',
  mo_ta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table (Lớp học)
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_lop TEXT NOT NULL,
  mo_ta TEXT,
  trinh_do TEXT,
  so_hoc_sinh_toi_da INTEGER,
  hoc_phi DECIMAL(15,2),
  trang_thai TEXT DEFAULT 'hoat_dong',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teaching Sessions table (Buổi dạy)
CREATE TABLE IF NOT EXISTS teaching_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_buoi_hoc TEXT,
  ten_buoi_hoc TEXT NOT NULL,
  lop_id TEXT,
  giao_vien_id TEXT,
  co_so_id TEXT,
  ngay_hoc DATE,
  gio_bat_dau TIME,
  gio_ket_thuc TIME,
  noi_dung TEXT,
  trang_thai TEXT DEFAULT 'da_len_lich',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table (Ghi danh)
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  hoc_sinh_id TEXT,
  lop_id TEXT,
  ngay_ghi_danh DATE,
  trang_thai TEXT DEFAULT 'hoat_dong',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendances table (Điểm danh)
CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  buoi_hoc_id TEXT,
  hoc_sinh_id TEXT,
  trang_thai_diem_danh TEXT DEFAULT 'vang_mat',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table (Tài sản)
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_tai_san TEXT NOT NULL,
  loai_tai_san TEXT,
  gia_tri DECIMAL(15,2),
  ngay_mua DATE,
  tinh_trang TEXT,
  vi_tri TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (Công việc)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_viec TEXT NOT NULL,
  loai_viec TEXT,
  dien_giai TEXT,
  nguoi_phu_trach TEXT,
  nguoi_tao TEXT,
  ngay_den_han DATE,
  cap_do TEXT DEFAULT 'normal',
  trang_thai TEXT DEFAULT 'pending',
  doi_tuong TEXT,
  doi_tuong_id TEXT,
  ghi_chu TEXT,
  ngay_hoan_thanh TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table (Tập tin)
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_file TEXT NOT NULL,
  duong_dan TEXT,
  kich_thuoc BIGINT,
  loai_file TEXT,
  mo_ta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (Liên hệ)
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  email TEXT,
  dia_chi TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests table (Yêu cầu)
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT,
  title TEXT,
  description TEXT,
  request_type TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Clock-ins table (Chấm công nhân viên)
CREATE TABLE IF NOT EXISTS employee_clock_ins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_nhan_vien TEXT,
  ten_nhan_vien TEXT,
  ngay DATE,
  gio_vao TIME,
  gio_ra TIME,
  tong_gio DECIMAL(5,2),
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table (Đánh giá)
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_danh_gia TEXT,
  ten_danh_gia TEXT NOT NULL,
  doi_tuong_danh_gia TEXT,
  nguoi_danh_gia TEXT,
  ngay_danh_gia DATE,
  diem_so DECIMAL(5,2),
  nhan_xet TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll table (Bảng lương)
CREATE TABLE IF NOT EXISTS payroll (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_nhan_vien TEXT,
  ten_nhan_vien TEXT,
  thang INTEGER,
  nam INTEGER,
  luong_co_ban DECIMAL(15,2),
  phu_cap DECIMAL(15,2) DEFAULT 0,
  thuong DECIMAL(15,2) DEFAULT 0,
  khau_tru DECIMAL(15,2) DEFAULT 0,
  tong_luong DECIMAL(15,2),
  trang_thai TEXT DEFAULT 'chua_thanh_toan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admissions table (Tuyển sinh)
CREATE TABLE IF NOT EXISTS admissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_tuyen_sinh TEXT,
  ten_hoc_sinh TEXT NOT NULL,
  ngay_sinh DATE,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  lop_dang_ky TEXT,
  ngay_dang_ky DATE,
  trang_thai TEXT DEFAULT 'cho_xu_ly',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (Hình ảnh)
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_hinh_anh TEXT NOT NULL,
  duong_dan TEXT,
  kich_thuoc BIGINT,
  mo_ta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finances table (Tài chính)
CREATE TABLE IF NOT EXISTS finances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_giao_dich TEXT,
  loai_giao_dich TEXT,
  so_tien DECIMAL(15,2),
  ngay_giao_dich DATE,
  mo_ta TEXT,
  nguoi_thuc_hien TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Transfers table (Chuyển tài sản)
CREATE TABLE IF NOT EXISTS asset_transfers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  tai_san_id TEXT,
  tu_vi_tri TEXT,
  den_vi_tri TEXT,
  ngay_chuyen DATE,
  nguoi_chuyen TEXT,
  ly_do TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (Hoạt động)
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_hoat_dong TEXT NOT NULL,
  mo_ta TEXT,
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  dia_diem TEXT,
  nguoi_to_chuc TEXT,
  trang_thai TEXT DEFAULT 'ke_hoach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (Sự kiện)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_su_kien TEXT NOT NULL,
  mo_ta TEXT,
  ngay_su_kien DATE,
  gio_bat_dau TIME,
  gio_ket_thuc TIME,
  dia_diem TEXT,
  nguoi_to_chuc TEXT,
  trang_thai TEXT DEFAULT 'ke_hoach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_clock_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for all tables
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON facilities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON teaching_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON attendances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON employee_clock_ins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON payroll FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON admissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON finances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON asset_transfers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON events FOR ALL USING (true) WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_ma_hoc_sinh ON students(ma_hoc_sinh);
CREATE INDEX IF NOT EXISTS idx_students_trang_thai ON students(trang_thai);
CREATE INDEX IF NOT EXISTS idx_employees_ma_nhan_vien ON employees(ma_nhan_vien);
CREATE INDEX IF NOT EXISTS idx_employees_trang_thai ON employees(trang_thai);
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_lop_id ON teaching_sessions(lop_id);
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_giao_vien_id ON teaching_sessions(giao_vien_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_hoc_sinh_id ON enrollments(hoc_sinh_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_lop_id ON enrollments(lop_id);
CREATE INDEX IF NOT EXISTS idx_attendances_buoi_hoc_id ON attendances(buoi_hoc_id);
CREATE INDEX IF NOT EXISTS idx_attendances_hoc_sinh_id ON attendances(hoc_sinh_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic updated_at timestamp updates
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teaching_sessions_updated_at BEFORE UPDATE ON teaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_clock_ins_updated_at BEFORE UPDATE ON employee_clock_ins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON admissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_finances_updated_at BEFORE UPDATE ON finances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_transfers_updated_at BEFORE UPDATE ON asset_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
