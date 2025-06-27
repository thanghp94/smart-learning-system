import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table mapping for migration
const TABLES = [
  'students',
  'employees', 
  'facilities',
  'classes',
  'teaching_sessions',
  'enrollments',
  'attendances',
  'assets',
  'asset_transfers',
  'tasks',
  'files',
  'contacts',
  'requests',
  'employee_clock_ins',
  'evaluations',
  'payroll',
  'admissions',
  'images',
  'finances',
  'finance_transaction_types',
  'activities',
  'events',
  'sessions',
  'settings'
];

interface MigrationResult {
  table: string;
  success: boolean;
  recordCount: number;
  error?: string;
}

class DataMigrator {
  private results: MigrationResult[] = [];

  async migrateTable(tableName: string): Promise<MigrationResult> {
    try {
      console.log(`Starting migration for table: ${tableName}`);
      
      // Get all data from PostgreSQL
      const response = await fetch(`http://localhost:5000/api/${tableName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${tableName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`No data found in table: ${tableName}`);
        return { table: tableName, success: true, recordCount: 0 };
      }

      console.log(`Found ${data.length} records in ${tableName}`);
      
      // Insert data into Supabase in batches
      const batchSize = 100;
      let totalInserted = 0;
      
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from(tableName)
          .insert(batch);
          
        if (error) {
          throw new Error(`Supabase insert error for ${tableName}: ${error.message}`);
        }
        
        totalInserted += batch.length;
        console.log(`Migrated ${totalInserted}/${data.length} records for ${tableName}`);
      }
      
      return { 
        table: tableName, 
        success: true, 
        recordCount: totalInserted 
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Migration failed for ${tableName}:`, errorMessage);
      
      return { 
        table: tableName, 
        success: false, 
        recordCount: 0, 
        error: errorMessage 
      };
    }
  }

  async migrateAllTables(): Promise<MigrationResult[]> {
    console.log('Starting data migration from PostgreSQL to Supabase...');
    console.log(`Migrating ${TABLES.length} tables`);
    
    this.results = [];
    
    for (const table of TABLES) {
      const result = await this.migrateTable(table);
      this.results.push(result);
      
      // Add delay between tables to avoid overwhelming the services
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return this.results;
  }

  printSummary(): void {
    console.log('\n=== Migration Summary ===');
    
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);
    const totalRecords = successful.reduce((sum, r) => sum + r.recordCount, 0);
    
    console.log(`Total tables: ${this.results.length}`);
    console.log(`Successfully migrated: ${successful.length}`);
    console.log(`Failed: ${failed.length}`);
    console.log(`Total records migrated: ${totalRecords}`);
    
    if (successful.length > 0) {
      console.log('\n✅ Successful migrations:');
      successful.forEach(r => {
        console.log(`  ${r.table}: ${r.recordCount} records`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed migrations:');
      failed.forEach(r => {
        console.log(`  ${r.table}: ${r.error}`);
      });
    }
  }
}

// Export for use in other files
export { DataMigrator };

// Run migration if called directly
async function runMigration() {
  try {
    const migrator = new DataMigrator();
    await migrator.migrateAllTables();
    migrator.printSummary();
    
    console.log('\nMigration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}