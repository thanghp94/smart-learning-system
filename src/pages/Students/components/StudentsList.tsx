
import React, { useState, useMemo } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { CalendarDays, Flag, User, UserPlus } from 'lucide-react';
import ExportButton from '@/components/ui/ExportButton';
import DetailPanel from '@/components/ui/DetailPanel';
import StudentDetail from './StudentDetail';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';

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
    const statuses = [...new Set(data.map(s => s.trang_thai || 'Active'))].map(status => ({
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
              <Button variant="default" onClick={handleEdit}>
                Sửa thông tin
              </Button>
            </div>
          }
        >
          <StudentDetail student={selectedStudent} />
        </DetailPanel>
      )}
    </div>
  );
};

export default StudentsList;
