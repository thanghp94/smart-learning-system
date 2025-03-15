
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
export interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  render?: (value: any, record?: any) => React.ReactNode;
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

// Components
const SortableTableHeader = <T,>({ 
  columns, 
  sortColumn, 
  sortDirection, 
  handleSort 
}: { 
  columns: TableColumn[]; 
  sortColumn: string | null; 
  sortDirection: "asc" | "desc"; 
  handleSort: (key: string) => void; 
}) => (
  <TableHead>
    {columns.map((column, index) => (
      <TableHead
        key={index}
        className={column.sortable ? "cursor-pointer select-none" : ""}
        onClick={() => column.sortable && handleSort(column.key)}
      >
        <div className="flex items-center">
          {column.title || column.header}
          {sortColumn === column.key && (
            <span className="ml-1">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </TableHead>
    ))}
  </TableHead>
);

const TableThumbnail = ({ imageUrl, label }: { imageUrl?: string; label?: string }) => (
  <div className="flex items-center">
    <Avatar className="h-8 w-8 mr-3">
      <AvatarImage src={imageUrl} alt={label || "Thumbnail"} />
      <AvatarFallback>
        <Image className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <span>{label || "N/A"}</span>
  </div>
);

const Pagination = ({ 
  currentPage, 
  totalPages, 
  handlePrevPage, 
  handleNextPage 
}: { 
  currentPage: number; 
  totalPages: number; 
  handlePrevPage: () => void; 
  handleNextPage: () => void; 
}) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrevPage}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <div className="text-sm text-muted-foreground">
      Page {currentPage} of {totalPages}
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  setCurrentPage, 
  searchPlaceholder 
}: { 
  searchQuery: string; 
  setSearchQuery: (value: string) => void; 
  setCurrentPage: (value: number) => void; 
  searchPlaceholder: string; 
}) => (
  <div className="flex w-full items-center space-x-2 mb-4">
    <Search className="h-4 w-4 text-muted-foreground ml-2" />
    <Input
      placeholder={searchPlaceholder}
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
      }}
      className="w-full h-9 pl-8 -ml-6"
    />
  </div>
);

const LoadingSkeleton = ({ columns }: { columns: TableColumn[] }) => (
  <div className="w-full">
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

// Main component
function DataTable<T>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  noDataMessage, // For backward compatibility
  showHeader = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 15;

  // Use noDataMessage for backward compatibility
  const finalEmptyMessage = noDataMessage || emptyMessage;

  // Search and sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search
    if (searchQuery) {
      filtered = filtered.filter((item: any) => {
        return columns.some((column) => {
          const value = item[column.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a: any, b: any) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        // Handle null/undefined values
        if (valueA === null || valueA === undefined) return sortDirection === "asc" ? -1 : 1;
        if (valueB === null || valueB === undefined) return sortDirection === "asc" ? 1 : -1;

        // String comparison
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // Number comparison
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        {searchable && <div className="flex w-full items-center space-x-2 mb-4"><Skeleton className="h-10 w-full" /></div>}
        <LoadingSkeleton columns={columns} />
      </div>
    );
  }

  // Show empty state if no data
  if (data.length === 0) {
    return (
      <div className="w-full py-8 text-center text-muted-foreground">
        {finalEmptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchable && (
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setCurrentPage={setCurrentPage} 
          searchPlaceholder={searchPlaceholder} 
        />
      )}
      <div className="rounded-md border">
        <Table>
          {showHeader && (
            <TableHeader>
              <TableRow>
                <SortableTableHeader 
                  columns={columns} 
                  sortColumn={sortColumn} 
                  sortDirection={sortDirection} 
                  handleSort={handleSort} 
                />
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {finalEmptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((record: any, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer hover:bg-accent" : ""}
                  onClick={() => onRowClick && onRowClick(record)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.thumbnail ? (
                        <TableThumbnail imageUrl={record.hinh_anh} label={record[column.key]} />
                      ) : column.render ? (
                        column.render(record[column.key], record)
                      ) : (
                        record[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          handlePrevPage={handlePrevPage} 
          handleNextPage={handleNextPage} 
        />
      )}
    </div>
  );
}

export default DataTable;
