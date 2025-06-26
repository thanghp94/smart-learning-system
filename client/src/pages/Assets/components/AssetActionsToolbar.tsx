
import React from "react";
import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssetFilters from "./AssetFilters";

interface AssetActionsToolbarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  onFilterChange: (filters: { facility?: string, employee?: string }) => void;
  onResetFilters: () => void;
}

const AssetActionsToolbar: React.FC<AssetActionsToolbarProps> = ({
  onAddClick,
  onRefresh,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="flex items-center space-x-2">
      <AssetFilters 
        onFilterChange={onFilterChange} 
        onReset={onResetFilters} 
      />
      
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Tài Sản
      </Button>
    </div>
  );
};

export default AssetActionsToolbar;
