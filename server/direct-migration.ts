import { Pool } from 'pg';
import { storage } from './storage';

interface DirectMigrationResult {
  table: string;
  success: boolean;
  recordCount: number;
  error?: string;
}

export class DirectMigration {
  private targetPool: Pool;
  private results: DirectMigrationResult[] = [];

  constructor(targetDatabaseUrl: string) {
    this.targetPool = new Pool({ 
      connectionString: targetDatabaseUrl,
      ssl: false
    });
  }

  async migrateTable(tableName: string): Promise<DirectMigrationResult> {
    try {
      console.log(`Starting direct migration for table: ${tableName}`);
      
      // Get data from source PostgreSQL
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

      // Create table in target database if it doesn't exist
      await this.createTableIfNotExists(tableName);

      // Insert records into target database
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
      console.error(`Direct migration failed for ${tableName}:`, error);
      return {
        table: tableName,
        success: false,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createTableIfNotExists(tableName: string): Promise<void> {
    // Get source table schema
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    const schemaResult = await storage.executeQuery(schemaQuery, [tableName]);
    const columns = schemaResult.rows || [];

    if (columns.length === 0) {
      throw new Error(`No schema found for table ${tableName}`);
    }

    // Build CREATE TABLE statement
    const columnDefs = columns.map((col: any) => {
      let def = `"${col.column_name}" ${col.data_type}`;
      if (col.is_nullable === 'NO') def += ' NOT NULL';
      if (col.column_default) def += ` DEFAULT ${col.column_default}`;
      return def;
    }).join(', ');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        ${columnDefs}
      )
    `;

    await this.targetPool.query(createTableQuery);
  }

  private async insertRecord(tableName: string, record: any): Promise<void> {
    const columns = Object.keys(record);
    const values = Object.values(record);
    
    const columnNames = columns.map(col => `"${col}"`).join(', ');
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const insertQuery = `
      INSERT INTO "${tableName}" (${columnNames}) 
      VALUES (${placeholders})
      ON CONFLICT DO NOTHING
    `;

    await this.targetPool.query(insertQuery, values);
  }

  async migrateAllTables(): Promise<DirectMigrationResult[]> {
    const tables = [
      'students', 'employees', 'facilities', 'classes', 'teaching_sessions',
      'enrollments', 'attendances', 'assets', 'tasks', 'files', 'contacts',
      'requests', 'employee_clock_ins', 'evaluations', 'payroll', 'admissions',
      'images', 'finances', 'asset_transfers', 'activities', 'events'
    ];

    console.log('Starting direct database migration...');
    
    for (const table of tables) {
      const result = await this.migrateTable(table);
      this.results.push(result);
      console.log(`Migration result for ${table}:`, result);
    }

    return this.results;
  }

  async close(): Promise<void> {
    await this.targetPool.end();
  }

  printSummary(): void {
    console.log('\n=== Direct Migration Summary ===');
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

export async function runDirectMigration(targetDatabaseUrl: string) {
  const migrator = new DirectMigration(targetDatabaseUrl);
  try {
    const results = await migrator.migrateAllTables();
    migrator.printSummary();
    return results;
  } catch (error) {
    console.error('Direct migration process failed:', error);
    throw error;
  } finally {
    await migrator.close();
  }
}