
export interface TableColumn<T = any> {
  title: string;
  key?: string;
  accessorKey?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<TData = any> {
  columns: TableColumn<TData>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}
