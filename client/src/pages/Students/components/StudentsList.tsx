
import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import ExportButton from '@/components/ui/ExportButton';
import DetailPanel from '@/components/ui/DetailPanel';
import StudentDetail from './StudentDetail';
import FilterButton from '@/components/ui/FilterButton';
import StudentTable from './StudentTable';
import useStudentFilters from '../hooks/useStudentFilters';

interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onAddStudent: () => void;
  onRowClick: (student: Student) => void;
  onRefresh?: () => Promise<void>;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  data, 
  isLoading, 
  onAddStudent, 
  onRowClick, 
  onRefresh 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const { 
    filterCategories, 
    filteredData, 
    facilities, 
    setFilters 
  } = useStudentFilters(data);

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

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <FilterButton 
            categories={filterCategories} 
            onFilter={setFilters} 
            label="Lọc học sinh"
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

      <StudentTable 
        students={filteredData}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        facilities={facilities}
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
          <StudentDetail student={selectedStudent} facilities={facilities} />
        </DetailPanel>
      )}
    </div>
  );
};

export default StudentsList;
