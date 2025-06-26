
-- Insert CS1, CS2, CS3, CS4 enum values for facilities
INSERT INTO enums (id, category, value, display_text, sort_order, is_active) VALUES
  (gen_random_uuid(), 'co_so', 'CS1', 'Cơ sở 1', 1, true),
  (gen_random_uuid(), 'co_so', 'CS2', 'Cơ sở 2', 2, true),
  (gen_random_uuid(), 'co_so', 'CS3', 'Cơ sở 3', 3, true),
  (gen_random_uuid(), 'co_so', 'CS4', 'Cơ sở 4', 4, true)
ON CONFLICT (category, value) DO NOTHING;
