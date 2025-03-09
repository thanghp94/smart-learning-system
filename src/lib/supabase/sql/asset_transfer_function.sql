
-- Function to create an asset transfer and handle related operations in a transaction
CREATE OR REPLACE FUNCTION create_asset_transfer(
  asset_id_param UUID,
  source_type_param TEXT,
  source_id_param TEXT,
  destination_type_param TEXT,
  destination_id_param TEXT,
  quantity_param NUMERIC,
  status_param TEXT,
  notes_param TEXT,
  transfer_date_param DATE
) 
RETURNS SETOF asset_transfers AS $$
DECLARE
  asset_record assets%ROWTYPE;
  transfer_id UUID;
BEGIN
  -- Get the asset record
  SELECT * INTO asset_record FROM assets WHERE id = asset_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Asset with ID % not found', asset_id_param;
  END IF;
  
  -- Check if there's enough quantity
  IF asset_record.so_luong < quantity_param THEN
    RAISE EXCEPTION 'Not enough quantity available for asset "%". Available: %, Requested: %', 
      asset_record.ten_CSVC, asset_record.so_luong, quantity_param;
  END IF;
  
  -- Create the transfer record
  INSERT INTO asset_transfers (
    asset_id, 
    source_type, 
    source_id, 
    destination_type, 
    destination_id, 
    quantity, 
    transfer_date, 
    status, 
    notes, 
    created_at
  ) VALUES (
    asset_id_param,
    source_type_param,
    source_id_param,
    destination_type_param,
    destination_id_param,
    quantity_param,
    transfer_date_param,
    status_param,
    notes_param,
    NOW()
  ) RETURNING id INTO transfer_id;
  
  -- If the transfer is marked as completed immediately, update the asset quantity
  IF status_param = 'completed' THEN
    -- Reduce quantity from the source asset
    UPDATE assets 
    SET so_luong = so_luong - quantity_param 
    WHERE id = asset_id_param;
    
    -- Create or update an asset record for the destination if applicable
    -- This depends on your business logic
    -- For example, you might want to create a new asset record for the destination
    -- or update an existing one if the asset already exists at the destination
  END IF;
  
  RETURN QUERY SELECT * FROM asset_transfers WHERE id = transfer_id;
END;
$$ LANGUAGE plpgsql;
