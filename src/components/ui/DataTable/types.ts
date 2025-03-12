
import { ColumnDef } from '@tanstack/react-table';

export type TableColumn = ColumnDef<any>;

export interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}
