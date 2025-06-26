
-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hang_muc TEXT,
  tuy_chon TEXT,
  mo_ta TEXT,
  hien_thi TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Finance related tables
CREATE TABLE IF NOT EXISTS finances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  amount DECIMAL(15,2),
  description TEXT,
  transaction_type TEXT,
  facility_id TEXT,
  student_id TEXT,
  employee_id TEXT,
  payment_method TEXT,
  transaction_date DATE,
  created_by TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_transaction_types (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Asset transfer table
CREATE TABLE IF NOT EXISTS asset_transfers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  asset_id TEXT,
  from_facility_id TEXT,
  to_facility_id TEXT,
  transfer_date DATE,
  notes TEXT,
  transferred_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  action TEXT,
  table_name TEXT,
  record_id TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT,
  related_id TEXT,
  related_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Files table
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
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  event_type TEXT,
  facility_id TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ten_lien_he TEXT NOT NULL,
  email TEXT,
  so_dien_thoai TEXT,
  dia_chi TEXT,
  loai_lien_he TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT,
  title TEXT,
  description TEXT,
  request_type TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  assigned_by TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT,
  class_id TEXT,
  evaluation_type TEXT,
  score INTEGER,
  max_score INTEGER,
  notes TEXT,
  evaluation_date DATE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student assignments table
CREATE TABLE IF NOT EXISTS student_assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT,
  teaching_session_id TEXT,
  assignment_title TEXT,
  assignment_description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'assigned',
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payroll table
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employee clock in/out table
CREATE TABLE IF NOT EXISTS employee_clock_ins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT,
  clock_in_time TIMESTAMP,
  clock_out_time TIMESTAMP,
  work_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admissions table
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (for teaching sessions scheduling)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_name TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enums table for managing dropdown values
CREATE TABLE IF NOT EXISTS enums (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  display_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert some default enum values
INSERT INTO enums (category, value, display_text) VALUES
('transaction_type', 'income', 'Thu nhập'),
('transaction_type', 'expense', 'Chi phí'),
('payment_method', 'cash', 'Tiền mặt'),
('payment_method', 'bank_transfer', 'Chuyển khoản'),
('payment_method', 'card', 'Thẻ'),
('request_status', 'pending', 'Chờ xử lý'),
('request_status', 'approved', 'Đã duyệt'),
('request_status', 'rejected', 'Từ chối'),
('task_status', 'pending', 'Chờ xử lý'),
('task_status', 'in_progress', 'Đang thực hiện'),
('task_status', 'completed', 'Hoàn thành'),
('priority', 'low', 'Thấp'),
('priority', 'medium', 'Trung bình'),
('priority', 'high', 'Cao'),
('admission_status', 'pending', 'Chờ xử lý'),
('admission_status', 'accepted', 'Đã nhận'),
('admission_status', 'rejected', 'Từ chối')
ON CONFLICT DO NOTHING;

-- Insert default transaction types
INSERT INTO finance_transaction_types (name, description) VALUES
('Học phí', 'Thu học phí từ học sinh'),
('Lương', 'Thanh toán lương nhân viên'),
('Thiết bị', 'Mua sắm thiết bị'),
('Điện nước', 'Hóa đơn điện nước'),
('Thuê mặt bằng', 'Chi phí thuê mặt bằng')
ON CONFLICT DO NOTHING;
