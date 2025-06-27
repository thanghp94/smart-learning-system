import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateDataToSupabase() {
  console.log('Starting data migration to Supabase...');
  
  const exportDir = './data_export';
  const results = [];
  
  // List of tables to migrate with their corresponding files
  const tablesToMigrate = [
    'classes'
  ];
  
  for (const table of tablesToMigrate) {
    const filePath = path.join(exportDir, `${table}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${table} - no data file found`);
      continue;
    }
    
    try {
      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // Extract records array from the wrapper object
      const data = fileContent.records || fileContent;
      console.log(`Migrating ${data.length} records to ${table}...`);
      
      if (data.length === 0) {
        console.log(`No data to migrate for ${table}`);
        results.push({ table, success: true, recordCount: 0 });
        continue;
      }
      
      // Clean the data by removing any columns that don't exist in Supabase schema
      const cleanedData = data.map(record => {
        let cleanRecord = { ...record };
        
        // Remove columns that don't exist in Supabase schema
        delete cleanRecord.exported_at;
        delete cleanRecord.ma_hoc_sinh;
        delete cleanRecord.ngay_nhap_hoc;
        delete cleanRecord.bo_phan; // employees table
        delete cleanRecord.hinh_anh; // employees table
        delete cleanRecord.ten_ngan; // employees table
        delete cleanRecord.email; // facilities table  
        delete cleanRecord.so_dien_thoai; // facilities table
        delete cleanRecord.co_so; // classes table
        delete cleanRecord.ct_hoc; // classes table
        delete cleanRecord.ten_lop_full; // classes table
        delete cleanRecord.gv_chinh; // classes table
        delete cleanRecord.ngay_bat_dau; // classes table
        delete cleanRecord.tinh_trang; // classes table - using trang_thai instead
        delete cleanRecord.class_id; // enrollments table
        delete cleanRecord.student_id; // enrollments table
        delete cleanRecord.ngay_dang_ky; // enrollments table
        
        // Fix status field mapping
        if (cleanRecord.trang_thai === 'active') {
          cleanRecord.trang_thai = 'hoat_dong';
        }
        if (cleanRecord.trang_thai === 'inactive') {
          cleanRecord.trang_thai = 'hoat_dong'; // Default to active for inactive records
        }
        if (cleanRecord.tinh_trang === 'active') {
          cleanRecord.trang_thai = 'hoat_dong';
          delete cleanRecord.tinh_trang;
        }
        
        return cleanRecord;
      });
      
      // Insert data into Supabase
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(cleanedData);
      
      if (error) {
        console.error(`Failed to migrate ${table}:`, error.message);
        results.push({ table, success: false, recordCount: 0, error: error.message });
      } else {
        console.log(`Successfully migrated ${data.length} records to ${table}`);
        results.push({ table, success: true, recordCount: data.length });
      }
      
    } catch (error) {
      console.error(`Error migrating ${table}:`, error.message);
      results.push({ table, success: false, recordCount: 0, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n=== Migration Summary ===');
  const successful = results.filter(r => r.success);
  const totalRecords = successful.reduce((sum, r) => sum + r.recordCount, 0);
  
  console.log(`Successfully migrated: ${successful.length}/${results.length} tables`);
  console.log(`Total records migrated: ${totalRecords}`);
  
  results.forEach(result => {
    const status = result.success ? '✓' : '✗';
    console.log(`${status} ${result.table}: ${result.recordCount} records${result.error ? ` (${result.error})` : ''}`);
  });
  
  return results;
}

// Run migration
migrateDataToSupabase()
  .then(() => {
    console.log('\nMigration completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });