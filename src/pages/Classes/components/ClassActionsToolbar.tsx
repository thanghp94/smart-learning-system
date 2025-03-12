
import React from "react";
import { Plus, FileDown, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassFilters from "./ClassFilters";

interface ClassActionsToolbarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  onFilterChange: (field: string, value: string) => void;
  onResetFilters: () => void;
}

const ClassActionsToolbar: React.FC<ClassActionsToolbarProps> = ({
  onAddClick,
  onRefresh,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="flex items-center space-x-2">
      <ClassFilters 
        onFilterChange={onFilterChange} 
        onReset={onResetFilters} 
        currentFilters={{}}
      />
      
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Lớp Học
      </Button>
    </div>
  );
};

export default ClassActionsToolbar;
