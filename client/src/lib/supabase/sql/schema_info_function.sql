
CREATE OR REPLACE FUNCTION create_schema_info_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the function that returns information about the database schema
  CREATE OR REPLACE FUNCTION get_schema_info()
  RETURNS TABLE (
    table_name text,
    column_count bigint
  )
  LANGUAGE sql
  SECURITY DEFINER
  AS $$
    SELECT 
      table_name::text,
      COUNT(column_name)::bigint as column_count 
    FROM 
      information_schema.columns 
    WHERE 
      table_schema = 'public' 
    GROUP BY 
      table_name 
    ORDER BY 
      table_name;
  $$;
END;
$$;
