import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, Building, User, GraduationCap, Factory, Check, Tag, Calendar } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

export type FilterType = 'status' | 'date' | 'other' | 'category' | 'student' | 'employee' | 'facility' | 'tuition';

export type FilterOption = {
  label: string;
  value: string;
  type: FilterType;
};

export type FilterCategory = {
  name: string;
  type: 'facility' | 'employee' | 'student' | 'status' | 'other' | 'date' | 'category';
  options: FilterOption[];
};

interface FilterButtonProps {
  onFilter: (filters: Record<string, string>) => void;
  categories: FilterCategory[];
  label?: string;
  initialFilters?: Record<string, string>;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  onFilter, 
  categories, 
  label = "Lọc",
  initialFilters = {}
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(initialFilters);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setActiveFilters(initialFilters);
      onFilter(initialFilters);
    }
  }, [initialFilters, onFilter]);
  
  const handleFilterChange = (category: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [category]: value,
    };
    
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
      case 'status':
        return <Tag className="h-4 w-4 mr-2" />;
      case 'date':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'category':
        return <Tag className="h-4 w-4 mr-2" />;
      case 'other':
        return <Factory className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {!isMobile && (
        <Button variant="outline" size="sm" className="h-8 mr-1" disabled>
          <Filter className="h-4 w-4 mr-2" />
          {label}
        </Button>
      )}
      
      <div className="flex flex-wrap gap-1 items-center">
        {categories.map((category) => (
          <Popover key={category.name}>
            <PopoverTrigger asChild>
              <Button 
                variant={activeFilters[category.name] ? "default" : "outline"} 
                size="sm" 
                className="h-8 gap-1"
              >
                {getCategoryIcon(category.type)}
                {category.name}
                {activeFilters[category.name] && (
                  <Badge variant="secondary" className="ml-1 px-1 min-w-4 h-4 rounded-full">
                    <Check className="h-3 w-3" />
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  {activeFilters[category.name] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleFilterChange(category.name, "")}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Xóa
                    </Button>
                  )}
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
              </div>
            </PopoverContent>
          </Popover>
        ))}
        
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterButton;
