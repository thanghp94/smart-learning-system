
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, Building, User, GraduationCap } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";

export type FilterOption = {
  label: string;
  value: string;
  type: 'facility' | 'employee' | 'student' | 'status' | 'other';
};

export type FilterCategory = {
  name: string;
  type: 'facility' | 'employee' | 'student' | 'status' | 'other';
  options: FilterOption[];
};

interface FilterButtonProps {
  onFilter: (filters: Record<string, string>) => void;
  categories: FilterCategory[];
  label?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  onFilter, 
  categories, 
  label = "Lọc"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  
  const handleFilterChange = (category: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [category]: value,
    };
    
    // If value is empty, remove the filter
    if (!value) {
      delete newFilters[category];
    }
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    onFilter({});
  };
  
  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };
  
  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'facility':
        return <Building className="h-4 w-4 mr-2" />;
      case 'employee':
        return <User className="h-4 w-4 mr-2" />;
      case 'student':
        return <GraduationCap className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            {label}
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 min-w-4 h-4 rounded-full">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Bộ lọc</h4>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-auto pr-1">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center">
                  {getCategoryIcon(category.type)}
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <Select
                  value={activeFilters[category.name] || ""}
                  onValueChange={(value) => handleFilterChange(category.name, value)}
                >
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {category.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterButton;
