
import { useState, useEffect, useMemo } from 'react';
import { Student } from '@/lib/types';
import { FilterCategory } from '@/components/ui/FilterButton';
import { facilityService } from '@/lib/supabase';

export default function useStudentFilters(data: Student[]) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [facilities, setFacilities] = useState<{[key: string]: string}>({});

  // Fetch facilities to map IDs to names
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await facilityService.getAll();
        const facilitiesMap = {};
        facilitiesData.forEach(facility => {
          facilitiesMap[facility.id] = facility.ten_co_so;
        });
        setFacilities(facilitiesMap);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      }
    };
    
    fetchFacilities();
  }, []);

  // Extract unique status values for filter options
  const statusOptions = useMemo(() => {
    return [...new Set(data.map(s => s.trang_thai || 'active'))].map(status => ({
      label: status === 'active' ? 'Đang học' : 
             status === 'inactive' ? 'Đã nghỉ' : 
             status === 'pending' ? 'Chờ xử lý' : status,
      value: status,
      type: 'status' as const
    }));
  }, [data]);

  // Extract unique facility values for filter options
  const facilityOptions = useMemo(() => {
    const facilityIds = [...new Set(data.map(s => s.co_so_id || '').filter(Boolean))];
    return facilityIds.map(id => ({
      label: facilities[id] || id,
      value: id,
      type: 'facility' as const
    }));
  }, [data, facilities]);

  // Extract unique tuition status for filter options
  const tuitionStatusOptions = useMemo(() => {
    return [...new Set(data.map(s => s.trang_thai_hoc_phi || 'unknown').filter(Boolean))].map(status => ({
      label: status === 'paid' ? 'Đã đóng' : 
             status === 'pending' ? 'Chưa đóng' : 
             status === 'partial' ? 'Đóng một phần' :
             status === 'overdue' ? 'Quá hạn' : status,
      value: status,
      type: 'status' as const
    }));
  }, [data]);

  // Create filter categories
  const filterCategories: FilterCategory[] = [
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions
    },
    {
      name: 'Cơ sở',
      type: 'facility',
      options: facilityOptions
    },
    {
      name: 'Học phí',
      type: 'status',
      options: tuitionStatusOptions
    }
  ];

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(student => {
      // Check each filter
      for (const [category, value] of Object.entries(filters)) {
        if (value) {
          if (category === 'Trạng thái') {
            const studentStatus = student.trang_thai || 'active';
            if (studentStatus !== value) return false;
          }
          if (category === 'Cơ sở') {
            if (student.co_so_id !== value) return false;
          }
          if (category === 'Học phí') {
            if (student.trang_thai_hoc_phi !== value) return false;
          }
        }
      }
      return true;
    });
  }, [data, filters]);

  return {
    filterCategories,
    filteredData,
    facilities,
    setFilters
  };
}
