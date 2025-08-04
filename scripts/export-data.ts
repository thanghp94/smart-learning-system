import { storage } from './storage';
import * as fs from 'fs';
import * as path from 'path';

interface ExportResult {
  table: string;
  recordCount: number;
  success: boolean;
  filePath?: string;
  error?: string;
}

export class DataExporter {
  private results: ExportResult[] = [];
  private exportDir = './data_export';

  constructor() {
    // Create export directory if it doesn't exist
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  async exportTable(tableName: string): Promise<ExportResult> {
    try {
      console.log(`Exporting table: ${tableName}`);
      
      // Get data from PostgreSQL
      const query = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
      const pgData = await storage.executeQuery(query);
      const records = pgData.rows || pgData || [];
      
      if (!Array.isArray(records)) {
        return {
          table: tableName,
          recordCount: 0,
          success: true,
          error: 'No data to export'
        };
      }

      // Export to JSON file
      const fileName = `${tableName}.json`;
      const filePath = path.join(this.exportDir, fileName);
      
      const exportData = {
        table: tableName,
        exported_at: new Date().toISOString(),
        record_count: records.length,
        records: records
      };

      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

      return {
        table: tableName,
        recordCount: records.length,
        success: true,
        filePath: filePath
      };

    } catch (error) {
      console.error(`Export failed for ${tableName}:`, error);
      return {
        table: tableName,
        recordCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportAllTables(): Promise<ExportResult[]> {
    const tables = [
      'students', 'employees', 'facilities', 'classes', 'teaching_sessions',
      'enrollments', 'attendances', 'assets', 'tasks', 'files', 'contacts',
      'requests', 'employee_clock_ins', 'evaluations', 'payroll', 'admissions',
      'images', 'finances', 'asset_transfers', 'activities', 'events'
    ];

    console.log('Starting full database export...');
    
    for (const table of tables) {
      const result = await this.exportTable(table);
      this.results.push(result);
      console.log(`Export result for ${table}:`, result);
    }

    // Create summary file
    const summary = {
      exported_at: new Date().toISOString(),
      total_tables: this.results.length,
      successful_exports: this.results.filter(r => r.success).length,
      total_records: this.results.reduce((sum, r) => sum + r.recordCount, 0),
      results: this.results
    };

    fs.writeFileSync(
      path.join(this.exportDir, 'export_summary.json'), 
      JSON.stringify(summary, null, 2)
    );

    return this.results;
  }

  printSummary(): void {
    console.log('\n=== Export Summary ===');
    const successful = this.results.filter(r => r.success).length;
    const totalRecords = this.results.reduce((sum, r) => sum + r.recordCount, 0);
    
    console.log(`Tables exported: ${successful}/${this.results.length}`);
    console.log(`Total records exported: ${totalRecords}`);
    console.log(`Export directory: ${this.exportDir}`);
    
    const failed = this.results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('\nFailed exports:');
      failed.forEach(r => console.log(`- ${r.table}: ${r.error}`));
    }
  }
}

export async function exportAllData() {
  const exporter = new DataExporter();
  try {
    const results = await exporter.exportAllTables();
    exporter.printSummary();
    return results;
  } catch (error) {
    console.error('Export process failed:', error);
    throw error;
  }
}