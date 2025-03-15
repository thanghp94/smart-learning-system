
import { ReactNode } from "react";

export interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  render?: (value: any, record?: any) => ReactNode;
  header?: string; // For backward compatibility
  thumbnail?: boolean; // Support for thumbnail display
}

export interface DataTableProps<T> {
  columns: TableColumn[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (record: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  noDataMessage?: string; // For backward compatibility
  showHeader?: boolean;
}

export interface SortableTableHeaderProps {
  columns: TableColumn[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  handleSort: (key: string) => void;
}

export interface TableThumbnailProps {
  imageUrl?: string;
  label?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (value: number) => void;
  searchPlaceholder: string;
}

export interface LoadingSkeletonProps {
  columns: TableColumn[];
}
