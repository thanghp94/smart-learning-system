
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, RotateCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { facilityService, employeeService } from "@/lib/supabase";
import { Facility, Employee } from "@/lib/types";

interface AssetFiltersProps {
  onFilterChange: (filter: { facility?: string, employee?: string }) => void;
  onReset: () => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({ onFilterChange, onReset }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
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

  const handleFacilityChange = (value: string) => {
    setSelectedFacility(value);
    onFilterChange({ facility: value, employee: selectedEmployee });
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    onFilterChange({ facility: selectedFacility, employee: value });
  };

  const handleReset = () => {
    setSelectedFacility('');
    setSelectedEmployee('');
    onReset();
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
            <Filter className="h-3.5 w-3.5" />
            Lọc
          </Button>
          
          <Select value={selectedFacility} onValueChange={handleFacilityChange}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue placeholder="Theo cơ sở" />
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
          
          <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
            <SelectTrigger className="h-8 w-[180px] text-xs ml-1">
              <SelectValue placeholder="Theo nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả nhân viên</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.ten_nhan_su}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(selectedFacility || selectedEmployee) && (
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
    </div>
  );
};

export default AssetFilters;
