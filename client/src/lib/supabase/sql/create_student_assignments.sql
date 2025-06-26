
-- Create the student assignments table
CREATE TABLE IF NOT EXISTS student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hoc_sinh_id UUID NOT NULL REFERENCES students(id),
  buoi_day_id UUID REFERENCES teaching_sessions(id),
  lop_chi_tiet_id UUID REFERENCES classes(id),
  tieu_de TEXT NOT NULL,
  mo_ta TEXT,
  file TEXT,
  hinh_anh TEXT,
  ngay_giao DATE NOT NULL,
  han_nop DATE,
  trang_thai TEXT NOT NULL DEFAULT 'assigned',
  diem NUMERIC,
  nhan_xet TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE student_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (for development)
CREATE POLICY "Allow all operations on student_assignments"
  ON student_assignments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_student_assignments_timestamp
BEFORE UPDATE ON student_assignments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create log activity trigger
CREATE TRIGGER log_activity_trigger
AFTER INSERT OR UPDATE OR DELETE ON student_assignments
FOR EACH STATEMENT
EXECUTE FUNCTION log_activity();
