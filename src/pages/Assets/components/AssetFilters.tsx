
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { facilityService, employeeService } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface AssetFiltersProps {
  onFilterChange: (filters: { facility?: string; employee?: string }) => void;
  onReset: () => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({ onFilterChange, onReset }) => {
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>();
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilitiesData, employeesData] = await Promise.all([
          facilityService.getAll(),
          employeeService.getAll()
        ]);

        const mappedFacilities = facilitiesData.map(facility => ({
          id: facility.id,
          name: facility.ten_co_so || 'Unnamed Facility'
        }));

        const mappedEmployees = employeesData.map(employee => ({
          id: employee.id,
          name: employee.ten_nhan_su || 'Unnamed Employee'
        }));

        setFacilities(mappedFacilities);
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    onFilterChange({
      facility: selectedFacility,
      employee: selectedEmployee
    });
  }, [selectedFacility, selectedEmployee, onFilterChange]);

  const handleReset = () => {
    setSelectedFacility(undefined);
    setSelectedEmployee(undefined);
    onReset();
  };

  return (
    <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-normal" disabled>
        <Filter className="h-3.5 w-3.5" />
        Lọc
      </Button>
      
      <Popover open={facilityOpen} onOpenChange={setFacilityOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={facilityOpen}
            className="w-[180px] h-8 justify-between text-xs"
            size="sm"
          >
            {selectedFacility
              ? facilities.find((facility) => facility.id === selectedFacility)?.name || "Cơ sở"
              : "Theo cơ sở"}
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Tìm cơ sở..." className="h-9" />
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {facilities.map((facility) => (
                <CommandItem
                  key={facility.id}
                  value={facility.id}
                  onSelect={() => {
                    setSelectedFacility(selectedFacility === facility.id ? undefined : facility.id);
                    setFacilityOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFacility === facility.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {facility.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={employeeOpen} onOpenChange={setEmployeeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={employeeOpen}
            className="w-[180px] h-8 justify-between text-xs"
            size="sm"
          >
            {selectedEmployee
              ? employees.find((employee) => employee.id === selectedEmployee)?.name || "Nhân viên"
              : "Theo nhân viên"}
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Tìm nhân viên..." className="h-9" />
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.id}
                  value={employee.id}
                  onSelect={() => {
                    setSelectedEmployee(selectedEmployee === employee.id ? undefined : employee.id);
                    setEmployeeOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedEmployee === employee.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {employee.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {(selectedFacility || selectedEmployee) && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 text-xs"
          onClick={handleReset}
        >
          Đặt lại
        </Button>
      )}
    </div>
  );
};

export default AssetFilters;
