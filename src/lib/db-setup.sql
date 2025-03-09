
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets
-- Note: Run these commands in Supabase SQL Editor or Storage UI
-- CREATE BUCKET IF NOT EXISTS "student_photos";
-- CREATE BUCKET IF NOT EXISTS "employee_photos";
-- CREATE BUCKET IF NOT EXISTS "documents";
-- CREATE BUCKET IF NOT EXISTS "assets";

-- Create tables
-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loai_co_so TEXT NOT NULL,
  ten_co_so TEXT NOT NULL,
  dia_chi_co_so TEXT,
  nguoi_chu TEXT,
  phone TEXT,
  email TEXT,
  nguoi_phu_trach UUID REFERENCES employees(id),
  ghi_chu TEXT,
  trang_thai TEXT DEFAULT 'active',
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ten_nhan_su TEXT NOT NULL,
  ten_tieng_anh TEXT,
  dien_thoai TEXT,
  email TEXT,
  tinh_trang_lao_dong TEXT DEFAULT 'active',
  dia_chi TEXT,
  gioi_tinh TEXT,
  ngay_sinh DATE,
  bo_phan TEXT,
  chuc_danh TEXT,
  co_so_id UUID[] DEFAULT '{}',
  hinh_anh TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ten_hoc_sinh TEXT NOT NULL,
  gioi_tinh TEXT,
  ngay_sinh DATE,
  co_so_ID UUID REFERENCES facilities(id),
  ten_PH TEXT,
  sdt_ph1 TEXT,
  email_ph1 TEXT,
  dia_chi TEXT,
  ct_hoc TEXT,
  trang_thai TEXT DEFAULT 'active',
  hinh_anh_hoc_sinh TEXT,
  han_hoc_phi DATE,
  mo_ta_hs TEXT,
  userID TEXT,
  Password TEXT,
  ParentID TEXT,
  ParentPassword TEXT,
  ngay_bat_dau_hoc_phi DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  Ten_lop_full TEXT NOT NULL,
  ten_lop TEXT NOT NULL,
  ct_hoc TEXT,
  co_so UUID REFERENCES facilities(id),
  GV_chinh UUID REFERENCES employees(id),
  ngay_bat_dau DATE,
  tinh_trang TEXT DEFAULT 'active',
  ghi_chu TEXT,
  unit_id TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id TEXT,
  buoi_hoc_so TEXT NOT NULL,
  tsi_lesson_plan TEXT,
  noi_dung_bai_hoc TEXT NOT NULL,
  rep_lesson_plan TEXT,
  bai_tap TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teaching Sessions table
