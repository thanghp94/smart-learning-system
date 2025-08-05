
import React, { useEffect, useState } from 'react';
import { classService, facilityService } from "@/lib/database";
import { Class, Facility } from '@/lib/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RotateCw } from 'lucide-react';

interface EnrollmentFiltersProps {
  onFilterChange: (field: string, value: string) => void;
  filters: Record<string, string>;
  onReset: () => void;
}

const EnrollmentFilters: React.FC<EnrollmentFiltersProps> = ({ 
  onFilterChange, 
  filters, 
  onReset 
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [classesData, facilitiesData] = await Promise.all([
          classService.getClasses(),
          facilityService.getFacilities()
        ]);
        
        setClasses(classesData || []);
        setFacilities(facilitiesData || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
        <Filter className="h-3.5 w-3.5" />
        Lọc
      </Button>
      
      <Select 
        value={filters.classId || "none"} 
        onValueChange={(value) => onFilterChange('classId', value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo lớp học" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Tất cả lớp học</SelectItem>
          {classes.map(c => (
            <SelectItem key={c.id} value={c.id}>
              {c.ten_lop_full || c.ten_lop}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={filters.facilityId || "none"} 
        onValueChange={(value) => onFilterChange('facilityId', value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo cơ sở" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Tất cả cơ sở</SelectItem>
          {facilities.map(f => (
            <SelectItem key={f.id} value={f.id}>
              {f.ten_co_so}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={onReset}
        >
          <RotateCw className="h-3.5 w-3.5 mr-1" />
          Đặt lại
        </Button>
      )}
    </div>
  );
};

export default EnrollmentFilters;
