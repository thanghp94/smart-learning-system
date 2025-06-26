
import React from "react";
import { TableHead } from "@/components/ui/table";
import { SortableTableHeaderProps } from "./types";

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({ 
  columns, 
  sortColumn, 
  sortDirection, 
  handleSort 
}) => (
  <>
    {columns.map((column, index) => (
      <TableHead
        key={index}
        className={`${column.sortable ? "cursor-pointer select-none" : ""} ${column.className || ""}`}
        style={{ width: column.width }}
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
  </>
);

export default SortableTableHeader;
