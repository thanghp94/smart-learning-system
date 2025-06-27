import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

async function migrateToSupabase() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const dataDir = './data_export';
  
  console.log('Starting migration to Supabase...');
  
  // Read the export summary to get the tables with data
  const summaryPath = path.join(dataDir, 'export_summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  
  const results = [];
  
  for (const tableInfo of summary.results) {
    if (tableInfo.recordCount > 0) {
      const filePath = tableInfo.filePath;
      const tableName = tableInfo.table;
      
      try {
        console.log(`Migrating ${tableInfo.recordCount} records to ${tableName}...`);
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Insert data in batches to avoid overwhelming the API
        const batchSize = 100;
        let successCount = 0;
        
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from(tableName)
            .insert(batch);
          
          if (error) {
            console.error(`Error inserting batch for ${tableName}:`, error.message);
            break;
          } else {
            successCount += batch.length;
          }
        }
        
        if (successCount === data.length) {
          console.log(`✓ Successfully migrated ${successCount} records to ${tableName}`);
          results.push({ table: tableName, success: true, recordCount: successCount });
        } else {
          console.log(`⚠ Partially migrated ${successCount}/${data.length} records to ${tableName}`);
          results.push({ table: tableName, success: false, recordCount: successCount, expected: data.length });
        }
        
      } catch (error) {
        console.error(`✗ Failed to migrate ${tableName}:`, error.message);
        results.push({ table: tableName, success: false, error: error.message });
      }
    } else {
      console.log(`Skipping ${tableName} - no data to migrate`);
      results.push({ table: tableName, success: true, recordCount: 0, message: 'No data to migrate' });
    }
  }
  
  // Summary
  const totalTables = results.length;
  const successfulTables = results.filter(r => r.success).length;
  const totalRecords = results.reduce((sum, r) => sum + (r.recordCount || 0), 0);
  
  console.log('\n=== Migration Summary ===');
  console.log(`Tables: ${successfulTables}/${totalTables} successful`);
  console.log(`Records: ${totalRecords} total migrated`);
  console.log('\nDetailed Results:');
  
  results.forEach(result => {
    const status = result.success ? '✓' : '✗';
    const records = result.recordCount || 0;
    console.log(`${status} ${result.table}: ${records} records`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  return { success: true, results, totalRecords, successfulTables, totalTables };
}

// Run the migration
migrateToSupabase()
  .then(result => {
    console.log('\nMigration completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });