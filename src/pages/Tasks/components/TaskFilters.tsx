
import React, { useState, useEffect } from 'react';
import { facilityService, employeeService } from '@/lib/supabase';
import { Facility, Employee } from '@/lib/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RotateCw } from 'lucide-react';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    assignee: string;
    facility: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string;
    priority: string;
    assignee: string;
    facility: string;
  }>>;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, setFilters }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [facilitiesData, employeesData] = await Promise.all([
          facilityService.getAll(),
          employeeService.getAll()
        ]);
        
        setFacilities(facilitiesData || []);
        setEmployees(employeesData || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      facility: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
        <Filter className="h-3.5 w-3.5" />
        Lọc
      </Button>
      
      <Select value={filters.facility} onValueChange={value => handleFilterChange('facility', value)}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo cơ sở" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tất cả cơ sở</SelectItem>
          {facilities.map(facility => (
            <SelectItem key={facility.id} value={facility.id}>
              {facility.ten_co_so}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filters.assignee} onValueChange={value => handleFilterChange('assignee', value)}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo nhân viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tất cả nhân viên</SelectItem>
          {employees.map(employee => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.ten_nhan_su}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
        <SelectTrigger className="h-8 w-[150px] text-xs">
          <SelectValue placeholder="Theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Đang chờ</SelectItem>
          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
          <SelectItem value="completed">Hoàn thành</SelectItem>
          <SelectItem value="cancelled">Đã hủy</SelectItem>
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleReset}
        >
          <RotateCw className="h-3.5 w-3.5 mr-1" />
          Đặt lại
        </Button>
      )}
    </div>
  );
};

export default TaskFilters;
