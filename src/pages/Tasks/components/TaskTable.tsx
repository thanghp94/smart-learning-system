
import React from 'react';
import DataTable from '@/components/ui/data-table';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Eye } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskComplete: (taskId: string) => void;
  onTaskView?: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ 
  tasks, 
  isLoading, 
  onTaskComplete,
  onTaskView 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Chờ xử lý</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Đang xử lý</Badge>;
      case 'completed':
        return <Badge variant="success">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Thấp</Badge>;
      case 'medium':
        return <Badge variant="secondary">Trung bình</Badge>;
      case 'high':
        return <Badge variant="warning">Cao</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const columns = [
    {
      title: 'Tên công việc',
      key: 'ten_viec',
      sortable: true,
    },
    {
      title: 'Loại công việc',
      key: 'loai_viec',
      sortable: true,
      render: (value: string) => value || '--',
    },
    {
      title: 'Người phụ trách',
      key: 'ten_nguoi_phu_trach',
      sortable: true,
      render: (value: string) => value || '--',
    },
    {
      title: 'Ngày hạn',
      key: 'ngay_den_han',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Cấp độ',
      key: 'cap_do',
      sortable: true,
      render: (value: string) => getPriorityBadge(value),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (value: string, record: Task) => (
        <div className="flex space-x-2">
          {record.trang_thai !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onTaskComplete(record.id);
              }}
            >
              <Check className="h-4 w-4 mr-1" /> Hoàn thành
            </Button>
          )}
          {onTaskView && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onTaskView(record);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tasks}
      isLoading={isLoading}
      searchable={true}
      searchPlaceholder="Tìm kiếm công việc..."
    />
  );
};

export default TaskTable;
