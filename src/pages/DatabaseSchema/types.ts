
// Table information structure
export interface TableInfo {
  name: string;
  vietnameseName: string;
  purpose: string;
  key: string;
}

// View information structure
export interface ViewInfo {
  name: string;
  purpose: string;
  key: string;
}

// Table category structure
export interface TableCategory {
  name: string;
  key: string;
  tables: TableInfo[];
}

// Database schema information
export interface SchemaInfo {
  table_name: string;
  column_count: number;
}
