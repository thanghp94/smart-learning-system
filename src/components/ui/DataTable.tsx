
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableProps, TableColumn } from "@/lib/types";
import { PAGE_SIZES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function DataTable<T>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  pagination,
  searchable = true,
  searchPlaceholder = "Tìm kiếm..."
}: DataTableProps<T>) {
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  useEffect(() => {
    let filteredData = [...data];
    
    // Apply search filter if searchTerm exists
    if (searchTerm) {
      filteredData = filteredData.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Apply sorting if sortConfig exists
    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue === bValue) return 0;
        
        // Handle different data types appropriately
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === "ascending"
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
    }
    
    setSortedData(filteredData);
    
    if (pagination) {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize);
    }
  }, [data, searchTerm, sortConfig, pagination]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const handlePageChange = (newPage: number) => {
    if (pagination) {
      pagination.onChange(newPage, pageSize);
    } else {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (pagination) {
      pagination.onChange(1, newSize);
    } else {
      setPageSize(newSize);
      setCurrentPage(1);
    }
  };

  // Calculate pagination values
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize;
  const endItem = Math.min(startItem + pageSize, totalItems);
  const paginatedData = sortedData.slice(startItem, endItem);

  return (
    <div className="rounded-lg bg-card animate-scale-in">
      {searchable && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium",
                    column.width && column.width,
                    column.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && sortConfig?.key === column.key && (
                      sortConfig.direction === 'ascending' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                    <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                    <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/30"
                  )}
                  onClick={() => onRowClick && onRowClick(record)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.render 
                        ? column.render(record[column.key as keyof T], record)
                        : String(record[column.key as keyof T] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {startItem + 1}-{endItem} / {totalItems} mục
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pages around current page
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
