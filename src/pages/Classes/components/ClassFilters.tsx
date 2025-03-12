
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, RotateCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { facilityService } from "@/lib/supabase";
import { Facility } from "@/lib/types";

interface ClassFiltersProps {
  onFilterChange: (filter: { facility?: string, program?: string }) => void;
  onReset: () => void;
}

const ClassFilters: React.FC<ClassFiltersProps> = ({ onFilterChange, onReset }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const programs = [
    { id: 'toeic', name: 'TOEIC' },
    { id: 'ielts', name: 'IELTS' },
    { id: 'general', name: 'General English' },
    { id: 'kids', name: 'English for Kids' }
  ];

  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoading(true);
      try {
        const data = await facilityService.getAll();
        console.log("Successfully fetched", data?.length || 0, "records from facilities");
        setFacilities(data || []);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleFacilityChange = (value: string) => {
    setSelectedFacility(value);
    onFilterChange({ facility: value, program: selectedProgram });
  };

  const handleProgramChange = (value: string) => {
    setSelectedProgram(value);
    onFilterChange({ facility: selectedFacility, program: value });
  };

  const handleReset = () => {
    setSelectedFacility('');
    setSelectedProgram('');
    onReset();
  };

  return (
    <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
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
      
      <Select value={selectedProgram} onValueChange={handleProgramChange}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Theo chương trình học" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tất cả chương trình</SelectItem>
          {programs.map((program) => (
            <SelectItem key={program.id} value={program.id}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(selectedFacility || selectedProgram) && (
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

export default ClassFilters;
