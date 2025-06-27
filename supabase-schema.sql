-- Supabase Schema Creation Script
-- Run this in your Supabase SQL Editor to create all required tables

-- Students table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities table
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

-- Classes table
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

-- Teaching Sessions table
CREATE TABLE IF NOT EXISTS teaching_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_buoi_hoc TEXT,
  ten_buoi_hoc TEXT NOT NULL,
  lop_id TEXT REFERENCES classes(id),
  giao_vien_id TEXT REFERENCES employees(id),
  co_so_id TEXT REFERENCES facilities(id),
  ngay_hoc DATE,
  gio_bat_dau TIME,
  gio_ket_thuc TIME,
  noi_dung TEXT,
  trang_thai TEXT DEFAULT 'da_len_lich',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  hoc_sinh_id TEXT REFERENCES students(id),
  lop_id TEXT REFERENCES classes(id),
  ngay_ghi_danh DATE,
  trang_thai TEXT DEFAULT 'hoat_dong',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendances table
CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  buoi_hoc_id TEXT REFERENCES teaching_sessions(id),
  hoc_sinh_id TEXT REFERENCES students(id),
  trang_thai_diem_danh TEXT DEFAULT 'vang_mat',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
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

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de TEXT NOT NULL,
  mo_ta TEXT,
  nguoi_giao TEXT,
  nguoi_thuc_hien TEXT,
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  uu_tien TEXT DEFAULT 'trung_binh',
  trang_thai TEXT DEFAULT 'chua_bat_dau',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
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

-- Contacts table
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

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de TEXT NOT NULL,
  noi_dung TEXT,
  nguoi_gui TEXT,
  loai_yeu_cau TEXT,
  trang_thai TEXT DEFAULT 'cho_xu_ly',
  ngay_tao DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Clock-ins table
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

-- Evaluations table
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

-- Payroll table
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

-- Admissions table
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

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_hinh_anh TEXT NOT NULL,
  duong_dan TEXT,
  kich_thuoc BIGINT,
  mo_ta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finances table
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

-- Asset Transfers table
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

-- Activities table
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

-- Events table
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

-- Enable Row Level Security (RLS) for all tables
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

-- Create policies to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON employees FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON facilities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON teaching_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON enrollments FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON attendances FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON assets FOR ALL USING (true);
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