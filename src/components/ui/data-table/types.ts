
import React from "react";

export interface TableColumn {
  title?: string;
  header?: string;
  key: string;
  render?: (value: any, record?: any) => React.ReactNode;
  sortable?: boolean;
  thumbnail?: boolean;
  width?: string;
  className?: string;
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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  searchPlaceholder: string;
}

export interface TableThumbnailProps {
  imageUrl?: string;
  label?: string;
}

export interface LoadingSkeletonProps {
  columns: TableColumn[];
}
