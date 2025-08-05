
import React, { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { facilityService } from "@/lib/database";
import { Input } from '@/components/ui/input';
import { Facility } from '@/lib/types';

interface ClassFiltersProps {
  onFilterChange: (field: string, value: string) => void;
  onResetFilters: () => void;
  currentFilters: {
    searchTerm?: string;
    facilityId?: string;
    status?: string;
    [key: string]: string | undefined;
  };
}

const ClassFilters: React.FC<ClassFiltersProps> = ({
  onFilterChange,
  onResetFilters,
  currentFilters,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await facilityService.getFacilities();
        setFacilities(data || []);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilities();
  }, []);

  // Check if any filter is active
  const hasActiveFilters = Object.entries(currentFilters).some(
    ([key, value]) => value && value.length > 0 && value !== 'none'
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('searchTerm', e.target.value);
  };

  const clearSearch = () => {
    onFilterChange('searchTerm', '');
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
        <Input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          className="h-8 w-60 pl-2 pr-8 text-sm"
          value={currentFilters.searchTerm || ''}
          onChange={handleSearchChange}
        />
        {currentFilters.searchTerm && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-background rounded-md border p-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs font-normal"
          disabled
        >
          <Filter className="h-3.5 w-3.5" />
          Bộ lọc
        </Button>

        <Select
          value={currentFilters.facilityId || 'none'}
          onValueChange={(value) => onFilterChange('facilityId', value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Cơ sở" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tất cả cơ sở</SelectItem>
            {facilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.ten_co_so}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.status || 'none'}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onResetFilters}
          >
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClassFilters;
