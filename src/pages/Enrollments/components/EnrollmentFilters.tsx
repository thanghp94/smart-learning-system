
import React, { useEffect, useState } from 'react';
import { classService, facilityService } from '@/lib/supabase';
import { Class, Facility } from '@/lib/types';
import FilterGroups from '@/components/ui/FilterGroups';

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [classesData, facilitiesData] = await Promise.all([
          classService.getAll(),
          facilityService.getAll()
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

  const filterConfig = {
    classId: {
      label: 'Lớp học',
      options: classes.map(c => ({
        label: c.ten_lop_full || c.ten_lop,
        value: c.id,
        type: 'class'
      }))
    },
    facilityId: {
      label: 'Cơ sở',
      options: facilities.map(f => ({
        label: f.ten_co_so,
        value: f.id,
        type: 'facility'
      }))
    }
  };

  return (
    <FilterGroups
      filters={filterConfig}
      values={filters}
      onChange={onFilterChange}
      onReset={onReset}
    />
  );
};

export default EnrollmentFilters;
