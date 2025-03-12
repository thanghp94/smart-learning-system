import React from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';

interface TasksListProps {
  tasks: Task[];
  isLoading: boolean;
  onRowClick: (task: Task) => void;
  onAddClick: () => void;
  onRefresh: () => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  isLoading,
  onRowClick,
  onAddClick,
  onRefresh,
}) => {
  const columns = [
    {
      title: 'Tiêu đề',
      key: 'tieu_de',
      sortable: true,
    },
    {
      title: 'Mô tả',
      key: 'mo_ta',
    },
    {
      title: 'Ngày hết hạn',
      key: 'ngay_het_han',
      sortable: true,
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm nhiệm vụ
      </Button>
    </div>
  );

  return (
    <>
      <div className="mb-4">{tableActions}</div>
      <DataTable
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        onRowClick={onRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm nhiệm vụ..."
      />
    </>
  );
};

export default TasksList;
