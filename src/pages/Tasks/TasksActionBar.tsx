
import React from 'react';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TasksActionBarProps {
  onRefresh: () => void;
  onAddClick: () => void;
}

const TasksActionBar: React.FC<TasksActionBarProps> = ({ onRefresh, onAddClick }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Công Việc
      </Button>
    </div>
  );
};

export default TasksActionBar;
