
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee, Facility } from '@/lib/types';

interface ScheduleFiltersProps {
  teachers: Employee[];
  facilities: Facility[];
  selectedTeacher: string | null;
  selectedFacility: string | null;
  filterMode: 'teacher' | 'facility';
  onTeacherChange: (value: string) => void;
  onFacilityChange: (value: string) => void;
  onFilterModeChange: (value: string) => void;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  teachers,
  facilities,
  selectedTeacher,
  selectedFacility,
  filterMode,
  onTeacherChange,
  onFacilityChange,
  onFilterModeChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs 
        defaultValue="teacher" 
        value={filterMode}
        onValueChange={onFilterModeChange}
        className="mr-4"
      >
        <TabsList>
          <TabsTrigger value="teacher">Theo giáo viên</TabsTrigger>
          <TabsTrigger value="facility">Theo cơ sở</TabsTrigger>
        </TabsList>
      </Tabs>

      {filterMode === 'teacher' ? (
        <Select value={selectedTeacher || ''} onValueChange={onTeacherChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn giáo viên" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.ten_nhan_su}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Select value={selectedFacility || ''} onValueChange={onFacilityChange}>
          <SelectTrigger className="w-[200px]">
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
      )}
    </div>
  );
};

export default ScheduleFilters;
