
import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employeeService, facilityService } from "@/lib/database";

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    assignee: string;
    facility: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: string;
      priority: string;
      assignee: string;
      facility: string;
    }>
  >;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, setFilters }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, facilitiesData] = await Promise.all([
          employeeService.getEmployees(),
          facilityService.getFacilities(),
        ]);
        setEmployees(employeesData || []);
        setFacilities(facilitiesData || []);
      } catch (error) {
        console.error('Error fetching data for task filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
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
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Đang chờ</SelectItem>
          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
          <SelectItem value="completed">Hoàn thành</SelectItem>
          <SelectItem value="cancelled">Đã huỷ</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) => handleFilterChange('priority', value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Ưu tiên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả mức độ</SelectItem>
          <SelectItem value="low">Thấp</SelectItem>
          <SelectItem value="medium">Trung bình</SelectItem>
          <SelectItem value="high">Cao</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assignee}
        onValueChange={(value) => handleFilterChange('assignee', value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Người phụ trách" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.ten_nhan_su}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.facility}
        onValueChange={(value) => handleFilterChange('facility', value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Cơ sở" />
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

      {(filters.status || filters.priority || filters.assignee || filters.facility) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() =>
            setFilters({
              status: 'all',
              priority: 'all',
              assignee: 'all',
              facility: 'all',
            })
          }
        >
          Đặt lại
        </Button>
      )}
    </div>
  );
};

export default TaskFilters;
