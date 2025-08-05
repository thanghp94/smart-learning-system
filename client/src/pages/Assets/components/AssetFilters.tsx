
import React, { useState, useEffect } from "react";
import { facilityService, employeeService } from "@/lib/database";
import { Facility, Employee } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AssetFiltersProps {
  onFilterChange: (filters: { facility?: string, employee?: string }) => void;
  onReset: () => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({ onFilterChange, onReset }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<'facility' | 'employee'>('facility');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [facilitiesData, employeesData] = await Promise.all([
        facilityService.getFacilities(),
        employeeService.getEmployees()
      ]);

      setFacilities(facilitiesData || []);
      setEmployees(employeesData || []);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterModeChange = (value: string) => {
    setFilterMode(value as 'facility' | 'employee');
    
    // Reset selections
    if (value === 'facility') {
      setSelectedEmployee(undefined);
      if (selectedFacility) {
        onFilterChange({ facility: selectedFacility });
      } else {
        onReset();
      }
    } else {
      setSelectedFacility(undefined);
      if (selectedEmployee) {
        onFilterChange({ employee: selectedEmployee });
      } else {
        onReset();
      }
    }
  };

  const handleFacilityChange = (value: string) => {
    setSelectedFacility(value);
    onFilterChange({ facility: value, employee: selectedEmployee });
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    onFilterChange({ facility: selectedFacility, employee: value });
  };

  const handleResetFilters = () => {
    setSelectedFacility(undefined);
    setSelectedEmployee(undefined);
    onReset();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mr-2">
      <Tabs 
        defaultValue="facility" 
        value={filterMode}
        onValueChange={handleFilterModeChange}
      >
        <TabsList>
          <TabsTrigger value="facility">Theo cơ sở</TabsTrigger>
          <TabsTrigger value="employee">Theo nhân viên</TabsTrigger>
        </TabsList>
      </Tabs>

      {filterMode === 'facility' ? (
        <Select 
          value={selectedFacility} 
          onValueChange={handleFacilityChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn cơ sở" />
          </SelectTrigger>
          <SelectContent>
            {facilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.ten_co_so}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Select 
          value={selectedEmployee} 
          onValueChange={handleEmployeeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.ten_nhan_su}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {(selectedFacility || selectedEmployee) && (
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

export default AssetFilters;
