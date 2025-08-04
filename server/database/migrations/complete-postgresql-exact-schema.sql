
-- Complete PostgreSQL Schema Replication for Supabase
-- This script creates tables with EXACTLY the same column names as your current PostgreSQL database

-- Enable Row Level Security and create policies for all tables

-- Students table (exact match)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ma_hoc_sinh TEXT,
  ten_hoc_sinh TEXT NOT NULL,
  ten_ngan TEXT,
  ngay_sinh TEXT,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  ten_PH TEXT,
  sdt_ph1 TEXT,
  email_ph1 TEXT,
  co_so_id TEXT,
  password TEXT,
  trang_thai TEXT DEFAULT 'active',
  ct_hoc TEXT,
  han_hoc_phi TEXT,
  ngay_bat_dau_hoc_phi TEXT,
  ghi_chu TEXT,
  parentpassword TEXT,
  anh_minh_hoc TEXT,
  hinh_anh_hoc_sinh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table (exact match)
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ma_nhan_vien TEXT,
  ten_nhan_vien TEXT NOT NULL,
  ten_ngan TEXT,
  ngay_sinh TEXT,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  chuc_vu TEXT,
  bo_phan TEXT,
  co_so TEXT,
  ngay_vao_lam TEXT,
  trang_thai TEXT DEFAULT 'active',
  hinh_anh TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table (exact match)
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_lop TEXT NOT NULL,
  ten_lop_full TEXT NOT NULL,
  co_so TEXT,
  gv_chinh TEXT,
  ct_hoc TEXT,
  ngay_bat_dau TEXT,
  tinh_trang TEXT DEFAULT 'active',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities table (exact match)
CREATE TABLE IF NOT EXISTS facilities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_co_so TEXT NOT NULL,
  loai_co_so TEXT,
  dia_chi TEXT,
  dien_tich DECIMAL(10,2),
  suc_chua INTEGER,
  trang_thai TEXT DEFAULT 'active',
  mo_ta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table (exact match)
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_csvc TEXT NOT NULL,
  danh_muc TEXT,
  loai TEXT,
  thuong_hieu TEXT,
  mau TEXT,
  size TEXT,
  chat_lieu TEXT,
  so_luong INTEGER,
  don_vi TEXT NOT NULL,
  facility_id TEXT,
  tinh_trang TEXT,
  so_tien_mua TEXT,
  ngay_mua TEXT,
  noi_mua TEXT,
  mo_ta_1 TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teaching Sessions table (exact match)
CREATE TABLE IF NOT EXISTS teaching_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ma_buoi_hoc TEXT,
  ten_buoi_hoc TEXT NOT NULL,
  lop_id TEXT,
  giao_vien_id TEXT,
  co_so_id TEXT,
  ngay_hoc TEXT,
  gio_bat_dau TEXT,
  gio_ket_thuc TEXT,
  noi_dung TEXT,
  trang_thai TEXT DEFAULT 'da_len_lich',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table (exact match)
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hoc_sinh_id TEXT,
  lop_id TEXT,
  ngay_ghi_danh TEXT,
  trang_thai TEXT DEFAULT 'active',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendances table (exact match)
CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  buoi_hoc_id TEXT,
  hoc_sinh_id TEXT,
  trang_thai_diem_danh TEXT DEFAULT 'vang_mat',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (exact match)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tieu_de TEXT NOT NULL,
  mo_ta TEXT,
  nguoi_giao TEXT,
  nguoi_thuc_hien TEXT,
  ngay_bat_dau TEXT,
  ngay_ket_thuc TEXT,
  uu_tien TEXT DEFAULT 'trung_binh',
  trang_thai TEXT DEFAULT 'chua_bat_dau',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table (exact match)
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_file TEXT,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  loai_file TEXT,
  mo_ta TEXT,
  uploaded_by TEXT,
  entity_type TEXT,
  entity_id TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (exact match)
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  email TEXT,
  dia_chi TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests table (exact match)
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tieu_de TEXT NOT NULL,
  noi_dung TEXT,
  nguoi_gui TEXT,
  loai_yeu_cau TEXT,
  trang_thai TEXT DEFAULT 'cho_xu_ly',
  ngay_tao DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Clock-ins table (exact match)
