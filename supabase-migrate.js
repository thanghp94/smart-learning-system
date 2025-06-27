import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'http://supabasekong-u08sgc0kgggw8gwsoo4gswc8.112.213.86.84.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MDk4Mzk2MCwiZXhwIjo0OTA2NjU3NTYwLCJyb2xlIjoiYW5vbiJ9.6qgWioaZ4cDwwsIQUJ73_YcjrZfA03h_3_Z7RXESYtM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Starting data migration to Supabase...');

// Tables with data to migrate
const tablesToMigrate = [
  { name: 'students', file: './data_export/students.json' },
  { name: 'employees', file: './data_export/employees.json' },
  { name: 'facilities', file: './data_export/facilities.json' },
  { name: 'classes', file: './data_export/classes.json' },
  { name: 'enrollments', file: './data_export/enrollments.json' }
];

let totalMigrated = 0;
let successfulTables = 0;

for (const table of tablesToMigrate) {
  try {
    const exportData = JSON.parse(fs.readFileSync(table.file, 'utf-8'));
    const records = exportData.records || exportData;
    
    if (records && records.length > 0) {
      console.log(`Migrating ${records.length} records to ${table.name}...`);
      
      const { error } = await supabase
        .from(table.name)
        .insert(records);
      
      if (error) {
        console.error(`Failed to migrate ${table.name}: ${error.message}`);
      } else {
        console.log(`✓ Successfully migrated ${records.length} records to ${table.name}`);
        totalMigrated += records.length;
        successfulTables++;
      }
    } else {
      console.log(`Skipping ${table.name} - no data`);
      successfulTables++;
    }
  } catch (error) {
    console.error(`Error with ${table.name}: ${error.message}`);
  }
}

console.log(`\nMigration completed: ${successfulTables}/${tablesToMigrate.length} tables, ${totalMigrated} total records migrated`);