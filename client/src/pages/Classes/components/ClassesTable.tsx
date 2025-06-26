
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { Class } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ClassesTableProps {
  classes: Class[];
  isLoading: boolean;
  onRowClick: (classData: Class) => void;
}

const ClassesTable: React.FC<ClassesTableProps> = ({ 
  classes, 
  isLoading, 
  onRowClick 
}) => {
  const columns = [
    {
      title: "Tên Lớp Đầy Đủ",
      key: "ten_lop_full",
      sortable: true,
      width: "30%",
    },
    {
      title: "Tên Lớp",
      key: "ten_lop",
      sortable: true,
      width: "20%",
    },
    {
      title: "Chương Trình",
      key: "ct_hoc",
      width: "15%",
    },
    {
      title: "Ngày Bắt Đầu",
      key: "ngay_bat_dau",
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
      width: "15%",
      className: "text-center",
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      width: "20%",
      className: "text-center",
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : value === "inactive" ? "destructive" : "secondary"}>
          {value === "active" ? "Đang hoạt động" : value === "inactive" ? "Ngừng hoạt động" : "Chờ xử lý"}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={classes}
      isLoading={isLoading}
      onRowClick={onRowClick}
      searchable={true}
      searchPlaceholder="Tìm kiếm lớp học..."
    />
  );
};

export default ClassesTable;
