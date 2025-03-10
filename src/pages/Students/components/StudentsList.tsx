import React from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { CalendarDays, Flag, User, UserPlus } from 'lucide-react';

interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onAddStudent: () => void;
  onRowClick: (student: Student) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ data, isLoading: loading, onAddStudent, onRowClick }) => {
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
      <div className="flex justify-end mb-4">
        <Button onClick={onAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default StudentsList;
