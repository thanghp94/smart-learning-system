
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableProps, TableColumn } from "./data-table/types";
import SortableTableHeader from "./data-table/SortableTableHeader";
import TableThumbnail from "./data-table/TableThumbnail";
import Pagination from "./data-table/Pagination";
import SearchBar from "./data-table/SearchBar";
import LoadingSkeleton from "./data-table/LoadingSkeleton";

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