CREATE TABLE IF NOT EXISTS teaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lop_chi_tiet_id UUID REFERENCES classes(id) NOT NULL,
  session_id UUID REFERENCES sessions(id) NOT NULL,
  Loai_bai_hoc TEXT,
  phong_hoc_id TEXT,
  ngay_hoc DATE NOT NULL,
  thoi_gian_bat_dau TIME NOT NULL,
  thoi_gian_ket_thuc TIME NOT NULL,
  giao_vien UUID REFERENCES employees(id) NOT NULL,
  tro_giang UUID REFERENCES employees(id),
  nhan_xet_1 TEXT,
  nhan_xet_2 TEXT,
  nhan_xet_3 TEXT,
  nhan_xet_4 TEXT,
  nhan_xet_5 TEXT,
  nhan_xet_6 TEXT,
  trung_binh NUMERIC GENERATED ALWAYS AS (
    (COALESCE(nhan_xet_1::NUMERIC, 0) + 
     COALESCE(nhan_xet_2::NUMERIC, 0) + 
     COALESCE(nhan_xet_3::NUMERIC, 0) + 
     COALESCE(nhan_xet_4::NUMERIC, 0) + 
     COALESCE(nhan_xet_5::NUMERIC, 0) + 
     COALESCE(nhan_xet_6::NUMERIC, 0)) / 
    NULLIF(
      (CASE WHEN nhan_xet_1 IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN nhan_xet_2 IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN nhan_xet_3 IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN nhan_xet_4 IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN nhan_xet_5 IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN nhan_xet_6 IS NOT NULL THEN 1 ELSE 0 END),
      0
    )
  ) STORED,
  nhan_xet_chung TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hoc_sinh_id UUID REFERENCES students(id) NOT NULL,
  lop_chi_tiet_id UUID REFERENCES classes(id) NOT NULL,
  buoi_day_id UUID REFERENCES teaching_sessions(id),
  tinh_trang_diem_danh TEXT DEFAULT 'pending',
  nhan_xet_tieu_chi_1 TEXT,
  nhan_xet_tieu_chi_2 TEXT,
  nhan_xet_tieu_chi_3 TEXT,
  ghi_chu TEXT,
  chon_de_danh_gia BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hoc_sinh_id, lop_chi_tiet_id, buoi_day_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loai_su_kien TEXT NOT NULL,
  danh_muc_su_kien TEXT,
  doi_tuong_id TEXT,
  ten_su_kien TEXT NOT NULL,
  dia_diem TEXT,
  ngay_bat_dau DATE NOT NULL,
  thoi_gian_bat_dau TIME,
  thoi_gian_ket_thuc TIME,
  vi_tri_tuyen_dung TEXT,
  nhan_su_phu_trach TEXT[],
  ghi_chu TEXT,
  hinh_anh TEXT,
  trang_thai TEXT DEFAULT 'pending',
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doi_tuong TEXT,
  doi_tuong_id TEXT,
  loai_viec TEXT,
  dien_giai TEXT,
  nguoi_phu_trach UUID REFERENCES employees(id),
  ten_viec TEXT NOT NULL,
  ghi_chu TEXT,
  ngay_den_han DATE,
  cap_do TEXT,
  trang_thai TEXT DEFAULT 'pending',
  ngay_hoan_thanh DATE,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caption TEXT,
  doi_tuong TEXT NOT NULL,
  doi_tuong_id TEXT NOT NULL,
  ten_anh TEXT,
  image TEXT,
  video TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bo_phan TEXT,
  quy_trinh TEXT,
  hang_muc TEXT,
  hien_thi TEXT,
  tuy_chon TEXT,
  tuy_chon_2 TEXT,
  video TEXT,
  mo_ta TEXT,
  list_column_show_if TEXT[],
  file TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payrolls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nhan_su_id UUID REFERENCES employees(id) NOT NULL,
  nam TEXT,
  thang TEXT,
  ngay TEXT,
  co_so_id UUID REFERENCES facilities(id),
  tong_luong_tru_BH NUMERIC,
  trang_thai TEXT DEFAULT 'pending',
  luong NUMERIC,
  pc_tnhiem NUMERIC,
  pc_an_o NUMERIC,
  pc_dthoai NUMERIC,
  pc_xang_xe NUMERIC,
  tong_thu_nhap NUMERIC,
  cong_chuan NUMERIC,
  cong_thuc_lam NUMERIC,
  tong_luong_theo_gio NUMERIC,
  tong_luong_thuc_te NUMERIC,
  luong_bh NUMERIC,
  BHXH_DN NUMERIC,
  BHYT_DN NUMERIC,
  tong_bh_dn_tra NUMERIC,
  tong_chi_dn NUMERIC,
  BHXH_NV NUMERIC,
  BHYT_NV NUMERIC,
  BHTN_NV NUMERIC,
  tong_BH_nv NUMERIC,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance table
CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  muc TEXT,
  loai_doi_tuong TEXT,
  doi_tuong_id TEXT,
  co_so UUID REFERENCES facilities(id),
  ngay DATE,
  loai_thu_chi TEXT NOT NULL,
  dien_giai TEXT,
  ten_phi TEXT,
  thoi_gian_phai_tra DATE,
  so_luong NUMERIC,
  don_vi NUMERIC,
  gia_tien NUMERIC,
  tong_tien NUMERIC NOT NULL,
  bang_chu TEXT,
  kieu_thanh_toan TEXT,
  hanh_dong TEXT,
  tinh_trang TEXT DEFAULT 'pending',
  ghi_chu TEXT,
  nguoi_tao UUID REFERENCES employees(id),
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  tg_hoan_thanh TIMESTAMPTZ,
  tg_in TEXT,
  file_in TEXT,
  file_hoa_don_thu_tien TEXT,
  net NUMERIC,
  ton_quy NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doi_tuong TEXT NOT NULL,
  ghi_danh_id UUID REFERENCES enrollments(id),
  nhanvien_id UUID REFERENCES employees(id),
  ten_danh_gia TEXT NOT NULL,
  email TEXT,
  hinh_anh TEXT,
  ngay_dau_dot_danh_gia DATE,
  ngay_cuoi_dot_danh_gia DATE,
  han_hoan_thanh DATE,
  tieu_chi_1 TEXT,
  tieu_chi_2 TEXT,
  tieu_chi_3 TEXT,
  tieu_chi_4 TEXT,
  tieu_chi_5 TEXT,
  tieu_chi_6 TEXT,
  tieu_chi_7 TEXT,
  nhan_xet_chi_tiet_1 TEXT,
  nhan_xet_chi_tiet_2 TEXT,
  nhan_xet_chi_tiet_3 TEXT,
  nhan_xet_chi_tiet_4 TEXT,
  nhan_xet_chi_tiet_5 TEXT,
  nhan_xet_chi_tiet_6 TEXT,
  nhan_xet_chi_tiet_7 TEXT,
  nhan_xet_chung TEXT,
  nhan_xet_cua_cap_tren TEXT,
  nhan_xet_tong_hop TEXT,
  trang_thai TEXT DEFAULT 'pending',
  ghi_chu TEXT,
  pdf_dg_hoc_sinh TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loai TEXT,
  danh_muc TEXT,
  thuong_hieu TEXT,
  cau_hinh TEXT,
  chat_lieu TEXT,
  mau TEXT,
  size TEXT,
  don_vi TEXT NOT NULL,
  ten_CSVC TEXT NOT NULL,
  so_luong NUMERIC DEFAULT 0,
  noi_mua TEXT,
  hinh_anh TEXT,
  hinh_anh_2 TEXT,
  mo_ta_1 TEXT,
  so_seri TEXT,
  ngay_mua DATE,
  doi_tuong TEXT,
  doi_tuong_id TEXT,
  trang_thai_so_huu TEXT,
  tinh_trang TEXT DEFAULT 'active',
  trang_thai_so_huu_moi TEXT,
  so_luong_chuyen NUMERIC,
  doi_tuong_chuyen TEXT,
  noi_chuyen_toi TEXT,
  so_tien_mua TEXT,
  khu_vuc TEXT,
  qr_code TEXT,
  ngay_nhap DATE,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  ghi_chu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phan_loai TEXT,
  doi_tuong_id TEXT,
  ten_lien_he TEXT NOT NULL,
  mieu_ta TEXT,
  ngay_sinh DATE,
  email TEXT,
  sdt TEXT,
  khu_vuc_dang_o TEXT,
  link_cv TEXT,
  trang_thai TEXT DEFAULT 'active',
  ghi_chu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doi_tuong_lien_quan TEXT NOT NULL,
  ten_doi_tuong TEXT,
  nhan_vien_ID UUID REFERENCES employees(id),
  co_so_id UUID REFERENCES facilities(id),
  lien_he_id UUID REFERENCES contacts(id),
  CSVC_ID UUID REFERENCES assets(id),
  hoc_sinh_id UUID REFERENCES students(id),
  nhom_tai_lieu TEXT,
  dien_giai TEXT,
  ten_tai_lieu TEXT NOT NULL,
  file1 TEXT,
  file2 TEXT,
  anh TEXT,
  trang_thai TEXT DEFAULT 'active',
  ngay_cap DATE,
  tinh_trang_han TEXT,
  han_tai_lieu DATE,
  lan_ban_hanh TIMESTAMPTZ,
  ghi_chu TEXT,
  id_tai_lieu TEXT,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  muc TEXT,
  noi_dung TEXT NOT NULL,
  ly_do TEXT,
  ngay_de_xuat DATE NOT NULL,
  so_ngay_nghi NUMERIC,
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  ngay_di_lam_lai DATE,
  thoi_gian_bat_dau TIME,
  thoi_gian_ket_thuc TIME,
  so_luong NUMERIC,
  tong_so NUMERIC,
  file TEXT,
  trang_thai TEXT DEFAULT 'pending',
  ghi_chu TEXT,
  nguoi_de_xuat_id UUID REFERENCES employees(id) NOT NULL,
  tg_tao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Transfers table
