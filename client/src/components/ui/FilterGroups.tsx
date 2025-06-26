
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from './button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface FilterOption {
  label: string;
  value: string;
  type: string;
}

export interface FilterGroupProps {
  filters: Record<string, {
    label: string;
    options: FilterOption[];
  }>;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
}

const FilterGroups: React.FC<FilterGroupProps> = ({
  filters,
  values,
  onChange,
  onReset,
}) => {
  const hasFilters = Object.keys(filters).length > 0;
  const hasActiveFilters = Object.values(values).some(value => value !== '');
  
  if (!hasFilters) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm" 
          className="h-8"
        >
          <Filter className="h-4 w-4 mr-1" /> 
          {hasActiveFilters ? 'Bộ lọc đang áp dụng' : 'Bộ lọc'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="space-y-4">
          <h4 className="font-medium">Bộ lọc</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(filters).map(([key, filter]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                <Select
                  value={values[key] || ''}
                  onValueChange={(value) => onChange(key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Tất cả ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {`Tất cả ${filter.label.toLowerCase()}`}
                    </SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {onReset && (
            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={onReset}>
                Đặt lại
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterGroups;