CREATE TABLE IF NOT EXISTS employee_clock_ins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT,
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  work_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table (exact match)
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ma_danh_gia TEXT,
  ten_danh_gia TEXT NOT NULL,
  doi_tuong_danh_gia TEXT,
  nguoi_danh_gia TEXT,
  ngay_danh_gia TEXT,
  diem_so DECIMAL(5,2),
  nhan_xet TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll table (exact match)
CREATE TABLE IF NOT EXISTS payroll (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT,
  month INTEGER,
  year INTEGER,
  base_salary DECIMAL(15,2),
  bonuses DECIMAL(15,2) DEFAULT 0,
  deductions DECIMAL(15,2) DEFAULT 0,
  total_salary DECIMAL(15,2),
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admissions table (exact match)
CREATE TABLE IF NOT EXISTS admissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_hoc_sinh TEXT NOT NULL,
  ngay_sinh DATE,
  gioi_tinh TEXT,
  dia_chi TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  ten_phu_huynh TEXT,
  so_dien_thoai_phu_huynh TEXT,
  email_phu_huynh TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  application_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (exact match)
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT,
  related_id TEXT,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finances table (exact match)
CREATE TABLE IF NOT EXISTS finances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ma_giao_dich TEXT,
  loai_giao_dich TEXT,
  so_tien DECIMAL(15,2),
  ngay_giao_dich TEXT,
  mo_ta TEXT,
  nguoi_thuc_hien TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Transfers table (exact match)
CREATE TABLE IF NOT EXISTS asset_transfers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tai_san_id TEXT,
  tu_vi_tri TEXT,
  den_vi_tri TEXT,
  ngay_chuyen TEXT,
  nguoi_chuyen TEXT,
  ly_do TEXT,
  trang_thai TEXT DEFAULT 'hoan_thanh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (exact match)
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  action TEXT,
  table_name TEXT,
  record_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (exact match)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_su_kien TEXT NOT NULL,
  mo_ta TEXT,
  ngay_su_kien TEXT,
  gio_bat_dau TEXT,
  gio_ket_thuc TEXT,
  dia_diem TEXT,
  nguoi_to_chuc TEXT,
  trang_thai TEXT DEFAULT 'ke_hoach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (exact match)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hang_muc TEXT,
  tuy_chon TEXT,
  mo_ta TEXT,
  hien_thi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (exact match)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enums table (exact match)
CREATE TABLE IF NOT EXISTS enums (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  display_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enums ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for each table
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON employees FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON facilities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON assets FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON teaching_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON enrollments FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON attendances FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON files FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON requests FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON employee_clock_ins FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON evaluations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON payroll FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON admissions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON images FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON finances FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON asset_transfers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON activities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON enums FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_ma_hoc_sinh ON students(ma_hoc_sinh);
CREATE INDEX IF NOT EXISTS idx_students_trang_thai ON students(trang_thai);
CREATE INDEX IF NOT EXISTS idx_employees_ma_nhan_vien ON employees(ma_nhan_vien);
CREATE INDEX IF NOT EXISTS idx_employees_trang_thai ON employees(trang_thai);
CREATE INDEX IF NOT EXISTS idx_classes_tinh_trang ON classes(tinh_trang);
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_lop_id ON teaching_sessions(lop_id);
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_giao_vien_id ON teaching_sessions(giao_vien_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_hoc_sinh_id ON enrollments(hoc_sinh_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_lop_id ON enrollments(lop_id);
CREATE INDEX IF NOT EXISTS idx_attendances_buoi_hoc_id ON attendances(buoi_hoc_id);
CREATE INDEX IF NOT EXISTS idx_attendances_hoc_sinh_id ON attendances(hoc_sinh_id);
