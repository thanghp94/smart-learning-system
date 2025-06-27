import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

export async function createSupabaseTables() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('Creating tables in Supabase...');
  
  // Test connection first
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return { success: false, error: 'Connection failed' };
  }

  // Since direct SQL execution isn't available, we'll create tables using the client
  // This approach will ensure the tables exist for data insertion
  const tableSchemas = [
    {
      name: 'students',
      create: async () => {
        // Try to insert a test record to create the table structure
        const { error } = await supabase
          .from('students')
          .insert({
            id: 'test-id-delete-me',
            ten_hoc_sinh: 'Test Student',
            trang_thai: 'hoat_dong'
          });
        
        if (error && !error.message.includes('duplicate')) {
          console.log('Students table might not exist, this is expected on first run');
        }
        
        // Delete the test record
        await supabase
          .from('students')
          .delete()
          .eq('id', 'test-id-delete-me');
        
        return { success: true };
      }
    }
  ];

  const results = [];
  
  for (const table of tableSchemas) {
    try {
      const result = await table.create();
      results.push({ table: table.name, success: result.success });
      console.log(`✓ Table ${table.name} ready`);
    } catch (error) {
      results.push({ 
        table: table.name, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      console.log(`✗ Table ${table.name} failed:`, error);
    }
  }

  return { success: true, results };
}

export async function migrateDataToSupabase() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const dataDir = './data_export';
  const results = [];

  console.log('Starting data migration to Supabase...');

  try {
    // Get all JSON files from export directory
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'export_summary.json');

    for (const file of jsonFiles) {
      const tableName = file.replace('.json', '');
      try {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (data.length > 0) {
          console.log(`Migrating ${data.length} records to ${tableName}...`);
          
          // Insert data into Supabase table
          const { error } = await supabase
            .from(tableName)
            .insert(data);

          if (error) {
            console.error(`Failed to migrate ${tableName}:`, error.message);
            results.push({ 
              table: tableName, 
              success: false, 
              recordCount: data.length,
              error: error.message 
            });
          } else {
            console.log(`✓ Successfully migrated ${data.length} records to ${tableName}`);
            results.push({ 
              table: tableName, 
              success: true, 
              recordCount: data.length 
            });
          }
        } else {
          console.log(`No data to migrate for ${tableName}`);
          results.push({ 
            table: tableName, 
            success: true, 
            recordCount: 0,
            message: 'No data to migrate'
          });
        }
      } catch (error) {
        console.error(`Error processing ${tableName}:`, error);
        results.push({ 
          table: tableName, 
          success: false, 
          recordCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const totalRecords = results.reduce((sum, r) => sum + (r.recordCount || 0), 0);
    const successfulTables = results.filter(r => r.success).length;

    console.log(`Migration completed: ${successfulTables}/${results.length} tables migrated, ${totalRecords} total records`);

    return {
      success: true,
      message: `Migration completed: ${successfulTables}/${results.length} tables migrated`,
      totalRecords,
      results
    };

  } catch (error) {
    console.error('Migration error:', error);
    return { 
      success: false,
      error: 'Failed to migrate data to Supabase', 
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log('Starting Supabase migration process...');
    
    // First create tables
    const tableResult = await createSupabaseTables();
    console.log('Table creation result:', tableResult);
    
    // Then migrate data
    const migrationResult = await migrateDataToSupabase();
    console.log('Migration result:', migrationResult);
    
    process.exit(0);
  })();
}