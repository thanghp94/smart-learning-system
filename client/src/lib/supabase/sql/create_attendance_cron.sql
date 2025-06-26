
-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job to run at 1 AM every day
SELECT cron.schedule(
  'create-daily-attendance-records',
  '0 1 * * *',  -- Run at 1:00 AM every day
  $$
    SELECT public.create_today_attendance_records();
  $$
);
