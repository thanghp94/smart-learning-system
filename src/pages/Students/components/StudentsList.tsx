
import React, { useState, useMemo, useEffect } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { CalendarDays, Flag, User, UserPlus, Phone, School, CreditCard, MapPin } from 'lucide-react';
import ExportButton from '@/components/ui/ExportButton';
import DetailPanel from '@/components/ui/DetailPanel';
import StudentDetail from './StudentDetail';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';
import { Link } from 'react-router-dom';
import { facilityService } from '@/lib/supabase';

interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onAddStudent: () => void;
  onRowClick: (student: Student) => void;
  onRefresh?: () => Promise<void>;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  data, 
  isLoading: loading, 
  onAddStudent, 
  onRowClick, 
  onRefresh 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
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

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedStudent(null);
  };

  const handleEdit = () => {
    if (selectedStudent) {
      onRowClick(selectedStudent);
    }
  };

  // Extract unique status values from data for filter options
  const statusOptions = useMemo(() => {
    const statuses = [...new Set(data.map(s => s.trang_thai || 'active'))].map(status => ({
      label: status === 'active' ? 'Đang học' : 
             status === 'inactive' ? 'Đã nghỉ' : 
             status === 'pending' ? 'Chờ xử lý' : status,
      value: status,
      type: 'status' as const
    }));
    return statuses;
  }, [data]);

  // Extract unique gender values for filter options
  const genderOptions = useMemo(() => {
    const genders = [...new Set(data.map(s => s.gioi_tinh || '').filter(Boolean))].map(gender => ({
      label: gender === 'male' ? 'Nam' : 
             gender === 'female' ? 'Nữ' : gender,
      value: gender,
      type: 'other' as const
    }));
    return genders;
  }, [data]);

  // Create filter categories
  const filterCategories: FilterCategory[] = [
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions
    },
    {
      name: 'Giới tính',
      type: 'other',
      options: genderOptions
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
          if (category === 'Giới tính') {
            if (student.gioi_tinh !== value) return false;
          }
        }
      }
      return true;
    });
  }, [data, filters]);

  const columns = [
    {
      title: 'Tên học sinh',
      key: 'ho_va_ten',
      thumbnail: true,
      sortable: true,
      render: (value: string, student: Student) => (
        <span className="ml-2">{student.ten_hoc_sinh || value}</span>
      ),
    },
    {
      title: 'Phụ huynh',
      key: 'ten_ph',
      sortable: true,
      render: (value: string, student: Student) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {value || student.ten_PH || 'Chưa có thông tin'}
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      key: 'sdt_ph1',
      sortable: true,
      render: (value: string, student: Student) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {value || student.so_dien_thoai || 'Chưa có SĐT'}
        </div>
      ),
    },
    {
      title: 'Cơ sở',
      key: 'co_so_id',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <School className="h-4 w-4 text-muted-foreground" />
          {value && facilities[value] ? facilities[value] : 'Chưa xác định'}
        </div>
      ),
    },
    {
      title: 'Giới tính',
      key: 'gioi_tinh',
      sortable: true,
      render: (value: string) => (
        value === 'male' ? 'Nam' : 
        value === 'female' ? 'Nữ' : value
      ),
    },
    {
      title: 'Ngày sinh',
      key: 'ngay_sinh',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      key: 'dia_chi',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{value || 'Chưa có thông tin'}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          {value === 'active' ? 'Đang học' : 
           value === 'inactive' ? 'Đã nghỉ' : 
           value === 'pending' ? 'Chờ xử lý' : value || 'Đang học'}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <FilterButton 
            categories={filterCategories} 
            onFilter={setFilters} 
          />
          <ExportButton 
            data={filteredData}
            filename="danh_sach_hoc_sinh"
            label="Xuất dữ liệu"
          />
        </div>
        <Button onClick={onAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm học sinh
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={loading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm học sinh..."
      />

      {selectedStudent && (
        <DetailPanel
          title={`Chi tiết học sinh: ${selectedStudent.ten_hoc_sinh || selectedStudent.ho_va_ten}`}
          isOpen={detailOpen}
          onClose={handleDetailClose}
          footerContent={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link to={`/finance/entity/student/${selectedStudent.id}`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thu chi
                </Link>
              </Button>
              <Button variant="default" onClick={handleEdit}>
                Sửa thông tin
              </Button>
            </div>
          }
        >
          <StudentDetail student={selectedStudent} facilities={facilities} />
        </DetailPanel>
      )}
    </div>
  );
};

export default StudentsList;
