
# Current Database Schema Documentation

## Overview
This document contains the complete schema for all tables currently in the database, with exact column names as they exist in PostgreSQL.

## Tables

### 1. Students Table
```sql
CREATE TABLE students (
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
```

### 2. Employees Table
```sql
CREATE TABLE employees (
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
```

### 3. Classes Table
```sql
CREATE TABLE classes (
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
```

### 4. Facilities Table
```sql
CREATE TABLE facilities (
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
```

### 5. Assets Table
```sql
CREATE TABLE assets (
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
```

### 6. Teaching Sessions Table
```sql
CREATE TABLE teaching_sessions (
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
```

### 7. Enrollments Table
```sql
CREATE TABLE enrollments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hoc_sinh_id TEXT,
  lop_id TEXT,
  ngay_ghi_danh TEXT,
  trang_thai TEXT DEFAULT 'active',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Attendances Table
```sql
CREATE TABLE attendances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  buoi_hoc_id TEXT,
  hoc_sinh_id TEXT,
  trang_thai_diem_danh TEXT DEFAULT 'vang_mat',
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. Tasks Table
```sql
CREATE TABLE tasks (
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
```

### 10. Files Table
```sql
CREATE TABLE files (
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
```

### 11. Contacts Table
```sql
CREATE TABLE contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  email TEXT,
  dia_chi TEXT,
  ghi_chu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 12. Requests Table
```sql
CREATE TABLE requests (
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
```

### 13. Employee Clock-ins Table
```sql
CREATE TABLE employee_clock_ins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT,
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  work_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 14. Evaluations Table
```sql
CREATE TABLE evaluations (
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
```

### 15. Payroll Table
```sql
CREATE TABLE payroll (
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
```

### 16. Admissions Table
```sql
CREATE TABLE admissions (
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
```

### 17. Images Table
```sql
CREATE TABLE images (
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
```

### 18. Finances Table
```sql
CREATE TABLE finances (
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
```

### 19. Asset Transfers Table
```sql
CREATE TABLE asset_transfers (
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
```

### 20. Activities Table
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  action TEXT,
  table_name TEXT,
  record_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 21. Events Table
```sql
CREATE TABLE events (
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
```

### 22. Settings Table
```sql
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hang_muc TEXT,
  tuy_chon TEXT,
  mo_ta TEXT,
  hien_thi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 23. Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 24. Enums Table
```sql
CREATE TABLE enums (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  display_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)
All tables have Row Level Security enabled with policies that allow all operations:
- `ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;`
- `CREATE POLICY "Allow all operations" ON [table_name] FOR ALL USING (true);`

## Indexes
Performance indexes are created on frequently queried columns:
- `idx_students_ma_hoc_sinh` on students(ma_hoc_sinh)
- `idx_students_trang_thai` on students(trang_thai)
- `idx_employees_ma_nhan_vien` on employees(ma_nhan_vien)
- `idx_employees_trang_thai` on employees(trang_thai)
- `idx_classes_tinh_trang` on classes(tinh_trang)
- `idx_teaching_sessions_lop_id` on teaching_sessions(lop_id)
- `idx_teaching_sessions_giao_vien_id` on teaching_sessions(giao_vien_id)
- `idx_enrollments_hoc_sinh_id` on enrollments(hoc_sinh_id)
- `idx_enrollments_lop_id` on enrollments(lop_id)
- `idx_attendances_buoi_hoc_id` on attendances(buoi_hoc_id)
- `idx_attendances_hoc_sinh_id` on attendances(hoc_sinh_id)

## Notes
- All tables use UUID primary keys generated with `gen_random_uuid()`
- Vietnamese column names are preserved exactly as they exist in the current database
- All tables include `created_at` and `updated_at` timestamp fields (except for a few like activities, images, and sessions)
- Text fields are used for dates to maintain compatibility with existing data formats
- Decimal fields use appropriate precision for financial calculations
