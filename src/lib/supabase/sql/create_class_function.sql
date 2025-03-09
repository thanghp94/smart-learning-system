
CREATE OR REPLACE FUNCTION create_class(class_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_class_id UUID;
  new_class JSONB;
BEGIN
  -- If an ID is provided in the data, use it. Otherwise generate a new UUID
  new_class_id := COALESCE(
    (class_data->>'id')::UUID,
    uuid_generate_v4()
  );
  
  INSERT INTO classes (
    id,
    ten_lop_full, 
    ten_lop, 
    ct_hoc, 
    co_so, 
    gv_chinh, 
    ngay_bat_dau, 
    tinh_trang, 
    ghi_chu, 
    unit_id
  )
  VALUES (
    new_class_id,
    class_data->>'ten_lop_full',
    class_data->>'ten_lop',
    class_data->>'ct_hoc',
    NULLIF(class_data->>'co_so', '')::UUID,
    NULLIF(class_data->>'gv_chinh', '')::UUID,
    (class_data->>'ngay_bat_dau')::DATE,
    COALESCE(class_data->>'tinh_trang', 'active'),
    class_data->>'ghi_chu',
    class_data->>'unit_id'
  );
  
  SELECT row_to_json(c)::JSONB INTO new_class
  FROM classes c
  WHERE c.id = new_class_id;
  
  RETURN new_class;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_class function: %', SQLERRM;
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'code', SQLSTATE
    );
END;
$$;
