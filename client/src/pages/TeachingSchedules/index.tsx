
import React from 'react';
import TablePageLayout from '@/components/common/TablePageLayout';
import { CalendarRange, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeachingSchedules = () => {
  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Bộ lọc
      </Button>
      
      <Button variant="outline" size="sm" className="h-8">
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Lịch dạy"
      description="Quản lý lịch dạy của giáo viên"
      actions={tableActions}
    >
      <div>Teaching Schedules Content</div>
    </TablePageLayout>
  );
};

export default TeachingSchedules;
