
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
import { facilityService } from '@/lib/database';
import { Facility } from '@/lib/types';

interface EmployeeFiltersProps {
  onFilterChange: (filters: { facility: string; status: string }) => void;
  onResetFilters: () => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  onFilterChange,
  onResetFilters
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const handleFacilityChange = (value: string) => {
    setSelectedFacility(value);
    onFilterChange({ facility: value, status: selectedStatus });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilterChange({ facility: selectedFacility, status: value });
  };

  const handleResetFilters = () => {
    setSelectedFacility('all');
    setSelectedStatus('all');
    onResetFilters();
  };

  const hasActiveFilters = selectedFacility !== 'all' || selectedStatus !== 'all';

  return (
    <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
        <Filter className="h-3.5 w-3.5" />
        Bộ lọc
      </Button>
      
      <Select value={selectedFacility} onValueChange={handleFacilityChange}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo cơ sở" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả cơ sở</SelectItem>
          {facilities.map((facility) => (
            <SelectItem key={facility.id} value={facility.id}>
              {facility.ten_co_so}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Đang làm việc</SelectItem>
          <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
          <SelectItem value="maternity_leave">Nghỉ thai sản</SelectItem>
          <SelectItem value="on_leave">Tạm nghỉ</SelectItem>
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleResetFilters}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EmployeeFilters;
