
import React from 'react';
import { CheckSquare } from 'lucide-react';
import DataTable from "@/components/ui/DataTable";
import { Badge } from '@/components/ui/badge';
import { Task, Employee } from '@/lib/types';
import PlaceholderPage from '@/components/common/PlaceholderPage';

interface TasksListProps {
  tasks: Task[];
  isLoading: boolean;
  employees: Employee[];
  onRowClick: (task: Task) => void;
  onAddClick: () => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  isLoading, 
  employees, 
  onRowClick,
  onAddClick 
}) => {
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.ten_nhan_su : 'N/A';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: "Tên Công Việc",
      key: "ten_viec",
      sortable: true,
    },
    {
      title: "Loại Việc",
      key: "loai_viec",
      sortable: true,
    },
    {
      title: "Người Phụ Trách",
      key: "nguoi_phu_trach",
      render: (value: string) => getEmployeeName(value),
      sortable: true,
    },
    {
      title: "Ngày Đến Hạn",
      key: "ngay_den_han",
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      title: "Cấp Độ",
      key: "cap_do",
      render: (value: string) => (
        <Badge 
          variant={
            value === "urgent" ? "destructive" : 
            value === "high" ? "destructive" :
            value === "normal" ? "secondary" : 
            "outline"
          }
        >
          {value === "urgent" ? "Khẩn cấp" : 
           value === "high" ? "Cao" : 
           value === "normal" ? "Bình thường" : 
           value === "low" ? "Thấp" : value}
        </Badge>
      ),
      sortable: true,
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge 
          variant={
            value === "completed" ? "success" : 
            value === "processing" ? "default" :
            value === "pending" ? "secondary" : 
            value === "overdue" ? "destructive" :
            "outline"
          }
        >
          {value === "completed" ? "Hoàn thành" : 
           value === "processing" ? "Đang thực hiện" : 
           value === "pending" ? "Chờ xử lý" : 
           value === "overdue" ? "Quá hạn" :
           value === "cancelled" ? "Đã hủy" : value}
        </Badge>
      ),
      sortable: true,
    },
  ];

  if (tasks.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Công Việc"
        description="Quản lý danh sách công việc cần làm"
        icon={<CheckSquare className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={onAddClick}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={tasks}
      isLoading={isLoading}
      onRowClick={onRowClick}
      searchable={true}
      searchPlaceholder="Tìm kiếm công việc..."
    />
  );
};

export default TasksList;
