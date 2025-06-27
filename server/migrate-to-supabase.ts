import { storage } from "./storage";
import { supabaseStorage } from "./supabase-storage";

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
      
      // Get data from PostgreSQL
      const query = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
      const pgData = await storage.executeQuery(query);
      const records = pgData.rows || pgData || [];
      
      if (!Array.isArray(records) || records.length === 0) {
        return {
          table: tableName,
          success: true,
          recordCount: 0,
          error: 'No data to migrate'
        };
      }

      // Insert data into Supabase using appropriate method
      let insertedCount = 0;
      for (const record of records) {
        try {
          await this.insertRecord(tableName, record);
          insertedCount++;
        } catch (error) {
          console.error(`Failed to insert record in ${tableName}:`, error);
        }
      }

      return {
        table: tableName,
        success: insertedCount > 0,
        recordCount: insertedCount,
        error: insertedCount === 0 ? 'Failed to insert any records' : undefined
      };

    } catch (error) {
      console.error(`Migration failed for ${tableName}:`, error);
      return {
        table: tableName,
        success: false,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async insertRecord(tableName: string, record: any): Promise<void> {
    // Map table names to Supabase storage methods
    const methodMap: Record<string, string> = {
      'students': 'createStudent',
      'employees': 'createEmployee',
      'facilities': 'createFacility',
      'classes': 'createClass',
      'teaching_sessions': 'createTeachingSession',
      'enrollments': 'createEnrollment',
      'attendances': 'createAttendance',
      'assets': 'createAsset',
      'tasks': 'createTask',
      'files': 'createFile',
      'contacts': 'createContact',
      'requests': 'createRequest',
      'employee_clock_ins': 'createEmployeeClockIn',
      'evaluations': 'createEvaluation',
      'payroll': 'createPayroll',
      'admissions': 'createAdmission',
      'images': 'createImage',
      'finances': 'createFinance',
      'asset_transfers': 'createAssetTransfer',
      'activities': 'createActivity',
      'events': 'createEvent'
    };

    const methodName = methodMap[tableName];
    if (!methodName) {
      throw new Error(`No migration method found for table: ${tableName}`);
    }

    const method = (supabaseStorage as any)[methodName];
    if (typeof method !== 'function') {
      throw new Error(`Method ${methodName} not found in Supabase storage`);
    }

    // Remove PostgreSQL-specific fields
    const { created_at, updated_at, ...cleanRecord } = record;
    
    await method.call(supabaseStorage, cleanRecord);
  }

  async migrateAllTables(): Promise<MigrationResult[]> {
    const tables = [
      'students', 'employees', 'facilities', 'classes', 'teaching_sessions',
      'enrollments', 'attendances', 'assets', 'tasks', 'files', 'contacts',
      'requests', 'employee_clock_ins', 'evaluations', 'payroll', 'admissions',
      'images', 'finances', 'asset_transfers', 'activities', 'events'
    ];

    console.log('Starting full database migration to Supabase...');
    
    for (const table of tables) {
      const result = await this.migrateTable(table);
      this.results.push(result);
      console.log(`Migration result for ${table}:`, result);
    }

    return this.results;
  }

  printSummary(): void {
    console.log('\n=== Migration Summary ===');
    const successful = this.results.filter(r => r.success).length;
    const totalRecords = this.results.reduce((sum, r) => sum + r.recordCount, 0);
    
    console.log(`Tables migrated: ${successful}/${this.results.length}`);
    console.log(`Total records migrated: ${totalRecords}`);
    
    const failed = this.results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('\nFailed migrations:');
      failed.forEach(r => console.log(`- ${r.table}: ${r.error}`));
    }
  }
}

async function runMigration() {
  const migrator = new DataMigrator();
  try {
    await migrator.migrateAllTables();
    migrator.printSummary();
  } catch (error) {
    console.error('Migration process failed:', error);
  }
}

export { DataMigrator, runMigration };
export type { MigrationResult };