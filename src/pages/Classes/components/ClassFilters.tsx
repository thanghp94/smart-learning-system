
import React, { useEffect, useState } from 'react';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';
import { facilityService } from '@/lib/supabase';

interface ClassFiltersProps {
  onFilter: (filters: Record<string, string>) => void;
}

const ClassFilters: React.FC<ClassFiltersProps> = ({ onFilter }) => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch facilities
        const facilitiesData = await facilityService.getAll();
        setFacilities(facilitiesData);

        // Get unique programs from classes
        // This will be different for your system
        // Example: you would fetch all classes and extract unique ct_hoc values
        setPrograms([
          { id: 'toeic', name: 'TOEIC' },
          { id: 'ielts', name: 'IELTS' },
          { id: 'general', name: 'Tiếng Anh giao tiếp' },
          { id: 'kids', name: 'Tiếng Anh trẻ em' },
        ]);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const facilityOptions = facilities.map(facility => ({
    label: facility.ten_co_so,
    value: facility.id,
    type: 'facility' as const
  }));

  const programOptions = programs.map(program => ({
    label: program.name,
    value: program.id,
    type: 'other' as const
  }));

  const statusOptions = [
    { label: 'Đang hoạt động', value: 'active', type: 'status' as const },
    { label: 'Đã kết thúc', value: 'inactive', type: 'status' as const },
    { label: 'Tạm ngưng', value: 'pending', type: 'status' as const },
  ];

  const filterCategories: FilterCategory[] = [
    {
      name: 'Cơ sở',
      type: 'facility',
      options: facilityOptions
    },
    {
      name: 'Chương trình',
      type: 'other',
      options: programOptions
    },
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions
    },
  ];

  return (
    <div className="mb-4">
      <FilterButton 
        categories={filterCategories} 
        onFilter={onFilter} 
      />
    </div>
  );
};

export default ClassFilters;
