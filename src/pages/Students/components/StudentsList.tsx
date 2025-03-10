
import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { CalendarDays, Flag, User, UserPlus, Download } from 'lucide-react';
import ExportButton from '@/components/ui/ExportButton';
import DetailPanel from '@/components/ui/DetailPanel';
import StudentDetail from './StudentDetail';

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

  const columns = [
    {
      title: 'Name',
      key: 'ten_hoc_sinh',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      title: 'Gender',
      key: 'gioi_tinh',
      sortable: true,
    },
    {
      title: 'Date of Birth',
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
      title: 'Status',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          {value || 'Active'}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <ExportButton 
          data={data}
          filename="students_list"
          label="Xuất dữ liệu"
        />
        <Button onClick={onAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
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
