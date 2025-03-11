
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw, Plus } from "lucide-react";
import FilterButton, { FilterCategory } from "@/components/ui/FilterButton";
import ExportButton from "@/components/ui/ExportButton";
import { Finance, Facility } from "@/lib/types";

interface FinanceActionsProps {
  facilities: Facility[];
  filteredFinances: Finance[];
  fetchFinances: () => Promise<void>;
  handleAddClick: () => void;
  handleFilter: (filters: Record<string, string>) => void;
}

const FinanceActions: React.FC<FinanceActionsProps> = ({ 
  facilities, 
  filteredFinances, 
  fetchFinances, 
  handleAddClick,
  handleFilter
}) => {
  // Filter categories
  const filterCategories: FilterCategory[] = [
    {
      name: "Cơ sở",
      type: "facility",
      options: facilities.map(facility => ({
        label: facility.ten_co_so || facility.id,
        value: facility.id,
        type: "facility"
      }))
    },
    {
      name: "Loại thu chi",
      type: "other",
      options: [
        { label: "Thu", value: "income", type: "other" },
        { label: "Chi", value: "expense", type: "other" }
      ]
    },
    {
      name: "Tình trạng",
      type: "status",
      options: [
        { label: "Hoàn thành", value: "completed", type: "status" },
        { label: "Chờ xử lý", value: "pending", type: "status" }
      ]
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFinances}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      
      <FilterButton 
        categories={filterCategories}
        onFilter={handleFilter}
        label="Lọc"
      />
      
      <ExportButton 
        data={filteredFinances} 
        filename="Danh_sach_tai_chinh" 
        label="Xuất dữ liệu"
      />
      
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Giao Dịch
      </Button>
    </div>
  );
};

export default FinanceActions;
