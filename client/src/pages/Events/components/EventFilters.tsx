
import React, { useEffect, useState } from 'react';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';
import { facilityService } from "@/lib/database";

interface EventFiltersProps {
  onFilter: (filters: Record<string, string>) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFilter }) => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch facilities
        const facilitiesData = await facilityService.getAll();
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Error fetching facilities:', error);
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

  const statusOptions = [
    { label: 'Chờ xử lý', value: 'pending', type: 'status' as const },
    { label: 'Đang diễn ra', value: 'active', type: 'status' as const },
    { label: 'Đã hoàn thành', value: 'completed', type: 'status' as const },
    { label: 'Đã hủy', value: 'cancelled', type: 'status' as const },
  ];

  const eventTypeOptions = [
    { label: 'Họp', value: 'meeting', type: 'other' as const },
    { label: 'Hội thảo', value: 'workshop', type: 'other' as const },
    { label: 'Sự kiện', value: 'event', type: 'other' as const },
    { label: 'Tuyển dụng', value: 'recruitment', type: 'other' as const },
  ];

  const filterCategories: FilterCategory[] = [
    {
      name: 'Cơ sở',
      type: 'facility',
      options: facilityOptions
    },
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions
    },
    {
      name: 'Loại sự kiện',
      type: 'other',
      options: eventTypeOptions
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

export default EventFilters;
