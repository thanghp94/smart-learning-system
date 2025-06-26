
CREATE OR REPLACE FUNCTION public.create_attendance_records_for_date(check_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  results JSONB := '{"created": 0, "skipped": 0, "sessions": []}'::JSONB;
  session_record RECORD;
  enrollment_record RECORD;
  existing_count INTEGER;
BEGIN
  -- Loop through all teaching sessions scheduled for the specified date
  FOR session_record IN 
    SELECT ts.id, ts.lop_chi_tiet_id, ts.ngay_hoc
    FROM teaching_sessions ts
    WHERE ts.ngay_hoc = check_date
  LOOP
    -- Add session to the results
    results := results || jsonb_build_object(
      'sessions', 
      (results->'sessions') || jsonb_build_object('id', session_record.id, 'enrollments', '[]'::JSONB)
    );
    
    -- Find all enrollments for this class
    FOR enrollment_record IN
      SELECT e.id, e.hoc_sinh_id, e.lop_chi_tiet_id
      FROM enrollments e
      WHERE e.lop_chi_tiet_id = session_record.lop_chi_tiet_id
    LOOP
      -- Check if attendance record already exists
      SELECT COUNT(*) INTO existing_count
      FROM attendances a
      WHERE a.teaching_session_id = session_record.id
      AND a.enrollment_id = enrollment_record.id;
      
      IF existing_count = 0 THEN
        -- Create attendance record
        INSERT INTO attendances (
          enrollment_id,
          teaching_session_id,
          status,
          thoi_gian_tre
        ) VALUES (
          enrollment_record.id,
          session_record.id,
          'pending',
          0
        );
        
        -- Update results counter
        results := jsonb_set(
          results, 
          '{created}', 
          to_jsonb(COALESCE((results->>'created')::INTEGER, 0) + 1)
        );
        
        -- Add enrollment to the session's enrollments array
        results := jsonb_set(
          results,
          '{sessions, -1, enrollments}',
          (results->'sessions'->-1->'enrollments') || jsonb_build_object('id', enrollment_record.id, 'created', true)
        );
      ELSE
        -- Update skipped counter
        results := jsonb_set(
          results, 
          '{skipped}', 
          to_jsonb(COALESCE((results->>'skipped')::INTEGER, 0) + 1)
        );
        
        -- Add enrollment to the session's enrollments array with skipped flag
        results := jsonb_set(
          results,
          '{sessions, -1, enrollments}',
          (results->'sessions'->-1->'enrollments') || jsonb_build_object('id', enrollment_record.id, 'created', false)
        );
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN results;
END;
$$;

-- Create a function to be called by a scheduled job
CREATE OR REPLACE FUNCTION public.create_today_attendance_records()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.create_attendance_records_for_date(CURRENT_DATE);
END;
$$;
