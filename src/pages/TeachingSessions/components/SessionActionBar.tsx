
import React from 'react';
import { Calendar, Filter, RotateCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportButton from '@/components/ui/ExportButton';
import { TeachingSession } from '@/lib/types';

interface SessionActionBarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  sessions: TeachingSession[];
  selectedDate: Date;
  onDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SessionActionBar: React.FC<SessionActionBarProps> = ({
  onAddClick,
  onRefresh,
  sessions,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        <input
          type="date"
          className="border rounded px-2 py-1"
          onChange={onDateChange}
          value={selectedDate.toISOString().split('T')[0]}
        />
      </div>
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <ExportButton 
        data={sessions} 
        filename="Danh_sach_buoi_hoc" 
        label="Xuất dữ liệu"
      />
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Buổi Học
      </Button>
    </div>
  );
};

export default SessionActionBar;
