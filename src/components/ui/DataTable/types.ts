
import { ColumnDef } from '@tanstack/react-table';

export interface TableColumn {
  title: string;
  key?: string;
  accessorKey?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}
