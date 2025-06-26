
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "./types";

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  handlePrevPage, 
  handleNextPage 
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

export default Pagination;
