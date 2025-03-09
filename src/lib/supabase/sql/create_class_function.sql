
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
  INSERT INTO classes (
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
    class_data->>'ten_lop_full',
    class_data->>'ten_lop',
    class_data->>'ct_hoc',
    NULLIF(class_data->>'co_so', '')::UUID,
    NULLIF(class_data->>'gv_chinh', '')::UUID,
    (class_data->>'ngay_bat_dau')::DATE,
    class_data->>'tinh_trang',
    class_data->>'ghi_chu',
    class_data->>'unit_id'
  )
  RETURNING id INTO new_class_id;
  
  SELECT row_to_json(c)::JSONB INTO new_class
  FROM classes c
  WHERE c.id = new_class_id;
  
  RETURN new_class;
END;
$$;
