
import React from 'react';
import { Student } from '@/lib/types';
import { DataTable } from '@/components/ui/DataTable';
import { CalendarDays, Flag, User, Phone, School, MapPin } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onRowClick: (student: Student) => void;
  facilities: {[key: string]: string};
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  isLoading, 
  onRowClick,
  facilities 
}) => {
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
    <DataTable
      columns={columns}
      data={students}
      isLoading={isLoading}
      onRowClick={onRowClick}
      searchable={true}
      searchPlaceholder="Tìm kiếm học sinh..."
    />
  );
};

export default StudentTable;
