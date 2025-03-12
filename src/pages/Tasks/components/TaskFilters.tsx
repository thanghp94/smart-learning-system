
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
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
import { employeeService, facilityService } from '@/lib/supabase';
import { Employee, Facility } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, facilitiesData] = await Promise.all([
          employeeService.getAll(),
          facilityService.getAll()
        ]);
        setEmployees(employeesData || []);
        setFacilities(facilitiesData || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchData();
  }, []);

  const handleReset = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      facility: '',
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="h-4 w-4 mr-1" /> Bộ lọc
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="space-y-4">
          <h4 className="font-medium">Lọc công việc</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cấp độ</label>
              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  setFilters({ ...filters, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả cấp độ</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Người phụ trách</label>
              <Select
                value={filters.assignee}
                onValueChange={(value) =>
                  setFilters({ ...filters, assignee: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả người phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả người phụ trách</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cơ sở</label>
              <Select
                value={filters.facility}
                onValueChange={(value) =>
                  setFilters({ ...filters, facility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả cơ sở" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả cơ sở</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.ten_co_so}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Đặt lại
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilters;
