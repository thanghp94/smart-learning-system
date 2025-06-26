
CREATE OR REPLACE FUNCTION create_session(session_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_session_id UUID;
  new_session JSONB;
BEGIN
  -- If an ID is provided in the data, use it. Otherwise generate a new UUID
  new_session_id := COALESCE(
    (session_data->>'id')::UUID,
    gen_random_uuid()  -- Use gen_random_uuid() instead of uuid_generate_v4()
  );
  
  INSERT INTO sessions (
    id,
    unit_id,
    buoi_hoc_so,
    noi_dung_bai_hoc,
    tsi_lesson_plan,
    rep_lesson_plan,
    bai_tap
  )
  VALUES (
    new_session_id,
    session_data->>'unit_id',
    session_data->>'buoi_hoc_so',
    session_data->>'noi_dung_bai_hoc',
    session_data->>'tsi_lesson_plan',
    session_data->>'rep_lesson_plan',
    session_data->>'bai_tap'
  )
  RETURNING to_jsonb(sessions.*) INTO new_session;
  
  RETURN new_session;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_session function: %', SQLERRM;
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'code', SQLSTATE
    );
END;
$$;