CREATE TABLE IF NOT EXISTS asset_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  destination_type TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  transfer_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  user TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create views 
-- View for classes with student count
CREATE OR REPLACE VIEW classes_with_student_count AS
SELECT 
  c.*,
  COUNT(e.id) AS so_hs
FROM 
  classes c
LEFT JOIN 
  enrollments e ON c.id = e.lop_chi_tiet_id
GROUP BY 
  c.id;

-- View for teaching sessions with evaluation details
CREATE OR REPLACE VIEW teaching_sessions_with_details AS
SELECT 
  ts.*,
  c.Ten_lop_full AS class_name,
  e_gv.ten_nhan_su AS teacher_name,
  e_tg.ten_nhan_su AS assistant_name,
  s.noi_dung_bai_hoc AS lesson_content
FROM 
  teaching_sessions ts
LEFT JOIN 
  classes c ON ts.lop_chi_tiet_id = c.id
LEFT JOIN 
  employees e_gv ON ts.giao_vien = e_gv.id
LEFT JOIN 
  employees e_tg ON ts.tro_giang = e_tg.id
LEFT JOIN 
  sessions s ON ts.session_id = s.id;

-- View for student enrollments with class details
CREATE OR REPLACE VIEW student_enrollments_with_details AS
SELECT 
  e.*,
  s.ten_hoc_sinh,
  c.Ten_lop_full,
  c.ten_lop,
  c.ct_hoc
FROM 
  enrollments e
JOIN 
  students s ON e.hoc_sinh_id = s.id
JOIN 
  classes c ON e.lop_chi_tiet_id = c.id;

-- View for employee evaluations
CREATE OR REPLACE VIEW employee_evaluations AS
SELECT 
  e.*,
  emp.ten_nhan_su,
  emp.bo_phan,
  emp.chuc_danh
FROM 
  evaluations e
JOIN 
  employees emp ON e.nhanvien_id = emp.id
WHERE 
  e.doi_tuong = 'employee';

-- View for asset inventory by facility
CREATE OR REPLACE VIEW asset_inventory_by_facility AS
SELECT 
  a.*,
  f.ten_co_so
FROM 
  assets a
JOIN 
  facilities f ON a.doi_tuong_id = f.id::TEXT
WHERE 
  a.doi_tuong = 'facility';

-- Create triggers
-- Trigger for updating the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE '_prisma_%'
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_timestamp
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    ', t);
  END LOOP;
END;
$$;

-- Trigger for logging activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activities (action, type, name, user, status)
    VALUES ('Thêm mới', TG_TABLE_NAME, 'New record', current_user, 'completed');
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activities (action, type, name, user, status)
    VALUES ('Cập nhật', TG_TABLE_NAME, 'Updated record', current_user, 'completed');
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activities (action, type, name, user, status)
    VALUES ('Xóa', TG_TABLE_NAME, 'Deleted record', current_user, 'completed');
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging triggers to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE '_prisma_%'
      AND table_name != 'activities'
  LOOP
    EXECUTE format('
      CREATE TRIGGER log_activity_trigger
      AFTER INSERT OR UPDATE OR DELETE ON %I
      FOR EACH STATEMENT
      EXECUTE FUNCTION log_activity();
    ', t);
  END LOOP;
END;
$$;

-- Create RLS policies
-- Create policy to restrict access to students by facility
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY students_facility_access
  ON students
  FOR ALL
  TO authenticated
  USING (
    co_so_ID IN (
      SELECT unnest(co_so_id)
      FROM employees
      WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND bo_phan = 'Admin'
    )
  );

-- Create policy to restrict access to classes by facility
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY classes_facility_access
  ON classes
  FOR ALL
  TO authenticated
  USING (
    co_so IN (
      SELECT unnest(co_so_id)
      FROM employees
      WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND bo_phan = 'Admin'
    )
  );

-- Create policy to restrict access to employee payroll
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY payroll_view_own
  ON payrolls
  FOR SELECT
  TO authenticated
  USING (
    nhan_su_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND (bo_phan = 'Admin' OR bo_phan = 'HR')
    )
  );

-- Create policy to restrict access to facilities
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY facilities_access
  ON facilities
  FOR ALL
  TO authenticated
  USING (
    id IN (
      SELECT unnest(co_so_id)
      FROM employees
      WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND bo_phan = 'Admin'
    )
  );
