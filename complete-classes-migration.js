import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.SUPABASE_URL || 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateClasses() {
  console.log('Completing classes table migration...');
  
  const classesData = JSON.parse(fs.readFileSync('./data_export/classes.json', 'utf8'));
  const records = classesData.records;
  
  const cleanedClasses = records.map(record => ({
    id: record.id,
    ten_lop: record.ten_lop,
    mo_ta: record.mo_ta || '',
    trinh_do: record.trinh_do || '',
    so_hoc_sinh_toi_da: record.so_hoc_sinh_toi_da || null,
    hoc_phi: record.hoc_phi || null,
    trang_thai: 'hoat_dong',
    ghi_chu: record.ghi_chu || '',
    created_at: record.created_at,
    updated_at: record.updated_at
  }));
  
  console.log(`Inserting ${cleanedClasses.length} classes...`);
  
  const { data, error } = await supabase
    .from('classes')
    .insert(cleanedClasses);
    
  if (error) {
    console.error('Error inserting classes:', error.message);
  } else {
    console.log('Successfully migrated classes table');
  }
  
  // Verify migration
  const { data: verifyData, error: verifyError } = await supabase
    .from('classes')
    .select('*');
    
  if (verifyError) {
    console.error('Error verifying classes:', verifyError.message);
  } else {
    console.log(`Verification: ${verifyData.length} classes in Supabase`);
  }
}

migrateClasses().catch(console.error);