
-- Create a view to summarize employee attendance by month
CREATE OR REPLACE VIEW monthly_employee_attendance AS
SELECT 
  e.id AS employee_id,
  e.ten_nhan_su AS employee_name,
  ec.ngay AS attendance_date,
  EXTRACT(MONTH FROM ec.ngay) AS month,
  EXTRACT(YEAR FROM ec.ngay) AS year,
  ec.thoi_gian_bat_dau AS time_in,
  ec.thoi_gian_ket_thuc AS time_out,
  ec.trang_thai AS status,
  ec.xac_nhan AS verified,
  ec.ghi_chu AS notes
FROM 
  employee_clock_in_out ec
JOIN 
  employees e ON ec.nhan_vien_id = e.id
ORDER BY 
  e.ten_nhan_su, ec.ngay;

-- Create a function to generate monthly attendance summary
CREATE OR REPLACE FUNCTION get_monthly_attendance_summary(
  p_month INTEGER,
  p_year INTEGER
)
RETURNS TABLE (
  employee_id UUID,
  employee_name TEXT,
  attendance_date DATE,
  day_of_month INTEGER,
  status TEXT,
  present_count INTEGER,
  absent_count INTEGER,
  late_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH monthly_data AS (
    SELECT 
      employee_id,
      employee_name,
      attendance_date,
      EXTRACT(DAY FROM attendance_date)::INTEGER AS day_of_month,
      status,
      COUNT(*) FILTER (WHERE status = 'present') OVER (PARTITION BY employee_id) AS present_count,
      COUNT(*) FILTER (WHERE status = 'absent') OVER (PARTITION BY employee_id) AS absent_count,
      COUNT(*) FILTER (WHERE status = 'late') OVER (PARTITION BY employee_id) AS late_count
    FROM 
      monthly_employee_attendance
    WHERE 
      month = p_month AND year = p_year
  )
  SELECT * FROM monthly_data
  ORDER BY employee_name, day_of_month;
END;
$$;
